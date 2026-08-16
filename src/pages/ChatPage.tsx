import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Sparkles, Building2, Search, Users, Handshake, BriefcaseBusiness } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import ChatHeader from "@/components/ChatHeader";
import PromptInput from "@/components/PromptInput";
import ResultsCard from "@/components/ResultsCard";
import ChatExportButtons from "@/components/ChatExportButtons";
import DownloadBox from "@/components/DownloadBox";
import {
  createChat,
  getChats,
  saveChat,
  type StoredChat,
  type StoredMessage,
} from "@/lib/chatStorage";
import { generateMockResponse, type MockAIResult } from "@/lib/mockAI";
import { useUIStore } from "@/store/uiStore";
import { useListStore } from "@/store/listStore";

const SUGGESTIONS = [
  { label: "SaaS companies in India",       icon: Building2,        query: "Find 10 SaaS companies in India" },
  { label: "Healthcare leads in Mumbai",    icon: Search,           query: "Find 5 healthcare companies in Mumbai" },
  { label: "Pharma targets in Bengaluru",   icon: Handshake,        query: "Find pharmaceutical companies in Bengaluru" },
  { label: "500+ employee companies",       icon: Users,            query: "Find 8 SaaS companies with over 500 employees" },
  { label: "Pharma firms in Pune",          icon: BriefcaseBusiness,query: "Find HealthCare companies in Pune" },
];

