import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Download, ExternalLink, FileText, Table } from "lucide-react";
import type { Prospect } from "@/data/mockData";
import { downloadCSV } from "@/lib/exportCSV";
import { downloadJSON } from "@/lib/exportJSON";
import { downloadPDF } from "@/lib/exportPDF";

type DownloadBoxProps = {
  prospects: Prospect[];
  query?: string;
  title?: string;
};

const menuItem =
  "flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-[#334b6b] transition-colors duration-150 hover:bg-[#17345e] hover:text-white";

export default function DownloadBox({
  prospects,
  query = "",
  title = "prospecting_results",
}: DownloadBoxProps) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  if (!prospects.length) return null;

  function closeAnd(run: () => void) {
    run();
    setOpen(false);
  }

  return (
    <div className="mx-auto mb-3 w-full px-4 sm:px-6 lg:px-8">
      <div
        className="rounded-2xl border bg-white px-5 py-4 shadow-sm"
        style={{ borderColor: "var(--color-border)" }}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h3
              className="truncate text-sm font-semibold"
              style={{ color: "var(--color-text-body)" }}
            >
              {title}
            </h3>
            <p className="mt-1 text-xs" style={{ color: "var(--color-text-muted)" }}>
              Your list is ready!
            </p>
          </div>

          <span className="shrink-0 text-xs" style={{ color: "var(--color-text-muted)" }}>
            {new Date().toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <div className="relative" ref={menuRef}>
            <div className="flex overflow-hidden rounded-full shadow-sm">
              <button
                type="button"
                onClick={() => downloadCSV(prospects)}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
                style={{ background: "var(--color-primary)" }}
              >
                <Download size={15} />
                Download {prospects.length} rows
              </button>

              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="flex items-center justify-center border-l px-3 text-white transition hover:opacity-90"
                style={{
                  background: "var(--color-primary)",
                  borderColor: "rgba(255,255,255,0.3)",
                }}
                aria-label="Download options"
                aria-expanded={open}
              >
                <ChevronDown
                  size={16}
                  className={["transition-transform duration-150", open ? "rotate-180" : ""].join(" ")}
                />
              </button>
            </div>

            {open && (
              <div
                className="absolute bottom-full left-0 z-20 mb-2 min-w-[160px] overflow-hidden rounded-xl border bg-white py-1 shadow-[0_8px_32px_rgba(23,52,94,0.14)]"
                style={{ borderColor: "var(--color-border)" }}
              >
                <button
                  type="button"
                  className={menuItem}
                  onClick={() => closeAnd(() => downloadPDF(prospects, query))}
                >
                  <FileText size={14} />
                  PDF
                </button>
                <button
                  type="button"
                  className={menuItem}
                  onClick={() => closeAnd(() => downloadCSV(prospects))}
                >
                  <Table size={14} />
                  CSV
                </button>
                <button
                  type="button"
                  className={menuItem}
                  onClick={() => closeAnd(() => downloadJSON(prospects))}
                >
                  <span className="w-[14px] text-center font-mono text-[11px]">{"{ }"}</span>
                  JSON
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            className="flex items-center gap-2 text-sm font-medium transition hover:underline"
            style={{ color: "var(--color-primary)" }}
            onClick={() => navigate("/lists")}
          >
            <ExternalLink size={15} />
            Open in Lists
          </button>
        </div>
      </div>
    </div>
  );
}
