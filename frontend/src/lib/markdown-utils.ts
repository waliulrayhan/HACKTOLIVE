export const normalizeMarkdownForRender = (value?: string): string => {
  if (!value) return "";

  let normalized = value;

  // Handle content that arrives with escaped newlines (e.g. "\\n")
  if (normalized.includes("\\n") && !normalized.includes("\n")) {
    normalized = normalized
      .replace(/\\r\\n/g, "\n")
      .replace(/\\n/g, "\n")
      .replace(/\\r/g, "\n");
  }

  // Normalize line endings
  normalized = normalized.replace(/\r\n?/g, "\n");

  // Keep markdown blocks parse-friendly after HTML blocks
  normalized = normalized.replace(
    /(<\/(?:div|section|article|table|details|summary|blockquote|p)>)\n?(?=(?:---|#{1,6}\s|[-*+]\s|\d+\.\s))/gi,
    "$1\n\n"
  );

  return normalized;
};

export const normalizeMarkdownForStorage = (value?: string): string => {
  if (!value) return "";

  return normalizeMarkdownForRender(value)
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};
