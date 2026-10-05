/**
 * Maximum post length in characters. Kept in one place so it is easy to
 * change; the backend remains the authority and must enforce its own limit.
 */
export const POST_MAX_LENGTH = 300;

/**
 * Counts characters as Unicode code points, so an emoji counts as one
 * character. This matches Python's len(), which the backend will use.
 */
export function countCharacters(text: string): number {
  return Array.from(text).length;
}

export type ContentSegment =
  | { type: "text"; value: string }
  | { type: "mention"; username: string };

const MENTION_PATTERN = /(@[A-Za-z0-9_]+)/;

/**
 * Splits post text into plain text and @mention segments.
 * A mention must start the text or follow whitespace, so emails such as
 * "name@example.com" are not treated as mentions.
 * Returns data only; rendering is left to React, which escapes all text.
 */
export function parsePostContent(content: string): ContentSegment[] {
  // split() with a capture group puts the matched mentions at odd indexes.
  const parts = content.split(MENTION_PATTERN);
  const segments: ContentSegment[] = [];
  let textBefore = "";

  parts.forEach((part, index) => {
    const isMentionCandidate = index % 2 === 1;
    const startsWord = textBefore === "" || /\s$/.test(textBefore);

    if (isMentionCandidate && startsWord) {
      segments.push({ type: "mention", username: part.slice(1) });
    } else if (part !== "") {
      segments.push({ type: "text", value: part });
    }

    textBefore += part;
  });

  return segments;
}