export default function ChatPage() {
  const [searchParams] = useSearchParams();
  const bottomRef = useRef<HTMLDivElement>(null);

  const [chats, setChats] = useState<StoredChat[]>(() => getChats());
  const [activeChatId, setActiveChatId] = useState<string>("");
  const [activeResult, setActiveResult] = useState<MockAIResult | null>(null);
  const [loading, setLoading] = useState(false);
  const { sidebarCollapsed, toggleSidebar } = useUIStore();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const addList = useListStore((state) => state.addList);

  useEffect(() => {
    const idParam = searchParams.get("id");
    if (idParam) {
      const found = getChats().find((c) => c.id === idParam);
      if (found) {
        setChats(getChats());
        setActiveChatId(found.id);
        setActiveResult(found.result);
        setSelectedIds([]);
        return;
      }
    }
    setActiveChatId("");
    setActiveResult(null);
    setSelectedIds([]);
  }, [searchParams]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats, loading]);

  const activeChat = chats.find((c) => c.id === activeChatId) ?? null;
  const hasMessages = activeChat && activeChat.messages.length > 0;
  const lastProspects = activeResult?.prospects ?? [];
  const exportProspects =
    selectedIds.length > 0
      ? lastProspects.filter((p) => selectedIds.includes(p.id))
      : lastProspects;
  const lastQuery = activeChat?.messages.find((m) => m.role === "user")?.content ?? "";

  function toggleSelect(id: number) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  function toggleAll() {
    const ids = lastProspects.map((p) => p.id);
    setSelectedIds((prev) => (prev.length === ids.length ? [] : ids));
  }

  function handleNewChat() {
    setActiveChatId("");
    setActiveResult(null);
    setSelectedIds([]);
    setSidebarOpen(false);
  }

  function handleSelectChat(id: string) {
    const chat = chats.find((c) => c.id === id);
    if (!chat) return;
    setActiveChatId(id);
    setActiveResult(chat.result);
    setSelectedIds([]);
    setSidebarOpen(false);
  }

  const handleSubmit = useCallback(
    async (query: string) => {
      const q = query.trim();
      if (!q || loading) return;

      setLoading(true);
      setActiveResult(null);
      setSelectedIds([]);

      let chat = activeChat;

      if (!chat) {
        chat = createChat(q.length > 45 ? `${q.slice(0, 45)}…` : q);
        setActiveChatId(chat.id);
      }

      const now = Date.now();
      const userMsg: StoredMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: q,
        createdAt: now,
      };

      chat = { ...chat, messages: [...chat.messages, userMsg], updatedAt: now };
      saveChat(chat);
      setChats(getChats());

      try {
        const result = await generateMockResponse(q);

        const newList = {
          id: Date.now(),
          name: chat.title,
          rows: result.prospects.length,
          createdAt: new Date().toISOString().split("T")[0],
          status: "ready" as const,
          source: "AI Search",
          interested: 0,
          notInterested: 0,
          callBack: 0,
          noAnswer: 0,
          notCalled: result.prospects.length,
          
        };

        addList(newList);

        const aiMsg: StoredMessage = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: result.summary,
          createdAt: Date.now(),
        };
      
        chat = { ...chat, messages: [...chat.messages, aiMsg], result, updatedAt: Date.now() };
        saveChat(chat);
        setChats(getChats());
        setActiveResult(result);
      } catch {
        const errMsg: StoredMessage = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "Something went wrong. Please try again.",
          createdAt: Date.now(),
        };
        chat = { ...chat, messages: [...chat.messages, errMsg], updatedAt: Date.now() };
        saveChat(chat);
        setChats(getChats());
      } finally {
        setLoading(false);
      }
    },
    [activeChat, loading],
  );

  return (
    <div className="flex h-screen overflow-hidden">
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

      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Mobile header */}
        <ChatHeader onMenuClick={() => setSidebarOpen(true)} />

        {/* Desktop top bar — inline logo + subtle border */}
        <div className="hidden h-[58px] shrink-0 items-center border-b border-[#e8eef6] bg-white/60 px-6 backdrop-blur-xl md:flex">
          <div className="flex items-baseline gap-[2px]">
            <span className="text-[20px] font-bold tracking-[-0.5px] text-[#17345e]">Prospect</span>
            <span className="text-[20px] font-bold tracking-[-0.5px] text-[#17345e]">AI</span>
            <span className="text-[20px] font-bold leading-none text-blue-400">.</span>
          </div>

          {hasMessages && (
            <div className="ml-auto">
              <ChatExportButtons
                messages={activeChat!.messages}
                chatTitle={activeChat!.title}
                prospects={activeResult?.prospects ?? []}
                query={activeChat!.messages.find((m) => m.role === "user")?.content ?? ""}
              />
            </div>
          )}
        </div>

        {/* Scrollable area */}
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
                <span className="text-[52px] font-bold leading-none text-blue-400">.</span>
              </div>

              <p className="mt-4 max-w-sm text-center text-[15px] leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
                Find companies, prospects, and contacts with AI — describe what you're looking for below.
              </p>

              {/* Suggestion chips */}
              <div className="mt-8 flex flex-wrap justify-center gap-2">
                {SUGGESTIONS.map(({ label, icon: Icon, query }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => handleSubmit(query)}
                    className="flex items-center gap-2 rounded-full border bg-white px-4 py-2 text-sm shadow-sm transition hover:border-[#6687dc]/40 hover:bg-[#f0f5ff] hover:text-[#17345e] hover:shadow-md active:scale-[0.98] active:bg-[#e0e8ff]"
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
              {/* Mobile export buttons */}
              <div className="md:hidden">
                <ChatExportButtons
                  messages={activeChat!.messages}
                  chatTitle={activeChat!.title}
                  prospects={activeResult?.prospects ?? []}
                  query={activeChat!.messages.find((m) => m.role === "user")?.content ?? ""}
                />
              </div>

              {activeChat!.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={["flex w-full animate-fade-in", msg.role === "user" ? "justify-end" : "justify-start"].join(" ")}
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
                        : { borderColor: "var(--color-border)", color: "var(--color-text-body)" }
                    }
                  >
                    {msg.content}
                  </div>

                  {msg.role === "user" && (
                    <div className="ml-3 mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-[10px] font-bold text-white shadow-sm">
                      P
                    </div>
                  )}
                </div>
              ))}

              {!loading && activeResult && (
                <div className="w-full animate-fade-in pl-11">
                  <ResultsCard
                    prospects={activeResult.prospects}
                    query={lastQuery}
                    industry={activeResult.industry}
                    location={activeResult.location}
                    selectedIds={selectedIds}
                    onToggleSelect={toggleSelect}
                    onToggleAll={toggleAll}
                  />
                </div>
              )}

              {/* Loading indicator */}
              {loading && (
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
          style={{ borderColor: "var(--color-border-light)", background: "rgba(255,255,255,0.8)", backdropFilter: "blur(12px)" }}
        >
          <div className="px-4 pt-3 pb-3 sm:px-6 sm:pb-4 lg:px-8">
            {exportProspects.length > 0 && (
              <DownloadBox prospects={exportProspects} query={lastQuery} />
            )}
            <PromptInput onSubmit={handleSubmit} disabled={loading} />
          </div>
        </div>
      </main>
    </div>
  );
}
