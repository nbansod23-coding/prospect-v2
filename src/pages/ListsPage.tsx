import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Download,
  Eye,
  FileText,
  Grid2X2,
  List as ListIcon,
  MoreHorizontal,
  Play,
  Search,
  Sparkles,
  Trash2,
  Upload,
  Users,
  X,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { mockLists, type MockList } from "@/data/mockList";
import { useUIStore } from "@/store/uiStore";

/* ── AGENTS ── */
const AGENTS = [
  { id: "a1", name: "ProspectBot Alpha", desc: "Qualifies leads with discovery questions", avatar: "PA", color: "#6687dc" },
  { id: "a2", name: "SalesAI Max",        desc: "Pitches product and books demos",          avatar: "SM", color: "#5b8def" },
  { id: "a3", name: "NurtureBot",         desc: "Follows up with warm leads over time",     avatar: "NB", color: "#7c6fe0" },
  { id: "a4", name: "CloserAI",           desc: "Handles objections and closes deals",      avatar: "CA", color: "#4da8a0" },
];

type CampaignState = "idle" | "running" | "scheduled" | "cancelled";

export default function ListsPage() {
  const navigate = useNavigate();
  const { sidebarCollapsed, toggleSidebar } = useUIStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [lists, setLists] = useState<MockList[]>(mockLists);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [menuId, setMenuId] = useState<number | null>(null);
  const [selected, setSelected] = useState<MockList | null>(null);
  const [showAgent, setShowAgent] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return q ? lists.filter((l) => l.name.toLowerCase().includes(q)) : lists;
  }, [lists, search]);

  function openCallingAgent(id: number) {
    const l = lists.find((x) => x.id === id);
    if (l) { setSelected(l); setShowAgent(true); }
  }

  function downloadCSV(list: MockList) {
    const rows = [
      ["Name", "Source", "Created At", "Total Contacts", "Interested", "Not Interested", "Call Back", "No Answer", "Not Called", "Status"],
      [list.name, list.source, list.createdAt, list.rows, list.interested, list.notInterested, list.callBack, list.noAnswer, list.notCalled, list.status],
    ];
    const csv = rows.map((r) => r.map(String).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${list.name.replace(/\s+/g, "_")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        chats={[]}
        activeChatId=""
        collapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
        onNewChat={() => navigate("/chat")}
        onSelectChat={() => {}}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main
        className="flex min-w-0 flex-1 flex-col overflow-y-auto"
        onClick={() => setMenuId(null)}
      >
        <div className="mx-auto w-full max-w-6xl px-6 py-8">

          {/* ── Page header ── */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold" style={{ color: "var(--color-text-heading)" }}>
                Lists
              </h1>
              <p className="mt-1 text-sm" style={{ color: "var(--color-text-muted)" }}>
                Upload PDF or CSV files to manage your contact lists.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowUpload(true)}
              className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:opacity-90 active:scale-[.98]"
              style={{ background: "var(--color-primary)" }}
            >
              <Upload size={16} />
              Upload List
            </button>
          </div>

          {/* ── Stats row ── */}
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: "Total Lists",    value: lists.length,                        color: "var(--color-primary)" },
              { label: "Total Contacts", value: lists.reduce((a, l) => a + l.rows, 0), color: "#22c55e" },
              { label: "Interested",     value: lists.reduce((a, l) => a + l.interested, 0), color: "#22c55e" },
              { label: "Not Called",     value: lists.reduce((a, l) => a + l.notCalled, 0), color: "var(--color-text-faint)" },
            ].map(({ label, value, color }) => (
              <div
                key={label}
                className="rounded-2xl p-4 shadow-sm"
                style={{ border: `1px solid var(--color-border)`, background: "var(--color-surface)" }}
              >
                <p className="text-xs" style={{ color: "var(--color-text-faint)" }}>{label}</p>
                <p className="mt-1 text-2xl font-semibold" style={{ color }}>{value}</p>
              </div>
            ))}
          </div>

          {/* ── Toolbar ── */}
          <div className="mt-6 flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--color-text-faint)" }} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search lists…"
                className="h-10 w-full rounded-xl pl-9 pr-4 text-sm outline-none transition"
                style={{
                  border: `1px solid var(--color-border)`,
                  background: "var(--color-surface)",
                  color: "var(--color-text-body)",
                }}
              />
            </div>

            <div className="flex items-center gap-1 rounded-xl p-1" style={{ border: `1px solid var(--color-border)`, background: "var(--color-surface)" }}>
              {[
                { v: "grid", Icon: Grid2X2 },
                { v: "list", Icon: ListIcon },
              ].map(({ v, Icon }) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setView(v as "grid" | "list")}
                  className="flex h-8 w-8 items-center justify-center rounded-lg transition"
                  style={{
                    background: view === v ? "var(--color-accent-bg)" : "transparent",
                    color: view === v ? "var(--color-primary)" : "var(--color-text-faint)",
                  }}
                >
                  <Icon size={15} />
                </button>
              ))}
            </div>
          </div>

          {/* ── List grid / list view ── */}
          {filtered.length === 0 ? (
            <div
              className="mt-8 flex min-h-[300px] items-center justify-center rounded-2xl border-2 border-dashed"
              style={{ borderColor: "var(--color-border)" }}
            >
              <div className="text-center">
                <FileText size={32} className="mx-auto mb-3" style={{ color: "var(--color-text-faint)" }} />
                <p className="text-sm font-medium" style={{ color: "var(--color-text-body)" }}>No lists found</p>
                <p className="mt-1 text-xs" style={{ color: "var(--color-text-muted)" }}>Upload a CSV or PDF to get started</p>
              </div>
            </div>
          ) : (
            <div className={["mt-6", view === "grid" ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3" : "space-y-3"].join(" ")}>
              {filtered.map((list) => (
                <ListCard
                  key={list.id}
                  list={list}
                  view={view}
                  menuOpen={menuId === list.id}
                  onMenuToggle={(e) => { e.stopPropagation(); setMenuId(menuId === list.id ? null : list.id); }}
                  onView={() => { setSelected(list); setMenuId(null); }}
                  onStartCampaign={() => openCallingAgent(list.id)}
                  onDownload={() => downloadCSV(list)}
                  onDelete={() => setLists((prev) => prev.filter((l) => l.id !== list.id))}
                />
              ))}
            </div>
          )}

          {/* ── Selected detail ── */}
          {selected && !showAgent && (
            <SelectedDetail
              list={selected}
              onStartCampaign={() => openCallingAgent(selected.id)}
              onClose={() => setSelected(null)}
            />
          )}
        </div>
      </main>

      {/* ── Upload modal ── */}
      {showUpload && <UploadModal onClose={() => setShowUpload(false)} />}

      {/* ── Campaign modal ── */}
      {showAgent && selected && (
        <CallingAgentModal
          totalContacts={selected.rows}
          onClose={() => setShowAgent(false)}
          onStart={() => {
            setLists((prev) =>
              prev.map((l) => (l.id === selected.id ? { ...l, status: "ready" } : l)),
            );
            setShowAgent(false);
          }}
        />
      )}
    </div>
  );
}

