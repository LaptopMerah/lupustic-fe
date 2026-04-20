"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { analyzeImage } from "@/lib/api/scan";
import { sendMessage, getChatHistory } from "@/lib/api/chat";
import { useScanContext } from "@/lib/ScanContext";
import type {
  ChatMessage,
  AsyncState,
  SymptomsPayload,
  FirstChatResponse,
} from "@/types";

interface UseChatReturn {
  messages: ChatMessage[];
  sendState: AsyncState<null>;
  isTyping: boolean;
  isReady: boolean;
  scanData: { classification: string; confidence: number } | null;
  send: (content: string) => Promise<void>;
}

export function useChat(initialUuid: string): UseChatReturn {
  const router = useRouter();
  const { imageFile, clearImage } = useScanContext();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sendState, setSendState] = useState<AsyncState<null>>({
    status: "idle",
  });
  const [isTyping, setIsTyping] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [scanData, setScanData] = useState<{
    classification: string;
    confidence: number;
  } | null>(null);
  const [sessionId, setSessionId] = useState(initialUuid);
  const hasInitialized = useRef(false);
  const pendingSymptoms = useRef<SymptomsPayload | null>(null);

  /**
   * Submit symptoms — calls /first-chat with image + symptoms.
   * Internal only — triggered automatically from sessionStorage.
   */
  const submitSymptoms = useCallback(
    async (symptoms: SymptomsPayload) => {
      if (!imageFile) return;

      setSendState({ status: "loading" });
      setIsTyping(true);

      // Add a user message showing which symptoms were selected
      const selectedLabels = Object.entries(symptoms)
        .filter(([, value]) => value)
        .map(([key]) => key.replace(/_/g, " "));

      const userSymptomMsg: ChatMessage = {
        role: "user",
        content:
          selectedLabels.length > 0
            ? `Regarding my skin condition and the symptoms I'm experiencing (${selectedLabels.join(", ")}), do I have lupus?`
            : "I have not experienced any of those symptoms. Do I have lupus?",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userSymptomMsg]);

      try {
        const data: FirstChatResponse = await analyzeImage(imageFile, symptoms);

        // Store result
        setScanData({
          classification: data.classification,
          confidence: data.confidence,
        });
        setSessionId(data.session_id);

        // Update the URL to use the real session_id
        router.replace(`/chat/${data.session_id}`);

        // Show the AI response
        const assistantMessage: ChatMessage = {
          role: "assistant",
          content: data.answer,
          sources: data.sources,
          timestamp: new Date().toISOString(),
          scanData: {
            classification: data.classification,
            confidence: data.confidence,
          },
        };

        setMessages((prev) => [...prev, assistantMessage]);
        setSendState({ status: "success", data: null });
        setIsReady(true);

        // Clear the image from context — no longer needed
        clearImage();
      } catch (error) {
        const errorMsg =
          error instanceof Error
            ? error.message
            : "Failed to analyze image. Please try again.";
        setSendState({ status: "error", message: errorMsg });

        const errorMessage: ChatMessage = {
          role: "assistant",
          content:
            "I'm sorry, I was unable to analyze your image. Please try again or go back to upload a new image.",
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsTyping(false);
      }
    },
    [imageFile, clearImage, router]
  );

  // On mount: check if we have an image + symptoms from /symptom page.
  // If not, load chat history from the API.
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    if (imageFile) {
      // Read symptoms from sessionStorage (set by /symptom page)
      const storedSymptoms = sessionStorage.getItem("lupustic_symptoms");
      if (storedSymptoms) {
        try {
          const symptoms = JSON.parse(storedSymptoms) as SymptomsPayload;
          sessionStorage.removeItem("lupustic_symptoms");
          pendingSymptoms.current = symptoms;
        } catch {
          // No valid symptoms — redirect back to symptom page
          router.replace("/symptom");
        }
        return;
      }
      // Image but no symptoms — redirect to symptom page
      router.replace("/symptom");
      return;
    }

    // No image in context — try loading chat history from the API
    async function loadHistory() {
      try {
        const history = await getChatHistory(initialUuid);

        setScanData(
          history.classification && history.confidence != null
            ? {
                classification: history.classification,
                confidence: history.confidence,
              }
            : null
        );
        setSessionId(history.session_id);

        // Find the index of the first user message (the raw symptom text from backend)
        const firstUserIdx = history.messages.findIndex(
          (m) => m.role === "user"
        );

        // Convert API messages to ChatMessage format
        const chatMessages: ChatMessage[] = history.messages
          .map((msg, idx) => {
            // Skip the first user message — we'll replace it with the formatted version
            if (idx === firstUserIdx) {
              return null;
            }

            return {
              role: msg.role as ChatMessage["role"],
              content: msg.content,
              sources: msg.sources ?? undefined,
              timestamp: msg.created_at ?? undefined,
              // Attach scanData to the first assistant message
              ...(msg.role === "assistant" &&
                history.classification &&
                history.confidence != null &&
                history.messages.findIndex((m) => m.role === "assistant") ===
                  idx
                ? {
                    scanData: {
                      classification: history.classification,
                      confidence: history.confidence,
                    },
                  }
                : {}),
            } as ChatMessage;
          })
          .filter((msg): msg is ChatMessage => msg !== null);

        // Reconstruct the formatted user message from the first user's raw content
        if (firstUserIdx !== -1) {
          const rawContent = history.messages[firstUserIdx].content;
          const rawTimestamp = history.messages[firstUserIdx].created_at;

          const formattedMsg: ChatMessage = {
            role: "user",
            content: rawContent,
            timestamp: rawTimestamp ?? undefined,
          };

          const insertIdx = history.messages
            .slice(0, firstUserIdx)
            .filter((m) => m.role !== "user" || history.messages.indexOf(m) !== firstUserIdx)
            .length;
          chatMessages.splice(insertIdx, 0, formattedMsg);
        }

        setMessages(chatMessages);
        setIsReady(true);
      } catch {
        // API failed — redirect to scan
        router.replace("/scan");
      }
    }

    loadHistory();
  }, [imageFile, initialUuid, router]);

  // Auto-submit symptoms that were pre-filled from /symptom page
  useEffect(() => {
    if (pendingSymptoms.current) {
      const symptoms = pendingSymptoms.current;
      pendingSymptoms.current = null;
      void submitSymptoms(symptoms);
    }
  }, [submitSymptoms]);

  /**
   * Send a follow-up message in the chat.
   * Calls POST /chat.
   */
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
    isReady,
    scanData,
    send,
  };
}
