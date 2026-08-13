type Props = { role: "user" | "assistant"; content: string };

export default function MessageBubble({ role, content }: Props) {
  const isUser = role === "user";

  return (
    <div
      className={[
        "flex w-full animate-fade-in",
        isUser ? "justify-end" : "justify-start",
      ].join(" ")}
    >
      <div
        className={[
          "flex max-w-[85%] items-start gap-3 md:max-w-[75%]",
          isUser ? "flex-row-reverse" : "flex-row",
        ].join(" ")}
      >
        {/* Avatar */}
        <div
          className={[
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
            isUser
              ? "bg-zinc-900 text-white"
              : "border border-zinc-200 bg-white text-zinc-700",
          ].join(" ")}
        >
          {isUser ? "You" : "AI"}
        </div>

        {/* Bubble */}
        <div
          className={[
            "rounded-2xl px-4 py-3 text-sm leading-6",
            isUser
              ? "rounded-tr-md bg-zinc-900 text-white"
              : "rounded-tl-md border border-zinc-200 bg-white text-zinc-700 shadow-sm",
          ].join(" ")}
        >
          {content}
        </div>
      </div>
    </div>
  );
}