/* ── List Card ── */
function ListCard({
  list, view, menuOpen, onMenuToggle, onView, onStartCampaign, onDownload, onDelete,
}: {
  list: MockList;
  view: "grid" | "list";
  menuOpen: boolean;
  onMenuToggle: (e: React.MouseEvent) => void;
  onView: () => void;
  onStartCampaign: () => void;
  onDownload: () => void;
  onDelete: () => void;
}) {
  const statusColor: Record<string, string> = {
    ready: "#22c55e",
    processing: "#f59e0b",
    failed: "#ef4444",
  };

  if (view === "list") {
    return (
      <div
        className="flex items-center gap-4 rounded-2xl p-4 shadow-sm transition cursor-pointer hover:shadow-md"
        style={{ border: `1px solid var(--color-border)`, background: "var(--color-surface)" }}
        onClick={onView}
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ background: "var(--color-accent-bg)", color: "var(--color-primary)" }}>
          <FileText size={18} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold" style={{ color: "var(--color-text-heading)" }}>{list.name}</p>
          <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>{list.rows} contacts · {list.source}</p>
        </div>
        <span className="text-xs font-medium" style={{ color: statusColor[list.status] }}>{list.status}</span>
        <div className="relative" onClick={(e) => e.stopPropagation()}>
          <button type="button" onClick={onMenuToggle} className="flex h-8 w-8 items-center justify-center rounded-lg transition hover:bg-[#f0f4ff]" style={{ color: "var(--color-text-faint)" }}>
            <MoreHorizontal size={16} />
          </button>
          {menuOpen && <CardMenu onView={onView} onStartCampaign={onStartCampaign} onDownload={onDownload} onDelete={onDelete} />}
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative flex flex-col rounded-2xl p-5 shadow-sm transition cursor-pointer hover:shadow-md"
      style={{ border: `1px solid var(--color-border)`, background: "var(--color-surface)" }}
      onClick={onView}
    >
      <div className="flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: "var(--color-accent-bg)", color: "var(--color-primary)" }}>
          <FileText size={20} />
        </div>
        <div className="relative" onClick={(e) => e.stopPropagation()}>
          <button type="button" onClick={onMenuToggle} className="flex h-8 w-8 items-center justify-center rounded-lg transition hover:bg-[#f0f4ff]" style={{ color: "var(--color-text-faint)" }}>
            <MoreHorizontal size={16} />
          </button>
          {menuOpen && <CardMenu onView={onView} onStartCampaign={onStartCampaign} onDownload={onDownload} onDelete={onDelete} />}
        </div>
      </div>

      <h3 className="mt-3 text-sm font-semibold" style={{ color: "var(--color-text-heading)" }}>{list.name}</h3>
      <p className="mt-1 text-xs" style={{ color: "var(--color-text-muted)" }}>{list.source} · {list.createdAt}</p>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        {[
          { label: "Contacts",  value: list.rows },
          { label: "Interested", value: list.interested },
          { label: "Not Called", value: list.notCalled },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-lg p-2" style={{ background: "var(--color-bg)" }}>
            <p className="text-base font-bold" style={{ color: "var(--color-text-heading)" }}>{value}</p>
            <p className="text-[10px]" style={{ color: "var(--color-text-faint)" }}>{label}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-xs font-medium" style={{ color: statusColor[list.status] }}>
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: statusColor[list.status] }} />
          {list.status}
        </span>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onStartCampaign(); }}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-white transition hover:opacity-90"
          style={{ background: "var(--color-primary)" }}
        >
          <Play size={11} />
          Start Campaign
        </button>
      </div>
    </div>
  );
}

