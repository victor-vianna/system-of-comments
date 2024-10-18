const MENTION_MARKER_START = "[/*";
const MENTION_MARKER_END = "*/]";
export function formatContentWithoutMentionMarker(commentContent: string) {
  return commentContent
    .replaceAll(MENTION_MARKER_START, "")
    .replaceAll(MENTION_MARKER_END, "");
}

export function formatMention(mentionText: string) {
  return `${MENTION_MARKER_START}${mentionText}${MENTION_MARKER_END}`;
}

export function isTextMention(text: string) {
  return (
    text.startsWith(MENTION_MARKER_START) && text.endsWith(MENTION_MARKER_END)
  );
}
