import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Copy } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { useUIStore } from "@/store/uiStore";

const PROMPTS = [
  {
    id: 1,
    title: "SaaS Lead Discovery",
    category: "Lead Gen",
    text: "Find 10 SaaS companies in India with 100–500 employees that are actively hiring sales roles, focused on the B2B market.",
  },
  {
    id: 2,
    title: "Healthcare Decision Makers",
    category: "Healthcare",
    text: "Find 5 healthcare companies in Mumbai or Bengaluru where the CEO or CMO has been in the role for less than 2 years.",
  },
  {
    id: 3,
    title: "Pharma Partnership Targets",
    category: "Pharma",
    text: "Find pharmaceutical companies in India with over 300 employees that have launched a new product in the last 12 months.",
  },
  {
    id: 4,
    title: "Pharma Recruiter Outreach",
    category: "Recruiting",
    text: "Find pharma companies in Pune or Hyderabad that are Series B or later, hiring software engineers, with 50–200 employees.",
  },
  {
    id: 5,
    title: "FinPharma Growth Targets",
    category: "Fintech",
    text: "Find 8 finPharma startups in Delhi or Mumbai that offer embedded finance products and have raised funding in the last 18 months.",
  },
  {
    id: 6,
    title: "Health Care Platform ",
    category: "Health Care",
    text: "Find D2C brands in India with 20–100 employees that sell across at least 3 online channels and are based in metro cities.",
  },
];

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  "Lead Gen":   { bg: "#eef2ff", text: "#6687dc" },
  Healthcare:   { bg: "#f0fdf4", text: "#16a34a" },
  Pharma:       { bg: "#fdf4ff", text: "#9333ea" },
  Recruiting:   { bg: "#fff7ed", text: "#ea580c" },
  Fintech:      { bg: "#eff6ff", text: "#2563eb" },
  "E-commerce": { bg: "#fef9c3", text: "#ca8a04" },
};

export default function PromptsPage() {
  const navigate = useNavigate();
  const { sidebarCollapsed, toggleSidebar } = useUIStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  function copyPrompt(id: number, text: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    });
  }

  function usePrompt(text: string) {
    navigate(`/chat?q=${encodeURIComponent(text)}`);
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

      <main className="min-w-0 flex-1 overflow-y-auto p-6 lg:p-10">
        <div className="mx-auto max-w-5xl">
          <div>
            <h1 className="text-3xl font-semibold" style={{ color: "var(--color-text-heading)" }}>
              Prompt Library
            </h1>
            <p className="mt-2 text-sm" style={{ color: "var(--color-text-muted)" }}>
              Ready-made prompts to supercharge your prospecting.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {PROMPTS.map((prompt) => {
              const cat = CATEGORY_COLORS[prompt.category] ?? { bg: "var(--color-accent-bg)", text: "var(--color-primary)" };
              return (
                <div
                  key={prompt.id}
                  className="flex flex-col rounded-2xl border p-5 transition hover:shadow-md"
                  style={{ border: `1px solid var(--color-border)`, background: "rgba(255,255,255,0.65)" }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span
                        className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
                        style={{ background: cat.bg, color: cat.text }}
                      >
                        {prompt.category}
                      </span>
                      <h3 className="mt-2 text-sm font-semibold" style={{ color: "var(--color-text-heading)" }}>
                        {prompt.title}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyPrompt(prompt.id, prompt.text)}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition hover:bg-[#f0f4ff]"
                      style={{ color: "var(--color-text-faint)" }}
                      title="Copy prompt"
                    >
                      <Copy size={14} className={copiedId === prompt.id ? "text-green-500" : ""} />
                    </button>
                  </div>

                  <p className="mt-3 flex-1 text-sm leading-6" style={{ color: "var(--color-text-muted)" }}>
                    {prompt.text}
                  </p>

                  <button
                    type="button"
                    onClick={() => usePrompt(prompt.text)}
                    className="mt-4 w-full rounded-xl py-2.5 text-sm font-medium text-white transition hover:opacity-90"
                    style={{ background: "var(--color-primary)" }}
                  >
                    Use Prompt
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
