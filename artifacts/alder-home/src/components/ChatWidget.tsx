import React, { useState, useRef, useEffect, useCallback } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [streaming, setStreaming] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [open]);

  const initConversation = useCallback(async (): Promise<number> => {
    if (conversationId) return conversationId;
    const res = await fetch("/api/openai/conversations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Alder Home Inquiry" }),
    });
    const data = await res.json() as { id: number };
    setConversationId(data.id);
    return data.id;
  }, [conversationId]);

  const handleOpen = useCallback(async () => {
    setOpen(true);
    if (!initialized) {
      setInitialized(true);
      setMessages([
        {
          role: "assistant",
          content:
            "Hello, and welcome to Alder Home. I'm here to answer any questions you might have about our care services in Portland. How can I help you today?",
        },
      ]);
    }
  }, [initialized]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || streaming) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setStreaming(true);

    try {
      const id = await initConversation();

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "" },
      ]);

      const res = await fetch(`/api/openai/conversations/${id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text }),
      });

      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (!json) continue;
          try {
            const parsed = JSON.parse(json) as { content?: string; done?: boolean; error?: string };
            if (parsed.content) {
              setMessages((prev) => {
                const updated = [...prev];
                const last = updated[updated.length - 1];
                if (last && last.role === "assistant") {
                  updated[updated.length - 1] = {
                    ...last,
                    content: last.content + parsed.content,
                  };
                }
                return updated;
              });
            }
          } catch {
          }
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'm sorry, something went wrong. Please try again or reach out to us at hello@alderhome.com.",
        },
      ]);
    } finally {
      setStreaming(false);
    }
  }, [input, streaming, initConversation]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    },
    [sendMessage]
  );

  return (
    <>
      <button
        data-testid="button-chat-toggle"
        onClick={open ? () => setOpen(false) : handleOpen}
        aria-label={open ? "Close chat" : "Open chat"}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300"
        style={{
          backgroundColor: "#6B8A6E",
          color: "#FDFBF7",
          zIndex: 99999,
          cursor: "pointer",
        }}
      >
        {open ? (
          <X size={22} strokeWidth={1.5} />
        ) : (
          <MessageCircle size={22} strokeWidth={1.5} />
        )}
      </button>

      <div
        data-testid="chat-widget-panel"
        className="fixed bottom-28 right-8 transition-all duration-300 origin-bottom-right"
        style={{
          zIndex: 99998,
          width: "min(380px, calc(100vw - 2rem))",
          right: "max(1rem, env(safe-area-inset-right, 1rem))",
          bottom: "calc(4.5rem + env(safe-area-inset-bottom, 0px))",
          opacity: open ? 1 : 0,
          transform: open ? "scale(1) translateY(0)" : "scale(0.95) translateY(8px)",
          pointerEvents: open ? "auto" : "none",
        }}
      >
        <div
          className="rounded-2xl overflow-hidden flex flex-col"
          style={{
            backgroundColor: "#FDFBF7",
            boxShadow: "0 4px 32px rgba(44, 42, 40, 0.12), 0 1px 4px rgba(44, 42, 40, 0.06)",
            height: "480px",
          }}
        >
          <div
            className="px-5 py-4 flex items-center justify-between flex-shrink-0"
            style={{ backgroundColor: "#F6F3EF", borderBottom: "1px solid #E8E4DF" }}
          >
            <div>
              <p
                className="font-serif"
                style={{ fontSize: "1rem", color: "#2C2A28", letterSpacing: "-0.01em" }}
              >
                Alder Home
              </p>
              <p
                className="font-sans"
                style={{ fontSize: "0.7rem", color: "#6B6965", letterSpacing: "0.12em", textTransform: "uppercase", marginTop: "2px" }}
              >
                Care Advisor
              </p>
            </div>
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: "#6B8A6E" }}
              title="Online"
            />
          </div>

          <div
            className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3"
            style={{ scrollbarWidth: "none" }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                data-testid={`message-${msg.role}-${i}`}
                className="flex"
                style={{ justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}
              >
                <div
                  className="font-sans"
                  style={{
                    maxWidth: "82%",
                    padding: "0.625rem 0.875rem",
                    borderRadius: msg.role === "user" ? "1rem 1rem 0.25rem 1rem" : "1rem 1rem 1rem 0.25rem",
                    backgroundColor: msg.role === "user" ? "#6B8A6E" : "#F6F3EF",
                    color: msg.role === "user" ? "#FDFBF7" : "#2C2A28",
                    fontSize: "0.875rem",
                    lineHeight: "1.5",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {msg.content || (
                    <span style={{ color: "#C2CFBA" }}>
                      <Loader2 size={14} className="animate-spin inline" />
                    </span>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div
            className="px-3 py-3 flex-shrink-0 flex gap-2 items-center"
            style={{ borderTop: "1px solid #E8E4DF", backgroundColor: "#FDFBF7" }}
          >
            <input
              ref={inputRef}
              data-testid="input-chat-message"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about our services..."
              disabled={streaming}
              className="flex-1 bg-transparent outline-none font-sans"
              style={{
                fontSize: "0.875rem",
                color: "#2C2A28",
                padding: "0.5rem 0.5rem",
              }}
            />
            <button
              data-testid="button-send-message"
              onClick={sendMessage}
              disabled={!input.trim() || streaming}
              className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-opacity duration-200"
              style={{
                backgroundColor: "#6B8A6E",
                color: "#FDFBF7",
                opacity: !input.trim() || streaming ? 0.4 : 1,
              }}
            >
              {streaming ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Send size={14} strokeWidth={1.5} />
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
