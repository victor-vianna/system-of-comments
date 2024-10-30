import React from "react";
import { api } from "~/trpc/server";
import MessagesPage from "./messages";

async function TestingPage() {
  const initialMessages = await api.tests.getMessages();

  return <MessagesPage initialMessages={initialMessages} />;
}

export default TestingPage;
