import { useRef, useState } from "react";
import { ArrowUp, Mic, Paperclip, Square } from "lucide-react";

type Props = { onSubmit: (query: string) => void; disabled?: boolean };

export default function PromptInput({ onSubmit, disabled = false }: Props) {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const ref = useRef<HTMLTextAreaElement>(null);

  const canSubmit = value.trim().length > 0 && !disabled;
  const charCount = value.length;
  const MAX = 2000;

  function submit() {
    const q = value.trim();
    if (!q || disabled) return;
    onSubmit(q);
    setValue("");
    ref.current?.focus();
  }

  function handleTextareaChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    if (e.target.value.length > MAX) return;
    setValue(e.target.value);
    // auto-grow
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 180)}px`;
  }

  return (
    <div className="w-full px-4 pb-3 pt-2 sm:px-6 sm:pb-4 lg:px-8">
        <form
        className="mx-auto w-full"
        onSubmit={(e) => { e.preventDefault(); submit(); }}
      >
        {/* Main container */}
        <div
          className={[
            "relative flex flex-col rounded-2xl border bg-white transition-all duration-200",
            focused
              ? "border-[#6687dc]/60 shadow-[0_0_0_3px_rgba(102,135,220,0.12),0_2px_12px_rgba(23,52,94,0.08)]"
              : "border-[#d0daea] shadow-[0_1px_4px_rgba(23,52,94,0.06),0_2px_8px_rgba(23,52,94,0.04)]",
            disabled ? "opacity-60" : "",
          ].join(" ")}
        >
          {/* Textarea */}
          <textarea
            ref={ref}
            value={value}
            onChange={handleTextareaChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); }
            }}
            disabled={disabled}
            rows={1}
            placeholder="Describe the companies, people, or audience you want to find…"
            className="min-h-[52px] w-full resize-none bg-transparent px-4 pt-3.5 pb-1 text-[14.5px] leading-relaxed text-[#1e3a5f] outline-none placeholder:text-[#9aafc4]"
            style={{ scrollbarWidth: "none", maxHeight: 180 }}
          />

          {/* Bottom toolbar */}
          <div className="flex items-center justify-between px-3 pb-2.5 pt-1">
            {/* Left: attach + mic */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#9aafc4] transition hover:bg-[#f0f5ff] hover:text-[#6687dc]"
                aria-label="Attach file"
              >
                <Paperclip size={16} strokeWidth={2} />
              </button>
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#9aafc4] transition hover:bg-[#f0f5ff] hover:text-[#6687dc]"
                aria-label="Voice input"
              >
                <Mic size={16} strokeWidth={2} />
              </button>
            </div>

            {/* Right: char count + submit */}
            <div className="flex items-center gap-2.5">
              {charCount > 0 && (
                <span
                  className={[
                    "text-[11px] tabular-nums transition",
                    charCount > MAX * 0.9 ? "text-amber-500" : "text-[#b0bdce]",
                  ].join(" ")}
                >
                  {charCount}/{MAX}
                </span>
              )}

              <button
                type="submit"
                disabled={!canSubmit && !disabled}
                className={[
                  "flex h-[34px] w-[34px] items-center justify-center rounded-xl transition-all duration-150",
                  canSubmit
                    ? "bg-[#17345e] text-white shadow-sm hover:bg-[#1e4070] active:scale-95"
                    : disabled
                    ? "cursor-not-allowed bg-[#e8eef6] text-[#b0bdce]"
                    : "bg-[#e8eef6] text-[#b0bdce]",
                ].join(" ")}
                aria-label={disabled ? "Stop" : "Send"}
              >
                {disabled ? (
                  <Square size={13} fill="currentColor" strokeWidth={0} />
                ) : (
                  <ArrowUp size={16} strokeWidth={2.5} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Hint */}
        <p className="mt-2 text-center text-[11px] text-[#b0bdce]">
          Press <kbd className="rounded bg-[#f0f4fa] px-1 py-0.5 font-mono text-[10px] text-[#7a8fa8]">Enter</kbd> to send
          &nbsp;·&nbsp;
          <kbd className="rounded bg-[#f0f4fa] px-1 py-0.5 font-mono text-[10px] text-[#7a8fa8]">Shift+Enter</kbd> for new line
        </p>
      </form>
    </div>
  );
}
