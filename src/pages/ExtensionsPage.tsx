import { ExternalLink } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUIStore } from "@/store/uiStore";

const EXTENSIONS = [
  {
    id: "claude",
    name: "Claude",
    description: "Connect ProspectAI with Claude for AI-powered analysis and outreach.",
    icon: "✳",
    iconBg: "#fff7ed",
    iconColor: "#ea8a3b",
  },
  {
    id: "chatgpt",
    name: "ChatGPT",
    description: "Integrate with ChatGPT to enrich prospect data and draft personalised messages.",
    icon: "◉",
    iconBg: "#f0fdf4",
    iconColor: "#16a34a",
  },
  {
    id: "perplexity",
    name: "Perplexity",
    description: "Use Perplexity for real-time web search and prospect research.",
    icon: "◈",
    iconBg: "#eff6ff",
    iconColor: "#2563eb",
  },
];

export default function ExtensionsPage() {
  const navigate = useNavigate();
  const { sidebarCollapsed, toggleSidebar } = useUIStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

      <main className="min-w-0 flex-1 overflow-y-auto p-6 lg:p-10">
        <div className="mx-auto max-w-5xl">
          <div>
            <h1 className="text-3xl font-semibold" style={{ color: "var(--color-text-heading)" }}>
              Extensions
            </h1>
            <p className="mt-2 text-sm" style={{ color: "var(--color-text-muted)" }}>
              Connect ProspectAI with your favourite AI tools.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {EXTENSIONS.map((ext) => (
              <div
                key={ext.id}
                className="flex items-start justify-between rounded-2xl border p-5 transition hover:shadow-md"
                style={{
                  border: `1px solid var(--color-border)`,
                  background: "rgba(255,255,255,0.65)",
                }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl"
                    style={{ background: ext.iconBg, color: ext.iconColor }}
                  >
                    {ext.icon}
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "var(--color-text-heading)" }}>
                      {ext.name}
                    </p>
                    <p className="mt-1 text-xs leading-5" style={{ color: "var(--color-text-muted)" }}>
                      {ext.description}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className="ml-3 flex shrink-0 items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition hover:bg-[#f0f5ff]"
                  style={{ borderColor: "var(--color-border)", color: "var(--color-primary)" }}
                >
                  Connect
                  <ExternalLink size={11} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
