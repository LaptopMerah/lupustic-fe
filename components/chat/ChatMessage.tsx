import { cn } from "@/lib/utils";
import type { ChatMessage as ChatMessageType } from "@/types";

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  if (message.role === "system") {
    return (
      <div className="flex justify-center px-4 py-2">
        <p className="max-w-md text-center text-sm italic text-muted-foreground">
          {message.content}
        </p>
      </div>
    );
  }

  const isUser = message.role === "user";

  return (
    <div
      className={cn("flex w-full px-4 py-1.5", isUser ? "justify-end" : "justify-start")}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-lg px-4 py-2.5 text-sm leading-relaxed md:max-w-[70%]",
          isUser
            ? "bg-[#6366F1] text-white"
            : "border border-border bg-white text-foreground"
        )}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
        {message.timestamp && (
          <span
            className={cn(
              "mt-1 block text-[10px]",
              isUser ? "text-white/60" : "text-muted-foreground"
            )}
          >
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        )}
      </div>
    </div>
  );
}
