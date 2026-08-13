import { Download, FileText, Table } from "lucide-react";
import type { Prospect } from "@/data/mockData";
import { downloadCSV } from "@/lib/exportCSV";
import { downloadJSON } from "@/lib/exportJSON";
import { downloadPDF } from "@/lib/exportPDF";

type Props = {
  prospects: Prospect[];
  query: string;
};

const btn =
  "flex items-center gap-1.5 rounded-lg border border-[#d8e1ed] bg-white px-3 py-1.5 text-xs font-medium text-[#334b6b] transition-all duration-150 hover:border-[#17345e] hover:bg-[#17345e] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6687dc]/45 focus-visible:ring-offset-1";

export default function DownloadButtons({
  prospects,
  query,
}: Props) {
  if (prospects.length === 0) return null;

  return (
    <div className="flex shrink-0 flex-nowrap items-center gap-1.5">
      <span className="flex items-center gap-1.5 text-xs font-medium tabular-nums text-zinc-500">
        <Download size={13} className="shrink-0 text-[#6687dc]" />
        {prospects.length} record{prospects.length !== 1 ? "s" : ""}
      </span>

      <span className="hidden h-3.5 w-px bg-zinc-200 sm:block" aria-hidden />

      <button type="button" onClick={() => downloadPDF(prospects, query)} className={btn}>
        <FileText size={12} />
        PDF
      </button>

      <button type="button" onClick={() => downloadCSV(prospects)} className={btn}>
        <Table size={12} />
        CSV
      </button>

      <button type="button" onClick={() => downloadJSON(prospects)} className={btn}>
        <span className="font-mono text-[11px] leading-none">{"{ }"}</span>
        JSON
      </button>
    </div>
  );
}
