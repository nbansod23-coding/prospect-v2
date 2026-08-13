import { useEffect, useRef } from "react";
import {
  BriefcaseBusiness,
  Building2,
  Handshake,
  Search,
  Sparkles,
  Users,
} from "lucide-react";
import MessageBubble from "./MessageBubble";
import ProcessingMessage from "./ProcessingMessage";
import ResultsCard from "./ResultsCard";
import type { Prospect } from "@/data/mockData";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  prospects?: Prospect[];
  query?: string;
};

type Props = {
  messages: ChatMessage[];
  isProcessing: boolean;
  onSuggestion: (query: string) => void;
};

const SUGGESTIONS = [
  { label: "Build Lead Lists",           icon: Users,            query: "Find 10 SaaS companies in India" },
  { label: "Find Contact Info",          icon: Search,           query: "Find 5 healthcare companies in Mumbai" },
  { label: "Personalize Your Outreach",  icon: Handshake,        query: "Find pharmaceutical companies in Bengaluru" },
  { label: "Meeting Prep",               icon: BriefcaseBusiness,query: "Find 8 SaaS companies with over 200 employees" },
  { label: "Recruiting",                 icon: Building2,        query: "Find technology companies in Pune" },
];

export default function ChatWindow({ messages, isProcessing, onSuggestion }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isProcessing]);

  return (
    <main className="relative min-h-0 flex-1 overflow-hidden">
      {/* Gradient bg */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white via-[#f5f8fc]/60 to-[#f0f5ff]/40" />

      <div className="relative h-full overflow-y-auto">
        {messages.length === 0 ? (
          <EmptyState onSuggestion={onSuggestion} />
        ) : (
          <div className="mx-auto w-full space-y-5 px-4 py-8 sm:px-6 lg:px-8">
            {messages.map((msg) => (
              <div key={msg.id}>
                <MessageBubble role={msg.role} content={msg.content} />
                {msg.prospects && msg.prospects.length > 0 && (
                  <div className="w-full">
                    <ResultsCard
                      prospects={msg.prospects}
                      query={msg.query ?? ""}
                      summary={undefined}
                    />
                  </div>
                )}
              </div>
            ))}
            {isProcessing && <ProcessingMessage />}
            <div ref={bottomRef} />
          </div>
        )}
      </div>
    </main>
  );
}

function EmptyState({ onSuggestion }: { onSuggestion: (q: string) => void }) {
  return (
    <div className="flex h-full items-center justify-center px-6 py-16">
      <div className="max-w-xl text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#17345e] text-white shadow-lg">
          <Sparkles size={26} />
        </div>

        <h1
          className="mt-6 font-bold tracking-[-2px] text-[#17345e]"
          style={{ fontSize: "clamp(44px, 6vw, 72px)", lineHeight: 1.05 }}
        >
          ProspectAI
        </h1>

        <p className="mt-3 text-sm leading-6 text-zinc-500">
          AI-powered prospecting — find companies, contacts, and business intelligence in seconds.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {SUGGESTIONS.map(({ label, icon: Icon, query }) => (
            <button
              key={label}
              type="button"
              onClick={() => onSuggestion(query)}
              className="flex items-center gap-2 rounded-full border border-zinc-200 bg-white/90 px-4 py-2 text-sm text-zinc-600 shadow-sm transition hover:border-[#6687dc]/40 hover:bg-white hover:text-[#17345e]"
            >
              <Icon size={14} className="text-zinc-400" />
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
