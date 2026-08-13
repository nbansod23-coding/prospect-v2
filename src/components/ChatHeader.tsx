import { Menu, Sparkles } from "lucide-react";

type ChatHeaderProps = { onMenuClick: () => void };

export default function ChatHeader({ onMenuClick }: ChatHeaderProps) {
  return (
    /* Mobile-only top bar — hidden on md+ (sidebar handles navigation there) */
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-[#e8eef6] bg-white/70 px-4 backdrop-blur-xl md:hidden">
      <button
        type="button"
        onClick={onMenuClick}
        className="flex h-9 w-9 items-center justify-center rounded-xl text-[#71809a] transition hover:bg-[#f0f4ff] hover:text-[#17345e]"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      {/* Inline logo */}
      <div className="flex items-baseline gap-[3px]">
        <span className="text-[18px] font-bold tracking-[-0.5px] text-[#17345e]">Prospect</span>
        <span className="text-[18px] font-bold tracking-[-0.5px] text-[#17345e]">AI</span>
        <span className="text-[18px] font-bold text-blue-400 leading-none">.</span>
      </div>

      <div className="flex h-9 w-9 items-center justify-center rounded-xl text-[#6687dc]">
        <Sparkles size={18} />
      </div>
    </header>
  );
}
