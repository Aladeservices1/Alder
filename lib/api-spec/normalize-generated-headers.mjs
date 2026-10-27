import { readFile, writeFile } from "node:fs/promises";

const clientFile = new URL("../api-client-react/src/generated/api.ts", import.meta.url);
const source = await readFile(clientFile, "utf8");

// Orval's inline fetch helper includes readonly array values in the return type,
// which is wider than browser HeadersInit. Use the browser's own normalization
// for Headers, tuple arrays, and string records instead.
const helperPattern =
  /const getHeaders = \(h\?: NonNullable<RequestInit\['headers'\]>\): Record<string, string \| readonly string\[\]> => \{[\s\S]*?\n  \};/g;
const expectedHelpers = source.match(/const getHeaders = /g)?.length ?? 0;
const matchedHelpers = source.match(helperPattern)?.length ?? 0;
const mergePattern =
  /headers: \{ 'Content-Type': 'application\/json', \.\.\.getHeaders\(options\?\.headers\) \}/g;
const matchedMerges = source.match(mergePattern)?.length ?? 0;

// Fail visibly if an Orval upgrade changes its template; never silently leave
// uncorrected helpers in the generated client.
if (
  expectedHelpers === 0 ||
  matchedHelpers !== expectedHelpers ||
  matchedMerges !== expectedHelpers
) {
  throw new Error("Orval header helper changed; update the normalization step.");
}

await writeFile(
  clientFile,
  source
    .replace(
      helperPattern,
      `const getHeaders = (h?: HeadersInit): Record<string, string> => {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    new Headers(h).forEach((value, name) => headers.set(name, value));
    return Object.fromEntries(headers.entries());
  };`,
    )
    .replace(mergePattern, "headers: getHeaders(options?.headers)"),
);
