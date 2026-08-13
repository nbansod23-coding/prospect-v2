import { useRef, useState } from "react";
import { useUIStore } from "@/store/uiStore";
import {
  BriefcaseBusiness,
  Building2,
  Handshake,
  MessageSquare,
  Search,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import ChatHeader from "@/components/ChatHeader";
import PromptInput from "@/components/PromptInput";
import ResultsCard from "@/components/ResultsCard";
import { generateMockResponse } from "@/lib/mockAI";
import type { Prospect } from "@/data/mockData";
import DownloadBox from "@/components/DownloadBox";

/* ── Types ── */
type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  prospects?: Prospect[];
  query?: string;
  reasoning?: string;
  industry?: string | null;
  location?: string | null;
};

type Chat = { id: string; title: string; messages: ChatMessage[] };

/* ── Suggestions ── */
const SUGGESTIONS = [
  { label: "SaaS companies in India",     icon: Building2,         query: "Find 10 SaaS companies in India" },
  { label: "Healthcare leads in Mumbai",  icon: Search,            query: "Find 5 healthcare companies in Mumbai" },
  { label: "Pharma targets in Bengaluru", icon: Handshake,         query: "Find pharmaceutical companies in Bengaluru" },
  { label: "500+ employee companies",     icon: Users,             query: "Find 8 SaaS companies with over 500 employees" },
  { label: "Tech firms in Pune",          icon: BriefcaseBusiness, query: "Find technology companies in Pune" },
];

const INITIAL_ID = "new-chat";

