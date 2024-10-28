const commentContent =
  "@Lucas Fernandes, boa tarde. Tudo certo ? Conseguiu falar com o @Victor Vianna ?";

const mentionRegex = /@(\w+(?:\s\w+)?)/g;
const mentionedUsernames = Array.from(
  commentContent.matchAll(mentionRegex),
  (m) => m[1],
);

console.log(mentionedUsernames);
