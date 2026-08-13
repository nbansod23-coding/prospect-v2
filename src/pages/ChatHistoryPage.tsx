import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowUpRight,
  Clock3,
  MessageSquare,
  MoreHorizontal,
  Search,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { deleteChat, getChats, type StoredChat } from "@/lib/chatStorage";
import Sidebar from "@/components/Sidebar";
import ChatHeader from "@/components/ChatHeader";
import { useUIStore } from "@/store/uiStore";

export default function ChatHistoryPage() {
  const navigate = useNavigate();
  const { sidebarCollapsed, toggleSidebar } = useUIStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chats, setChats] = useState<StoredChat[]>([]);
  const [search, setSearch] = useState("");
  const [menuId, setMenuId] = useState<string | null>(null);

  useEffect(() => { setChats(getChats()); }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return chats;
    return chats.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.messages.some((m) => m.content.toLowerCase().includes(q)),
    );
  }, [chats, search]);

  const grouped = useMemo(() => {
    const today: StoredChat[] = [], yesterday: StoredChat[] = [], previous: StoredChat[] = [];
    const startToday = new Date(); startToday.setHours(0, 0, 0, 0);
    const startYesterday = new Date(startToday); startYesterday.setDate(startYesterday.getDate() - 1);

    filtered.forEach((c) => {
      if (c.updatedAt >= startToday.getTime()) today.push(c);
      else if (c.updatedAt >= startYesterday.getTime()) yesterday.push(c);
      else previous.push(c);
    });
    return { today, yesterday, previous };
  }, [filtered]);

  function openChat(id: string) { navigate(`/chat?id=${id}`); }

  function handleDelete(e: React.MouseEvent, id: string) {
    e.stopPropagation();
    deleteChat(id);
    setChats(getChats());
    setMenuId(null);
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        chats={chats.map(({ id, title }) => ({ id, title }))}
        activeChatId=""
        collapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
        onNewChat={() => navigate("/chat")}
        onSelectChat={(id) => navigate(`/chat?id=${id}`)}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <ChatHeader onMenuClick={() => setSidebarOpen(true)} />

        <main
          className="min-h-0 flex-1 overflow-y-auto px-5 py-7 md:px-8 lg:px-11"
          style={{ color: "var(--color-text-body)" }}
          onClick={() => setMenuId(null)}
        >
          <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-2xl shadow-sm"
              style={{ background: "var(--color-accent-bg)", color: "var(--color-primary)" }}
            >
              <MessageSquare size={21} />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight md:text-3xl" style={{ color: "var(--color-text-heading)" }}>
                Chat History
              </h1>
              <p className="mt-0.5 text-sm" style={{ color: "var(--color-text-muted)" }}>
                View and continue your previous conversations.
              </p>
            </div>
          </div>

          <div
            className="flex items-center gap-2 self-start rounded-2xl px-4 py-3 shadow-sm"
            style={{ border: `1px solid var(--color-border)`, background: "var(--color-surface)" }}
          >
            <Clock3 size={15} style={{ color: "var(--color-text-faint)" }} />
            <span className="text-sm font-medium" style={{ color: "var(--color-text-body)" }}>
              {chats.length}{" "}
              <span style={{ color: "var(--color-text-muted)" }}>
                {chats.length === 1 ? "conversation" : "conversations"}
              </span>
            </span>
          </div>
        </div>

        {/* Search */}
        <div className="mt-7">
          <div className="relative">
            <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "var(--color-text-faint)" }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search conversations…"
              className="h-12 w-full rounded-xl pl-11 pr-11 text-sm shadow-sm outline-none transition"
              style={{
                border: `1px solid var(--color-border)`,
                background: "var(--color-surface)",
                color: "var(--color-text-body)",
              }}
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg transition"
                style={{ color: "var(--color-text-faint)" }}
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="mt-7">
          {filtered.length === 0 ? (
            <EmptyState hasSearch={!!search} onClear={() => setSearch("")} onNewChat={() => navigate("/chat")} />
          ) : (
            <div className="space-y-8">
              {grouped.today.length > 0 && (
                <Group title="Today" chats={grouped.today} menuId={menuId} setMenuId={setMenuId} onOpen={openChat} onDelete={handleDelete} />
              )}
              {grouped.yesterday.length > 0 && (
                <Group title="Yesterday" chats={grouped.yesterday} menuId={menuId} setMenuId={setMenuId} onOpen={openChat} onDelete={handleDelete} />
              )}
              {grouped.previous.length > 0 && (
                <Group title="Previous Conversations" chats={grouped.previous} menuId={menuId} setMenuId={setMenuId} onOpen={openChat} onDelete={handleDelete} />
              )}
            </div>
          )}
        </div>
          </div>
        </main>
      </div>
    </div>
  );
}

/* ── Group ── */
function Group({
  title, chats, menuId, setMenuId, onOpen, onDelete,
}: {
  title: string;
  chats: StoredChat[];
  menuId: string | null;
  setMenuId: (id: string | null) => void;
  onOpen: (id: string) => void;
  onDelete: (e: React.MouseEvent, id: string) => void;
}) {
  return (
    <section>
      <div className="mb-3 flex items-center gap-3">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: "var(--color-text-faint)" }}>
          {title}
        </h2>
        <div className="h-px flex-1" style={{ background: "var(--color-border)" }} />
      </div>
      <div className="space-y-2">
        {chats.map((chat) => (
          <Card key={chat.id} chat={chat} menuId={menuId} setMenuId={setMenuId} onOpen={onOpen} onDelete={onDelete} />
        ))}
      </div>
    </section>
  );
}

