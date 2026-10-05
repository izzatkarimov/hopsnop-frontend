/**
 * Whether the text is an absolute http(s) URL.
 * Every other scheme (javascript:, data:, file:, ...) is refused, which is
 * what makes a user-supplied URL acceptable as the source of an image.
 */
export function isHttpUrl(value: string): boolean {
  try {
    const { protocol } = new URL(value);
    return protocol === "http:" || protocol === "https:";
  } catch {
    return false;
  }
}
