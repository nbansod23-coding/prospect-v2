// import { useRef, useState } from "react";
// import { ArrowUp, Mic, Paperclip, Square } from "lucide-react";

// type Props = { onSubmit: (query: string) => void; disabled?: boolean };

// export default function PromptInput({ onSubmit, disabled = false }: Props) {
//   const [value, setValue] = useState("");
//   const [focused, setFocused] = useState(false);
//   const ref = useRef<HTMLTextAreaElement>(null);

//   const canSubmit = value.trim().length > 0 && !disabled;
//   const charCount = value.length;
//   const MAX = 2000;

//   function submit() {
//     const q = value.trim();
//     if (!q || disabled) return;
//     onSubmit(q);
//     setValue("");
//     ref.current?.focus();
//   }

//   function handleTextareaChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
//     if (e.target.value.length > MAX) return;
//     setValue(e.target.value);
//     // auto-grow
//     e.target.style.height = "auto";
//     e.target.style.height = `${Math.min(e.target.scrollHeight, 160)}px`;
//   }

//   return (
//     <form
//       className="w-full"
//       onSubmit={(e) => { e.preventDefault(); submit(); }}
//     >
//       <div
//         className={[
//           "relative flex flex-col rounded-xl border bg-white transition-all duration-200",
//           focused
//             ? "border-[#6687dc]/60 shadow-[0_0_0_3px_rgba(102,135,220,0.12),0_2px_12px_rgba(23,52,94,0.08)]"
//             : "border-[#d0daea] shadow-[0_1px_4px_rgba(23,52,94,0.06),0_2px_8px_rgba(23,52,94,0.04)]",
//           disabled ? "opacity-60" : "",
//         ].join(" ")}
//       >
//         <textarea
//           ref={ref}
//           value={value}
//           onChange={handleTextareaChange}
//           onFocus={() => setFocused(true)}
//           onBlur={() => setFocused(false)}
//           onKeyDown={(e) => {
//             if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); }
//           }}
//           disabled={disabled}
//           rows={1}
//           placeholder="Describe the companies, people, or audience you want to find…"
//           className="min-h-[40px] w-full resize-none bg-transparent px-3.5 pt-2.5 pb-0.5 text-[13px] leading-relaxed text-[#1e3a5f] outline-none placeholder:text-[#9aafc4]"
//           style={{ scrollbarWidth: "none", maxHeight: 160 }}
//         />

//         <div className="flex items-center justify-between px-2.5 pb-2 pt-0.5">
//           <div className="flex items-center gap-0.5">
//             <button
//               type="button"
//               className="flex h-7 w-7 items-center justify-center rounded-md text-[#9aafc4] transition hover:bg-[#f0f5ff] hover:text-[#6687dc]"
//               aria-label="Attach file"
//             >
//               <Paperclip size={14} strokeWidth={2} />
//             </button>
//             <button
//               type="button"
//               className="flex h-7 w-7 items-center justify-center rounded-md text-[#9aafc4] transition hover:bg-[#f0f5ff] hover:text-[#6687dc]"
//               aria-label="Voice input"
//             >
//               <Mic size={14} strokeWidth={2} />
//             </button>
//           </div>

//           <div className="flex items-center gap-2">
//             {charCount > 0 && (
//               <span
//                 className={[
//                   "text-[10px] tabular-nums transition",
//                   charCount > MAX * 0.9 ? "text-amber-500" : "text-[#b0bdce]",
//                 ].join(" ")}
//               >
//                 {charCount}/{MAX}
//               </span>
//             )}

//             <button
//               type="submit"
//               disabled={!canSubmit && !disabled}
//               className={[
//                 "flex h-7 w-7 items-center justify-center rounded-lg transition-all duration-150",
//                 canSubmit
//                   ? "bg-[#17345e] text-white shadow-sm hover:bg-[#1e4070] active:scale-95"
//                   : disabled
//                   ? "cursor-not-allowed bg-[#e8eef6] text-[#b0bdce]"
//                   : "bg-[#e8eef6] text-[#b0bdce]",
//               ].join(" ")}
//               aria-label={disabled ? "Stop" : "Send"}
//             >
//               {disabled ? (
//                 <Square size={11} fill="currentColor" strokeWidth={0} />
//               ) : (
//                 <ArrowUp size={14} strokeWidth={2.5} />
//               )}
//             </button>
//           </div>
//         </div>
//       </div>

//       <p className="mt-1.5 text-center text-[10px] text-[#b0bdce]">
//         Press <kbd className="rounded bg-[#f0f4fa] px-1 py-px font-mono text-[9px] text-[#7a8fa8]">Enter</kbd> to send
//         &nbsp;·&nbsp;
//         <kbd className="rounded bg-[#f0f4fa] px-1 py-px font-mono text-[9px] text-[#7a8fa8]">Shift+Enter</kbd> for new line
//       </p>
//     </form>
//   );
// }


import { useRef, useState } from "react";
import {
  ArrowUp,
  Mic,
  Paperclip,
  Square,
} from "lucide-react";

type Props = {
  onSubmit: (query: string) => void;
  disabled?: boolean;
};

