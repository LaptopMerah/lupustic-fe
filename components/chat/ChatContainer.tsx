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
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    const viewport = containerRef.current?.querySelector<HTMLDivElement>(
      "[data-slot='scroll-area-viewport']"
    );
    if (viewport) {
      viewport.scrollTop = viewport.scrollHeight;
    }
  }, [messages, isTyping, children]);

  return (
    <div ref={containerRef} className="relative flex-1 overflow-hidden">
      <ScrollArea className="h-full">
        {/* Background image layer */}
        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-10"
          style={{
            backgroundImage: "url(/chat-bg.webp)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "repeat",
          }}
        />

        {/* Chat content */}
        <div className="relative z-10 flex flex-col gap-1 py-4">
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
    </div>
  );
}
