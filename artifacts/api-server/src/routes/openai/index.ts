import { Router } from "express";
import { eq } from "drizzle-orm";
import { db } from "@workspace/db";
import { conversations, messages } from "@workspace/db/schema";
import { openai } from "@workspace/integrations-openai-ai-server";

const router = Router();

const SYSTEM_PROMPT = `You are a warm, knowledgeable care advisor for Alder Home — a trusted adult home care service based in Portland, Oregon. Your role is to help families and individuals understand Alder Home's services, answer questions about adult home care, and provide gentle guidance.

Alder Home offers three core services:
- Personal Care: Bathing, grooming, and dressing approached with patience and dignity
- Genuine Companionship: Conversation, errands, and presence that make days feel whole
- Medical Reminders: Medication monitoring and appointment coordination with care

You speak with warmth, patience, and quiet confidence. You never push or pressure. You acknowledge that reaching out for home care help is often a difficult and emotional decision, and you meet people where they are. Keep responses concise but caring — typically 2-4 sentences unless more detail is needed.

If someone asks to speak with a person or schedule a visit, invite them to reach out at info@alderhomecare.org or call (971) 346-2026.

You do NOT discuss pricing specifics. You do NOT provide medical diagnoses or treatment advice. You focus on how Alder Home can support daily life with dignity.`;

router.post("/conversations", async (req, res) => {
  try {
    const { title } = req.body as { title?: string };
    const [conversation] = await db
      .insert(conversations)
      .values({ title: title ?? "New Conversation" })
      .returning();
    res.status(201).json(conversation);
  } catch (err) {
    req.log.error({ err }, "Failed to create conversation");
    res.status(500).json({ error: "Failed to create conversation" });
  }
});

router.post("/conversations/:id/messages", async (req, res) => {
  const id = Number(req.params.id);
  const { content } = req.body as { content?: string };

  if (!content?.trim()) {
    res.status(400).json({ error: "Message content is required" });
    return;
  }

  try {
    const conversation = await db.query.conversations.findFirst({
      where: eq(conversations.id, id),
    });

    if (!conversation) {
      res.status(404).json({ error: "Conversation not found" });
      return;
    }

    await db.insert(messages).values({
      conversationId: id,
      role: "user",
      content: content.trim(),
    });

    const history = await db.query.messages.findMany({
      where: eq(messages.conversationId, id),
      orderBy: (m, { asc }) => [asc(m.createdAt)],
    });

    const chatMessages = history.map((m) => ({
      role: m.role as "user" | "assistant" | "system",
      content: m.content,
    }));

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const stream = await openai.chat.completions.create({
      model: "gpt-5.4",
      max_completion_tokens: 8192,
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...chatMessages],
      stream: true,
    });

    let fullResponse = "";
    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content;
      if (delta) {
        fullResponse += delta;
        res.write(`data: ${JSON.stringify({ content: delta })}\n\n`);
      }
    }

    await db.insert(messages).values({
      conversationId: id,
      role: "assistant",
      content: fullResponse,
    });

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (err) {
    req.log.error({ err }, "Failed to send message");
    if (!res.headersSent) {
      res.status(500).json({ error: "Failed to process message" });
    } else {
      res.write(`data: ${JSON.stringify({ error: "Stream error" })}\n\n`);
      res.end();
    }
  }
});

export default router;
