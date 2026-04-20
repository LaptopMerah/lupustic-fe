"use client";

import { use } from "react";
import { useChat } from "@/hooks/useChat";
import { ChatContainer } from "@/components/chat/ChatContainer";
import { ChatInput } from "@/components/chat/ChatInput";

interface ChatPageProps {
  params: Promise<{ uuid: string }>;
}

export default function ChatPage({ params }: ChatPageProps) {
  const { uuid } = use(params);
  const { messages, isTyping, isReady, send } = useChat(uuid);

  return (
    <div className="flex h-[calc(100vh-4rem-1px)] flex-col">
      <ChatContainer messages={messages} isTyping={isTyping} />

      {isReady && (
        <ChatInput onSend={send} disabled={isTyping} />
      )}
    </div>
  );
}