/* ── Card ── */
function Card({
  chat, menuId, setMenuId, onOpen, onDelete,
}: {
  chat: StoredChat;
  menuId: string | null;
  setMenuId: (id: string | null) => void;
  onOpen: (id: string) => void;
  onDelete: (e: React.MouseEvent, id: string) => void;
}) {
  const isOpen = menuId === chat.id;
  const preview = chat.messages.find((m) => m.role === "user")?.content ?? "";

  return (
    <div
      onClick={() => onOpen(chat.id)}
      className="group relative flex cursor-pointer items-start gap-4 rounded-2xl p-4 shadow-sm transition"
      style={{
        border: `1px solid var(--color-border)`,
        background: "var(--color-surface)",
      }}
    >
      {/* Icon */}
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition group-hover:opacity-80"
        style={{ background: "var(--color-accent-bg)", color: "var(--color-primary)" }}
      >
        <MessageSquare size={18} />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="truncate text-sm font-semibold" style={{ color: "var(--color-text-heading)" }}>
            {chat.title}
          </h3>
          <span className="shrink-0 text-[11px]" style={{ color: "var(--color-text-faint)" }}>
            {formatTime(chat.updatedAt)}
          </span>
        </div>

        {preview && (
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
            {preview}
          </p>
        )}

        <div className="mt-2 flex items-center gap-3">
          <span
            className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium"
            style={{ background: "var(--color-accent-bg)", color: "var(--color-primary)" }}
          >
            <Sparkles size={9} />
            {chat.messages.length} {chat.messages.length === 1 ? "message" : "messages"}
          </span>
          <span className="text-[11px]" style={{ color: "var(--color-text-faint)" }}>
            {formatDate(chat.updatedAt)}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="relative shrink-0" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={() => onOpen(chat.id)}
          className="mr-1 hidden items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition group-hover:inline-flex"
          style={{ background: "var(--color-accent-bg)", color: "var(--color-primary)" }}
        >
          Open <ArrowUpRight size={12} />
        </button>

        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); setMenuId(isOpen ? null : chat.id); }}
          className="flex h-8 w-8 items-center justify-center rounded-lg transition hover:bg-[#f0f4ff]"
          style={{ color: "var(--color-text-faint)" }}
        >
          <MoreHorizontal size={17} />
        </button>

        {isOpen && (
          <div
            className="absolute right-0 top-10 z-30 w-48 overflow-hidden rounded-xl p-1.5 shadow-xl"
            style={{ border: `1px solid var(--color-border)`, background: "var(--color-surface)" }}
          >
            <button
              type="button"
              onClick={() => onOpen(chat.id)}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-xs font-medium transition hover:bg-[#f5f8fc]"
              style={{ color: "var(--color-text-body)" }}
            >
              <ArrowUpRight size={14} style={{ color: "var(--color-primary)" }} />
              Open conversation
            </button>
            <div className="my-1 h-px" style={{ background: "var(--color-border-light)" }} />
            <button
              type="button"
              onClick={(e) => onDelete(e, chat.id)}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-xs font-medium text-red-500 transition hover:bg-red-50"
            >
              <Trash2 size={14} />
              Delete conversation
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Empty ── */
function EmptyState({
  hasSearch, onClear, onNewChat,
}: { hasSearch: boolean; onClear: () => void; onNewChat: () => void }) {
  return (
    <div
      className="flex min-h-[420px] items-center justify-center rounded-2xl border-2 border-dashed"
      style={{ borderColor: "var(--color-border)", background: "rgba(255,255,255,0.6)" }}
    >
      <div className="max-w-sm px-6 text-center">
        <div
          className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl"
          style={{ background: "var(--color-accent-bg)", color: "var(--color-primary)" }}
        >
          <MessageSquare size={24} />
        </div>
        <h2 className="mt-5 text-lg font-semibold" style={{ color: "var(--color-text-heading)" }}>
          {hasSearch ? "No conversations found" : "No chat history yet"}
        </h2>
        <p className="mt-2 text-sm leading-6" style={{ color: "var(--color-text-muted)" }}>
          {hasSearch ? "Try a different search term." : "Your conversations will appear here after you start chatting."}
        </p>
        {hasSearch ? (
          <button
            type="button"
            onClick={onClear}
            className="mt-5 rounded-xl px-5 py-2.5 text-sm font-medium text-white transition"
            style={{ background: "var(--color-primary-deep)" }}
          >
            Clear Search
          </button>
        ) : (
          <button
            type="button"
            onClick={onNewChat}
            className="mt-5 rounded-xl px-5 py-2.5 text-sm font-medium text-white transition"
            style={{ background: "var(--color-primary)" }}
          >
            Start a conversation
          </button>
        )}
      </div>
    </div>
  );
}

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}
function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
}
