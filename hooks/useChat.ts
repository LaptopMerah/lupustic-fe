"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import type { ChatMessage, AsyncState } from "@/types";

// TODO: Replace mock with real API call when backend is ready
// import { sendMessage } from "@/lib/api/chat";
async function mockReply(
  message: string,
  resultLabel?: string,
  confidence?: number
): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 1200));

  if (message.includes("scan result") && resultLabel && confidence !== undefined) {
    const analysisHeader = `📋 **Analysis Result**\nBased on our AI model's analysis:\n- **Result:** ${resultLabel}\n- **Confidence:** ${Math.round(confidence)}%\n`;

    return `${analysisHeader}\nThank you for sharing your scan results. Based on the AI analysis showing potential lupus indicators, I'd recommend we discuss a few important points:\n\n1. **Don't panic** — This is a screening tool, not a diagnosis. Only a qualified dermatologist or rheumatologist can confirm lupus.\n\n2. **Common symptoms to watch for:**\n   - Butterfly-shaped rash across the cheeks and nose\n   - Joint pain or swelling\n   - Fatigue and fever\n   - Sensitivity to sunlight\n\n3. **Recommended next steps:**\n   - Schedule an appointment with a dermatologist\n   - Request an ANA (antinuclear antibody) blood test\n   - Keep track of any symptoms you notice\n\nWould you like to tell me about any other symptoms you've been experiencing?`;
  }

  if (message.includes("scan result")) {
    return "Thank you for sharing your scan results. Based on the AI analysis showing potential lupus indicators, I'd recommend we discuss a few important points:\n\n1. **Don't panic** — This is a screening tool, not a diagnosis. Only a qualified dermatologist or rheumatologist can confirm lupus.\n\n2. **Common symptoms to watch for:**\n   - Butterfly-shaped rash across the cheeks and nose\n   - Joint pain or swelling\n   - Fatigue and fever\n   - Sensitivity to sunlight\n\n3. **Recommended next steps:**\n   - Schedule an appointment with a dermatologist\n   - Request an ANA (antinuclear antibody) blood test\n   - Keep track of any symptoms you notice\n\nWould you like to tell me about any other symptoms you've been experiencing?";
  }

  return "I understand your concern. Could you provide more details about your symptoms? For instance:\n\n- How long have you noticed the skin changes?\n- Do you experience any joint pain or fatigue?\n- Are the symptoms worse after sun exposure?\n\nThis information can help guide our discussion, though I always recommend consulting a physician for professional medical advice.";
}

interface ScanData {
  result: "lupus" | "not_lupus";
  confidence: number;
}

interface UseChatReturn {
  messages: ChatMessage[];
  sendState: AsyncState<null>;
  isTyping: boolean;
  send: (content: string) => Promise<void>;
}

export function useChat(sessionId: string): UseChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sendState, setSendState] = useState<AsyncState<null>>({
    status: "idle",
  });
  const [isTyping, setIsTyping] = useState(false);
  const hasInitialized = useRef(false);

  // On mount: read scan result from sessionStorage and auto-send first message
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const stored = sessionStorage.getItem("lupustic_scan");
    if (!stored) return;

    try {
      const scanData: ScanData = JSON.parse(stored);
      const resultLabel =
        scanData.result === "lupus"
          ? "Potential Lupus Indicators Detected"
          : "No Lupus Indicators Detected";

      // Auto-send first user message (no system message — the AI delivers the analysis result)
      const firstMessage = `I just received a scan result: ${scanData.result} with ${Math.round(scanData.confidence)}% confidence. What should I know and what are the next steps?`;

      const autoSend = async () => {
        const userMessage: ChatMessage = {
          role: "user",
          content: firstMessage,
          timestamp: new Date().toISOString(),
        };

        setMessages([userMessage]);
        setIsTyping(true);

        try {
          const reply = await mockReply(firstMessage, resultLabel, scanData.confidence);

          const assistantMessage: ChatMessage = {
            role: "assistant",
            content: reply,
            timestamp: new Date().toISOString(),
          };

          setMessages((prev) => [...prev, assistantMessage]);
        } catch {
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
      };

      autoSend();
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
        const reply = await mockReply(content.trim());

        const assistantMessage: ChatMessage = {
          role: "assistant",
          content: reply,
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
    [sessionId, messages]
  );

  return {
    messages,
    sendState,
    isTyping,
    send,
  };
}
