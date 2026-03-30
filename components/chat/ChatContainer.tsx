"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "./ChatMessage";
import { TypingIndicator } from "./TypingIndicator";
import type { ChatMessage as ChatMessageType } from "@/types";

interface ChatContainerProps {
  messages: ChatMessageType[];
  isTyping: boolean;
  children?: ReactNode;
}

export function ChatContainer({ messages, isTyping, children }: ChatContainerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, children]);

  return (
    <ScrollArea className="flex-1" ref={scrollRef}>
      <div className="flex flex-col gap-1 py-4">
        {messages.length === 0 && !children && (
          <div className="flex h-48 items-center justify-center">
            <p className="text-sm text-muted-foreground">
              Select your symptoms below to begin your consultation.
            </p>
          </div>
        )}
        {children}
        {messages.map((message, index) => (
          <ChatMessage
            key={`${message.role}-${index}`}
            message={message}
          />
        ))}
        {isTyping && <TypingIndicator />}
      </div>
    </ScrollArea>
  );
}