function CardMenu({ onView, onStartCampaign, onDownload, onDelete }: { onView: () => void; onStartCampaign: () => void; onDownload: () => void; onDelete: () => void }) {
  return (
    <div
      className="absolute right-0 top-9 z-30 w-52 overflow-hidden rounded-xl p-1.5"
      style={{ border: `1px solid var(--color-border)`, background: "var(--color-surface)", boxShadow: "var(--shadow-dropdown)" }}
    >
      <button type="button" onClick={onView} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-medium transition hover:bg-[#f5f8fc]" style={{ color: "var(--color-text-body)" }}>
        <Eye size={14} style={{ color: "var(--color-primary)" }} /> View List
      </button>
      <button type="button" onClick={onStartCampaign} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-medium transition hover:bg-[#f5f8fc]" style={{ color: "var(--color-text-body)" }}>
        <Sparkles size={14} style={{ color: "var(--color-primary)" }} /> Start Campaign
      </button>
      <button type="button" onClick={onDownload} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-medium transition hover:bg-[#f5f8fc]" style={{ color: "var(--color-text-body)" }}>
        <Download size={14} style={{ color: "var(--color-primary)" }} /> Download CSV
      </button>
      <div className="my-1 h-px" style={{ background: "var(--color-border-light)" }} />
      <button type="button" onClick={onDelete} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-medium text-red-500 transition hover:bg-red-50">
        <Trash2 size={14} /> Delete
      </button>
    </div>
  );
}

/* ── Selected Detail ── */
function SelectedDetail({ list, onStartCampaign, onClose }: { list: MockList; onStartCampaign: () => void; onClose: () => void }) {
  return (
    <div className="mt-8 rounded-2xl shadow-sm" style={{ border: `1px solid var(--color-border)`, background: "var(--color-surface)" }}>
      <div className="flex items-center justify-between border-b p-5" style={{ borderColor: "var(--color-border-light)" }}>
        <div>
          <h2 className="text-lg font-semibold" style={{ color: "var(--color-text-heading)" }}>{list.name}</h2>
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>{list.rows} contacts · {list.source}</p>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" onClick={onStartCampaign} className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90" style={{ background: "var(--color-primary-deep)" }}>
            <Sparkles size={16} /> Launch AI Calling Agent
          </button>
          <button type="button" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-lg transition hover:bg-[#f0f4f8]" style={{ color: "var(--color-text-faint)" }}>
            <X size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 p-5 sm:grid-cols-5">
        {[
          { label: "Interested",    value: list.interested,    color: "#22c55e" },
          { label: "Not Interested",value: list.notInterested, color: "#ef4444" },
          { label: "Call Back",     value: list.callBack,      color: "#f59e0b" },
          { label: "No Answer",     value: list.noAnswer,      color: "var(--color-text-faint)" },
          { label: "Not Called",    value: list.notCalled,     color: "var(--color-text-muted)" },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-xl p-4 text-center" style={{ background: "var(--color-bg)" }}>
            <p className="text-2xl font-bold" style={{ color }}>{value}</p>
            <p className="mt-1 text-xs" style={{ color: "var(--color-text-faint)" }}>{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Upload Modal ── */
function UploadModal({ onClose }: { onClose: () => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  function handleFile(f: File) {
    const ext = f.name.split(".").pop()?.toLowerCase();
    if (ext !== "csv" && ext !== "pdf") return alert("Only CSV or PDF files are supported.");
    setFile(f);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b p-5" style={{ borderColor: "var(--color-border-light)" }}>
          <h2 className="text-base font-semibold" style={{ color: "var(--color-text-heading)" }}>Upload List</h2>
          <button type="button" onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg transition hover:bg-[#f5f8fc]" style={{ color: "var(--color-text-faint)" }}>
            <X size={17} />
          </button>
        </div>

        <div className="p-6">
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
            onClick={() => fileRef.current?.click()}
            className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 text-center transition"
            style={{
              borderColor: dragging ? "var(--color-primary)" : "var(--color-border)",
              background: dragging ? "var(--color-accent-bg)" : "var(--color-bg)",
            }}
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl" style={{ background: "var(--color-accent-bg)", color: "var(--color-primary)" }}>
              <Upload size={26} />
            </div>
            {file ? (
              <p className="mt-4 text-sm font-medium" style={{ color: "var(--color-text-heading)" }}>{file.name}</p>
            ) : (
              <>
                <p className="mt-4 text-sm font-medium" style={{ color: "var(--color-text-body)" }}>Drop your file here</p>
                <p className="mt-1 text-xs" style={{ color: "var(--color-text-muted)" }}>PDF or CSV · max 10 MB</p>
              </>
            )}
            <input ref={fileRef} type="file" accept=".pdf,.csv" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
          </div>

          <div className="mt-5 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 rounded-xl border py-3 text-sm font-medium transition hover:bg-[#f5f8fc]" style={{ borderColor: "var(--color-border)", color: "var(--color-text-body)" }}>
              Cancel
            </button>
            <button type="button" disabled={!file} onClick={onClose} className="flex-1 rounded-xl py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-40" style={{ background: "var(--color-primary)" }}>
              Upload
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Calling Agent Modal ── */
function CallingAgentModal({ totalContacts, onClose, onStart }: { totalContacts: number; onClose: () => void; onStart: () => void }) {
  const [step, setStep] = useState<"select" | "configure">("select");
  const [agentId, setAgentId] = useState<string | null>(null);
  const [state, setState] = useState<CampaignState>("idle");
  const [scheduledTime, setScheduledTime] = useState("");

  const agent = AGENTS.find((a) => a.id === agentId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-5" style={{ borderColor: "var(--color-border-light)" }}>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: "var(--color-accent-bg)", color: "var(--color-primary)" }}>
              <Sparkles size={18} />
            </div>
            <div>
              <h2 className="text-base font-semibold" style={{ color: "var(--color-text-heading)" }}>Start Campaign</h2>
              <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                {step === "select" ? `${totalContacts} contacts · choose an agent` : `Agent: ${agent?.name}`}
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg transition hover:bg-[#f5f8fc]" style={{ color: "var(--color-text-faint)" }}>
            <X size={17} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          {step === "select" && (
            <div>
              <p className="mb-4 text-sm" style={{ color: "var(--color-text-muted)" }}>Select an AI agent to handle calls.</p>
              <div className="space-y-2">
                {AGENTS.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => { setAgentId(a.id); setStep("configure"); setState("idle"); }}
                    className="group flex w-full items-center gap-4 rounded-xl border p-4 text-left transition hover:border-[#b8ccee] hover:bg-[#f0f5ff]"
                    style={{ borderColor: "var(--color-border)", background: "var(--color-bg)" }}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold text-white" style={{ background: a.color }}>{a.avatar}</div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold" style={{ color: "var(--color-text-heading)" }}>{a.name}</p>
                      <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>{a.desc}</p>
                    </div>
                    <Play size={14} style={{ color: "var(--color-text-faint)" }} />
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === "configure" && state === "idle" && (
            <div>
              {/* Agent summary */}
              <div className="mb-5 flex items-center gap-3 rounded-xl p-3" style={{ background: "var(--color-bg)" }}>
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold text-white" style={{ background: agent?.color }}>{agent?.avatar}</div>
                <div className="flex-1">
                  <p className="text-sm font-semibold" style={{ color: "var(--color-text-heading)" }}>{agent?.name}</p>
                  <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>{agent?.desc}</p>
                </div>
                <button type="button" onClick={() => setStep("select")} className="text-xs transition hover:underline" style={{ color: "var(--color-primary)" }}>Change</button>
              </div>

              <p className="mb-4 text-sm font-medium" style={{ color: "var(--color-text-body)" }}>How do you want to trigger calls?</p>

              <div className="space-y-3">
                {/* Immediate */}
                <button type="button" onClick={() => { setState("running"); onStart(); }} className="flex w-full items-center gap-4 rounded-xl border p-4 text-left transition hover:border-[#6687dc] hover:bg-[#f0f5ff]" style={{ borderColor: "var(--color-border)", background: "var(--color-bg)" }}>
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl" style={{ background: "var(--color-accent-bg)", color: "var(--color-primary)" }}><Play size={18} /></div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "var(--color-text-heading)" }}>Trigger Immediately</p>
                    <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>Start calling right now</p>
                  </div>
                </button>

                {/* Schedule */}
                <div className="rounded-xl border p-4" style={{ borderColor: "var(--color-border)", background: "var(--color-bg)" }}>
                  <div className="flex items-center gap-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl" style={{ background: "var(--color-accent-bg)", color: "var(--color-primary)" }}><CalendarDays size={18} /></div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "var(--color-text-heading)" }}>Schedule Calls</p>
                      <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>Pick a date and time</p>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <input
                      type="datetime-local"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      className="flex-1 rounded-lg border px-3 py-2 text-sm outline-none transition focus:ring-2"
                      style={{ borderColor: "var(--color-border)", color: "var(--color-text-body)" }}
                    />
                    <button
                      type="button"
                      disabled={!scheduledTime}
                      onClick={() => setState("scheduled")}
                      className="rounded-lg px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-40"
                      style={{ background: "var(--color-primary)" }}
                    >
                      Schedule
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {state === "running" && (
            <div className="py-4 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-green-500"><CheckCircle2 size={28} /></div>
              <h3 className="mt-4 text-base font-semibold" style={{ color: "var(--color-text-heading)" }}>Campaign Running</h3>
              <p className="mt-2 text-sm" style={{ color: "var(--color-text-muted)" }}><span className="font-medium" style={{ color: "var(--color-text-body)" }}>{agent?.name}</span> is calling {totalContacts} contacts.</p>
              <button type="button" onClick={() => setState("cancelled")} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 py-3 text-sm font-medium text-red-500 transition hover:bg-red-100">
                <X size={15} /> Cancel Campaign
              </button>
            </div>
          )}

          {state === "scheduled" && (
            <div className="py-4 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50" style={{ color: "var(--color-primary)" }}><CalendarDays size={28} /></div>
              <h3 className="mt-4 text-base font-semibold" style={{ color: "var(--color-text-heading)" }}>Campaign Scheduled</h3>
              <p className="mt-2 text-sm" style={{ color: "var(--color-text-muted)" }}>
                <span className="font-medium" style={{ color: "var(--color-text-body)" }}>{agent?.name}</span> will start at{" "}
                <span className="font-medium" style={{ color: "var(--color-text-body)" }}>{new Date(scheduledTime).toLocaleString()}</span>.
              </p>
              <button type="button" onClick={() => setState("cancelled")} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 py-3 text-sm font-medium text-red-500 transition hover:bg-red-100">
                <X size={15} /> Cancel Schedule
              </button>
            </div>
          )}

          {state === "cancelled" && (
            <div className="py-4 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400"><X size={28} /></div>
              <h3 className="mt-4 text-base font-semibold" style={{ color: "var(--color-text-heading)" }}>Campaign Cancelled</h3>
              <p className="mt-2 text-sm" style={{ color: "var(--color-text-muted)" }}>The campaign has been stopped.</p>
              <button type="button" onClick={() => { setStep("select"); setAgentId(null); setState("idle"); }} className="mt-6 w-full rounded-xl py-3 text-sm font-medium text-white transition hover:opacity-90" style={{ background: "var(--color-primary)" }}>
                Start New Campaign
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const statusColor: Record<string, string> = {
  ready: "#22c55e",
  processing: "#f59e0b",
  failed: "#ef4444",
};
