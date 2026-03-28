"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { sendMessage } from "@/lib/api/chat";
import type { ChatMessage, AsyncState } from "@/types";

interface StoredScanData {
  session_id: string;
  classification: string;
  confidence: number;
  answer: string;
  sources: string[];
}

interface UseChatReturn {
  messages: ChatMessage[];
  sendState: AsyncState<null>;
  isTyping: boolean;
  send: (content: string) => Promise<void>;
  scanData: { classification: string; confidence: number } | null;
}

export function useChat(sessionId: string): UseChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sendState, setSendState] = useState<AsyncState<null>>({
    status: "idle",
  });
  const [isTyping, setIsTyping] = useState(false);
  const [scanData, setScanData] = useState<{
    classification: string;
    confidence: number;
  } | null>(null);
  const hasInitialized = useRef(false);

  // On mount: read scan data from sessionStorage and display initial AI response
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const stored = sessionStorage.getItem("lupustic_scan");
    if (!stored) return;

    try {
      const parsedScanData: StoredScanData = JSON.parse(stored);
      setScanData({
        classification: parsedScanData.classification,
        confidence: parsedScanData.confidence,
      });

      // The /first-chat endpoint already returned the AI's classification report,
      // so we display it directly as the first assistant message.
      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: parsedScanData.answer,
        sources: parsedScanData.sources,
        timestamp: new Date().toISOString(),
        scanData: {
          classification: parsedScanData.classification,
          confidence: parsedScanData.confidence,
        },
      };

      const interactiveMessage: ChatMessage = {
        role: "assistant",
        content: "Please select any of the following symptoms you have experienced:",
        interactive: "symptoms",
        timestamp: new Date().toISOString(),
      };

      setMessages([assistantMessage, interactiveMessage]);
    } catch {
      // Invalid sessionStorage data — silently ignore
    }
  }, [sessionId]);

  const send = useCallback(
    async (content: string) => {
      if (!content.trim()) return;

      const userMessage: ChatMessage = {
        role: "user",
        content: content.trim(),
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setSendState({ status: "loading" });
      setIsTyping(true);

      try {
        const response = await sendMessage({
          session_id: sessionId,
          message: content.trim(),
        });

        const assistantMessage: ChatMessage = {
          role: "assistant",
          content: response.answer,
          sources: response.sources,
          timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
        setSendState({ status: "success", data: null });
      } catch (error) {
        const errorMsg =
          error instanceof Error
            ? error.message
            : "Failed to send message. Please try again.";
        setSendState({ status: "error", message: errorMsg });

        const errorMessage: ChatMessage = {
          role: "assistant",
          content:
            "I'm sorry, I'm having trouble connecting right now. Please try sending your message again.",
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsTyping(false);
      }
    },
    [sessionId]
  );

  return {
    messages,
    sendState,
    isTyping,
    send,
    scanData,
  };
}
