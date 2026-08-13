import { Download, FileText, Table } from "lucide-react";
import type { Prospect } from "@/data/mockData";
import { downloadCSV } from "@/lib/exportCSV";
import { downloadPDF } from "@/lib/exportPDF";

type Props = { prospects: Prospect[]; query: string };

function downloadJSON(prospects: Prospect[]) {
  const blob = new Blob([JSON.stringify(prospects, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "prospect-results.json";
  a.click();
  URL.revokeObjectURL(url);
}

export default function DownloadButtons({ prospects, query }: Props) {
  if (prospects.length === 0) return null;

  return (
    <div className="flex items-center gap-2">
      <span className="hidden items-center gap-1.5 text-xs text-zinc-400 sm:inline-flex">
        <Download size={13} />
        {prospects.length} records
      </span>

      <button
        type="button"
        onClick={() => downloadPDF(prospects, query)}
        className="flex items-center gap-1.5 rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-zinc-700"
      >
        <FileText size={12} />
        PDF
      </button>
      <button
        type="button"
        onClick={() => downloadCSV(prospects)}
        className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-50"
      >
        <Table size={12} />
        CSV
      </button>
      <button
        type="button"
        onClick={() => downloadJSON(prospects)}
        className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-50"
      >
        {"{ }"}
        JSON
      </button>
    </div>
  );
}
