export function TypingIndicator() {
  return (
    <div className="flex justify-start px-4 py-1.5">
      <div className="flex items-center gap-1 rounded-lg border border-border bg-white px-4 py-3">
        <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:0ms]" />
        <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:150ms]" />
        <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:300ms]" />
      </div>
    </div>
  );
}
