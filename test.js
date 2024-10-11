const list = [
  {
    id: "831ed087-e401-4519-8f3a-b27fe650d8fb",
    reactionType: "like",
    userId: "1",
    user: {
      id: "1",
      name: "Victor",
      avatar: "https://avatars.githubusercontent.com/u/81785336?v=4",
    },
  },
  {
    id: "0cc7a37a-4aab-416f-b6b1-c0e066a9c28f",
    reactionType: "🙏",
    userId: "1",
    user: {
      id: "1",
      name: "Victor",
      avatar: "https://avatars.githubusercontent.com/u/81785336?v=4",
    },
  },
  {
    id: "957c4b37-3987-4848-8c06-e6b1afd0c5cd",
    reactionType: "🫡",
    userId: "1",
    user: {
      id: "1",
      name: "Victor",
      avatar: "https://avatars.githubusercontent.com/u/81785336?v=4",
    },
  },
  {
    id: "b1c75ea0-c6cc-4ad8-b4ac-8140b6d66795",
    reactionType: "🫡",
    userId: "1",
    user: {
      id: "1",
      name: "Victor",
      avatar: "https://avatars.githubusercontent.com/u/81785336?v=4",
    },
  },
  {
    id: "75367974-14eb-4702-bb16-327b1d553569",
    reactionType: "🥰",
    userId: "1",
    user: {
      id: "1",
      name: "Victor",
      avatar: "https://avatars.githubusercontent.com/u/81785336?v=4",
    },
  },
  {
    id: "4d017603-3733-4187-96c5-1329c63d7e38",
    reactionType: "🥰",
    userId: "1",
    user: {
      id: "1",
      name: "Victor",
      avatar: "https://avatars.githubusercontent.com/u/81785336?v=4",
    },
  },
  {
    id: "dff91171-1cf0-46d3-8de2-9106a24a90a7",
    reactionType: "🙏",
    userId: "1",
    user: {
      id: "1",
      name: "Victor",
      avatar: "https://avatars.githubusercontent.com/u/81785336?v=4",
    },
  },
  {
    id: "635f1caf-6f07-47a3-95d5-91b74d50ba38",
    reactionType: "🫡",
    userId: "1",
    user: {
      id: "1",
      name: "Victor",
      avatar: "https://avatars.githubusercontent.com/u/81785336?v=4",
    },
  },
];

const grouped = list.reduce((acc, current) => {
  if (!acc[current.reactionType]) acc[current.reactionType] = 0;
  acc[current.reactionType] += 1;
  return acc;
}, {});

console.log(Object.entries(grouped).map(([key, value]) => x[1]));
