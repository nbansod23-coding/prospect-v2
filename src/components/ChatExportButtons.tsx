import { Download } from "lucide-react";
import type { StoredMessage } from "@/lib/chatStorage";
import type { Prospect } from "@/data/mockData";
import { downloadChatAsText } from "@/lib/exportTXT";
import { downloadPDF } from "@/lib/exportPDF";
import { downloadCSV } from "@/lib/exportCSV";

type Props = {
  messages: StoredMessage[];
  chatTitle: string;
  prospects?: Prospect[];
  query?: string;
};

function downloadJSON(messages: StoredMessage[], title: string) {
  const blob = new Blob(
    [JSON.stringify({ title, messages }, null, 2)],
    { type: "application/json" },
  );
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `chat-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ChatExportButtons({ messages, chatTitle, prospects = [], query = "" }: Props) {
  if (messages.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 p-3">
      <span className="flex items-center gap-1.5 text-xs font-medium text-blue-700">
        <Download size={13} />
        Export chat:
      </span>

      <button
        type="button"
        onClick={() => downloadChatAsText(messages, chatTitle)}
        className="rounded-md border border-blue-200 bg-white px-2.5 py-1 text-xs font-medium text-zinc-700 transition hover:bg-blue-50"
      >
        TXT
      </button>
      <button
        type="button"
        onClick={() => downloadJSON(messages, chatTitle)}
        className="rounded-md border border-blue-200 bg-white px-2.5 py-1 text-xs font-medium text-zinc-700 transition hover:bg-blue-50"
      >
        JSON
      </button>

      {prospects.length > 0 && (
        <>
          <button
            type="button"
            onClick={() => downloadPDF(prospects, query)}
            className="rounded-md border border-blue-200 bg-white px-2.5 py-1 text-xs font-medium text-zinc-700 transition hover:bg-blue-50"
          >
            PDF
          </button>
          <button
            type="button"
            onClick={() => downloadCSV(prospects)}
            className="rounded-md border border-blue-200 bg-white px-2.5 py-1 text-xs font-medium text-zinc-700 transition hover:bg-blue-50"
          >
            CSV
          </button>
        </>
      )}
    </div>
  );
}