export default function HomePage() {
  const bottomRef = useRef<HTMLDivElement>(null);

  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState(INITIAL_ID);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { sidebarCollapsed, toggleSidebar } = useUIStore();

  const activeChat = chats.find((c) => c.id === activeChatId);
  const messages = activeChat?.messages ?? [];
  const hasMessages = messages.length > 0;

  function handleNewChat() {
    setActiveChatId(INITIAL_ID);
  }

  function handleSelectChat(id: string) {
    setActiveChatId(id);
    setSidebarOpen(false);
  }

  async function handleSubmit(query: string) {
    if (!query.trim() || isProcessing) return;

    setIsProcessing(true);

    let chatId = activeChatId;
    if (chatId === INITIAL_ID) {
      chatId = crypto.randomUUID();
      const title = query.length > 45 ? `${query.slice(0, 45)}…` : query;
      setChats((prev) => [...prev, { id: chatId, title, messages: [] }]);
      setActiveChatId(chatId);
    }

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: query,
    };

    setChats((prev) =>
      prev.map((c) => (c.id === chatId ? { ...c, messages: [...c.messages, userMsg] } : c)),
    );

    // scroll after user message appears
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);

    try {
      await new Promise((r) => setTimeout(r, 1400));
      const result = await generateMockResponse(query);

      const aiMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: result.summary,
        prospects: result.prospects,
        query,
        industry: result.industry,
        location: result.location,
        reasoning: `I understood your request as: "${query}". I searched for matching prospects and organized the most relevant results for you.`,
      };

      setChats((prev) =>
        prev.map((c) => (c.id === chatId ? { ...c, messages: [...c.messages, aiMsg] } : c)),
      );
    } catch {
      setChats((prev) =>
        prev.map((c) =>
          c.id === chatId
            ? {
                ...c,
                messages: [
                  ...c.messages,
                  { id: crypto.randomUUID(), role: "assistant" as const, content: "Something went wrong. Please try again." },
                ],
              }
            : c,
        ),
      );
    } finally {
      setIsProcessing(false);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    }
  }

  return (
    <div className="flex h-dvh overflow-hidden">
      <Sidebar
        chats={chats.map(({ id, title }) => ({ id, title }))}
        activeChatId={activeChatId}
        collapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <section className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Mobile header */}
        <ChatHeader onMenuClick={() => setSidebarOpen(true)} />

        {/* Desktop top bar — inline logo */}
        <div
          className="hidden h-[58px] shrink-0 items-center border-b px-6 backdrop-blur-xl md:flex"
          style={{
            borderColor: "var(--color-border-light)",
            background: "rgba(255,255,255,0.6)",
          }}
        >
          <div className="flex items-baseline gap-[2px]">
            <span
              className="text-[20px] font-bold tracking-[-0.5px]"
              style={{ color: "var(--color-primary-deep)" }}
            >
              Prospect
            </span>
            <span
              className="text-[20px] font-bold tracking-[-0.5px]"
              style={{ color: "var(--color-primary-deep)" }}
            >
              AI
            </span>
            <span className="text-[20px] font-bold leading-none text-blue-400">
              .
            </span>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          {!hasMessages ? (
            /* ── Empty / welcome state ── */
            <div className="flex min-h-full flex-col items-center justify-center px-6 py-16">
              {/* Icon badge */}
              <div
                className="flex h-[52px] w-[52px] items-center justify-center rounded-2xl shadow-lg"
                style={{ background: "var(--color-primary-deep)" }}
              >
                <Sparkles size={24} className="text-white" />
              </div>

              {/* Inline logo */}
              <div className="mt-5 flex items-baseline gap-1">
                <span
                  className="text-[52px] font-bold leading-none tracking-[-2px]"
                  style={{ color: "var(--color-primary-deep)" }}
                >
                  Prospect
                </span>
                <span
                  className="text-[52px] font-bold leading-none tracking-[-2px]"
                  style={{ color: "var(--color-primary-deep)" }}
                >
                  AI
                </span>
                <span className="text-[52px] font-bold leading-none text-blue-400">
                  .
                </span>
              </div>

              <p
                className="mt-4 max-w-sm text-center text-[15px] leading-relaxed"
                style={{ color: "var(--color-text-muted)" }}
              >
                Find companies, prospects, and contacts with AI — describe what
                you're looking for below.
              </p>

              {/* Suggestion chips */}
              <div className="mt-8 flex flex-wrap justify-center gap-2">
                {SUGGESTIONS.map(({ label, icon: Icon, query }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => handleSubmit(query)}
                    className="flex items-center gap-2 rounded-full border bg-white px-4 py-2 text-sm shadow-sm transition hover:shadow-md"
                    style={{
                      borderColor: "var(--color-border)",
                      color: "var(--color-text-body)",
                    }}
                  >
                    <Icon size={13} style={{ color: "var(--color-primary)" }} />
                    {label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* ── Chat messages ── */
            <div className="mx-auto w-full space-y-6 px-4 py-6 sm:px-6 lg:px-8">
              {messages.map((msg) => (
                <div key={msg.id} className="w-full">
                  <div
                    className={[
                      "flex w-full animate-fade-in",
                      msg.role === "user" ? "justify-end" : "justify-start",
                    ].join(" ")}
                  >
                    {msg.role === "assistant" && (
                      <div
                        className="mr-3 mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white shadow-sm"
                        style={{ background: "var(--color-primary)" }}
                      >
                        AI
                      </div>
                    )}

                    <div
                      className={[
                        "rounded-2xl px-4 py-3 text-sm leading-relaxed",
                        msg.role === "user"
                          ? "max-w-[min(72%,560px)] rounded-br-sm text-white shadow-sm"
                          : "min-w-0 flex-1 rounded-bl-sm border bg-white shadow-sm",
                      ].join(" ")}
                      style={
                        msg.role === "user"
                          ? { background: "var(--color-primary)" }
                          : {
                              borderColor: "var(--color-border)",
                              color: "var(--color-text-body)",
                            }
                      }
                    >
                      {msg.reasoning && (
                        <div
                          className="mb-3 rounded-xl border px-3 py-2.5"
                          style={{
                            borderColor: "var(--color-border-light)",
                            background: "rgba(248,250,252,0.8)",
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <Sparkles
                              size={14}
                              style={{ color: "var(--color-primary)" }}
                            />

                            <span
                              className="text-xs font-semibold"
                              style={{ color: "var(--color-primary-deep)" }}
                            >
                              AI reasoning
                            </span>
                          </div>

                          <p
                            className="mt-1.5 text-xs leading-relaxed"
                            style={{ color: "var(--color-text-muted)" }}
                          >
                            {msg.reasoning}
                          </p>
                        </div>
                      )}

                      <div>{msg.content}</div>
                    </div>

                    {msg.role === "user" && (
                      <div className="ml-3 mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-[10px] font-bold text-white shadow-sm">
                        P
                      </div>
                    )}
                  </div>

                  {msg.role === "assistant" &&
                    msg.prospects &&
                    msg.prospects.length > 0 && (
                      <div className="mt-3 w-full animate-fade-in pl-11">
                        <ResultsCard
                          prospects={msg.prospects}
                          query={msg.query ?? ""}
                          industry={msg.industry}
                          location={msg.location}
                        />
                      </div>
                    )}
                </div>
              ))}

              {/* Typing indicator */}
              {isProcessing && (
                <div className="flex items-center gap-3 animate-fade-in">
                  <div
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white shadow-sm"
                    style={{ background: "var(--color-primary)" }}
                  >
                    AI
                  </div>
                  <div
                    className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm border bg-white px-4 py-3 shadow-sm"
                    style={{ borderColor: "var(--color-border)" }}
                  >
                    {[0, 160, 320].map((delay) => (
                      <span
                        key={delay}
                        className="h-2 w-2 rounded-full animate-pulse-dot"
                        style={{
                          background: "var(--color-primary)",
                          animationDelay: `${delay}ms`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>
          )}
        </div>

        {/* Input bar */}
        <div
          className="shrink-0 border-t"
          style={{
            borderColor: "var(--color-border-light)",
            background: "rgba(255,255,255,0.8)",
            backdropFilter: "blur(12px)",
          }}
        >
          {/* Download box */}
          {hasMessages &&
            (() => {
              const lastAssistantMessage = [...messages]
                .reverse()
                .find(
                  (message) =>
                    message.role === "assistant" &&
                    message.prospects &&
                    message.prospects.length > 0,
                );

              return lastAssistantMessage?.prospects ? (
                <DownloadBox
                  prospects={lastAssistantMessage.prospects}
                  title="prospecting_results"
                />
              ) : null;
            })()}

          <PromptInput onSubmit={handleSubmit} disabled={isProcessing} />
        </div>
      </section>

      <FloatingSupport />
    </div>
  );
}

/* ── Floating support button ── */
function FloatingSupport() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2">
      {open && (
        <div
          className="animate-fade-in rounded-2xl border bg-white px-4 py-3 shadow-xl"
          style={{ borderColor: "var(--color-border)" }}
        >
          <p className="text-sm font-medium" style={{ color: "var(--color-text-body)" }}>
            Hey! 👋
          </p>
          <p className="mt-0.5 text-xs" style={{ color: "var(--color-text-muted)" }}>
            How can we help you?
          </p>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg transition hover:opacity-90 active:scale-95"
        style={{ background: "var(--color-primary)" }}
        aria-label="Support"
      >
        {open ? <X size={20} /> : <MessageSquare size={20} />}
      </button>
    </div>
  );
}
