import assert from "node:assert/strict";
import { test } from "node:test";
import {
  createOpenaiConversation,
  sendOpenaiMessage,
} from "../api-client-react/src/generated/api.ts";

test("generated POST clients merge HeadersInit case-insensitively", async () => {
  const originalFetch = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (_input, init) => {
    calls.push(init);
    return new Response(
      JSON.stringify({ id: 1, title: "test", createdAt: "2026-10-27T00:00:00Z" }),
      { headers: { "Content-Type": "application/json" } },
    );
  };
  try {
    const contentType = "application/json; charset=utf-8";
    const inputs = [
      undefined,
      new Headers({ "Content-Type": contentType, "X-Test": "headers" }),
      [["CONTENT-TYPE", contentType], ["X-Test", "tuple"]],
      { "cOnTeNt-TyPe": contentType, "X-Test": "record" },
    ];
    for (const headers of inputs) {
      await createOpenaiConversation({ title: "test" }, { headers });
      await sendOpenaiMessage(1, { content: "test" }, { headers });
      for (const call of calls.splice(0)) {
        const actual = new Headers(call.headers);
        assert.equal(call.method, "POST");
        assert.equal(
          actual.get("content-type"),
          headers ? contentType : "application/json",
        );
        assert.equal(actual.get("x-test"), new Headers(headers).get("x-test"));
        assert.ok(!actual.get("content-type").includes(","));
      }
    }
  } finally {
    globalThis.fetch = originalFetch;
  }
});