export default function PromptInput({
  onSubmit,
  disabled = false,
}: Props) {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);

  const ref = useRef<HTMLTextAreaElement>(null);

  const canSubmit =
    value.trim().length > 0 && !disabled;

  const charCount = value.length;
  const MAX = 2000;

  function submit() {
    const q = value.trim();

    if (!q || disabled) return;

    onSubmit(q);
    setValue("");

    if (ref.current) {
      ref.current.style.height = "auto";
      ref.current.focus();
    }
  }

  function handleTextareaChange(
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) {
    if (e.target.value.length > MAX) return;

    setValue(e.target.value);

    e.target.style.height = "auto";

    e.target.style.height = `${Math.min(
      e.target.scrollHeight,
      140
    )}px`;
  }

  return (
    <form
      className="w-full"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      {/* Glass ChatBox */}
      <div
        className={[
          "relative flex flex-col",
          "rounded-[30px]",
          "border",
          "backdrop-blur-2xl",
          "transition-all duration-200",
          "bg-white/55",
          "dark:bg-white/10",

          focused
            ? [
                "border-[#6687dc]/60",
                "shadow-[0_0_0_3px_rgba(102,135,220,0.10),0_8px_30px_rgba(23,52,94,0.10)]",
              ].join(" ")
            : [
                "border-white/70",
                "shadow-[0_4px_20px_rgba(23,52,94,0.08)]",
              ].join(" "),

          disabled ? "opacity-60" : "",
        ].join(" ")}
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.72), rgba(255,255,255,0.42))",
          backdropFilter: "blur(22px)",
          WebkitBackdropFilter: "blur(22px)",
        }}
      >
        {/* Textarea */}
        <textarea
          ref={ref}
          value={value}
          onChange={handleTextareaChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={(e) => {
            if (
              e.key === "Enter" &&
              !e.shiftKey
            ) {
              e.preventDefault();
              submit();
            }
          }}
          disabled={disabled}
          rows={1}
          placeholder="Describe the companies, people, or audience you want to find…"
          className="
            min-h-[44px]
            w-full
            resize-none
            bg-transparent
            px-5
            pt-3.5
            pb-1
            text-[14px]
            leading-relaxed
            text-[#1e3a5f]
            outline-none
            placeholder:text-[#8da4be]
          "
          style={{
            scrollbarWidth: "none",
            maxHeight: 140,
          }}
        />

        {/* Bottom controls */}
        <div className="flex items-center justify-between px-3 pb-2.5 pt-1">
          {/* Left */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="
                flex h-8 w-8
                items-center justify-center
                rounded-full
                text-[#8da4be]
                transition
                hover:bg-white/70
                hover:text-[#6687dc]
              "
              aria-label="Attach file"
            >
              <Paperclip
                size={15}
                strokeWidth={2}
              />
            </button>

            <button
              type="button"
              className="
                flex h-8 w-8
                items-center justify-center
                rounded-full
                text-[#8da4be]
                transition
                hover:bg-white/70
                hover:text-[#6687dc]
              "
              aria-label="Voice input"
            >
              <Mic
                size={15}
                strokeWidth={2}
              />
            </button>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2">
            {charCount > 0 && (
              <span
                className={[
                  "text-[10px] tabular-nums",
                  charCount > MAX * 0.9
                    ? "text-amber-500"
                    : "text-[#9aafc4]",
                ].join(" ")}
              >
                {charCount}/{MAX}
              </span>
            )}

            <button
              type="submit"
              disabled={!canSubmit && !disabled}
              className={[
                "flex h-8 w-8",
                "items-center justify-center",
                "rounded-full",
                "transition-all duration-150",
                canSubmit
                  ? [
                      "bg-[#17345e]",
                      "text-white",
                      "shadow-md",
                      "hover:bg-[#1e4070]",
                      "hover:shadow-lg",
                      "active:scale-90",
                    ].join(" ")
                  : disabled
                  ? [
                      "cursor-not-allowed",
                      "bg-[#dfe7f1]/80",
                      "text-[#9aafc4]",
                    ].join(" ")
                  : [
                      "bg-[#e4ebf4]/80",
                      "text-[#a7b7c9]",
                    ].join(" "),
              ].join(" ")}
              aria-label={
                disabled ? "Stop" : "Send"
              }
            >
              {disabled ? (
                <Square
                  size={11}
                  fill="currentColor"
                  strokeWidth={0}
                />
              ) : (
                <ArrowUp
                  size={15}
                  strokeWidth={2.5}
                />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Keyboard hint */}
      <p className="mt-2 text-center text-[10px] text-[#9aafc4]">
        Press{" "}
        <kbd className="rounded-md bg-white/50 px-1.5 py-0.5 font-mono text-[9px] text-[#7187a0]">
          Enter
        </kbd>{" "}
        to send
        <span className="mx-1.5">·</span>
        <kbd className="rounded-md bg-white/50 px-1.5 py-0.5 font-mono text-[9px] text-[#7187a0]">
          Shift+Enter
        </kbd>{" "}
        for new line
      </p>
    </form>
  );
}