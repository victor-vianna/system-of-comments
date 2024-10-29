// const commentContent =
//   "@Lucas Fernandes, boa tarde. Tudo certo ? Conseguiu falar com o @Victor Vianna ?";

// const mentionRegex = /@(\w+(?:\s\w+)?)/g;
// console.log(commentContent.matchAll(mentionRegex));

// const mentionedUsernames = Array.from(
//   commentContent.matchAll(mentionRegex),
//   (m) => m[1],
// );

// console.log(mentionedUsernames);

const commentContent =
  "@Lucas Fernandes, boa tarde. Tudo certo ? Conseguiu falar com o @Victor Vianna ?";

const mentionRegex = /@(\w+(?:\s\w+)?)/g;
const mentions = Array.from(commentContent.matchAll(mentionRegex), (m) =>
  console.log(m[1]),
);
