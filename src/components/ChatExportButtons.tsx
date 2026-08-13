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

const btn =
  "rounded border border-blue-200 bg-white px-1.5 py-0.5 text-[10px] font-medium leading-none text-zinc-600 transition hover:bg-blue-50";

export default function ChatExportButtons({ messages, chatTitle, prospects = [], query = "" }: Props) {
  if (messages.length === 0) return null;

  return (
    <div className="flex flex-nowrap items-center gap-1 rounded-md border border-blue-200 bg-blue-50 px-1.5 py-1">
      <span className="flex items-center gap-1 text-[10px] font-medium text-blue-700">
        <Download size={10} />
        Export chat:
      </span>

      <button
        type="button"
        onClick={() => downloadChatAsText(messages, chatTitle)}
        className={btn}
      >
        TXT
      </button>
      <button
        type="button"
        onClick={() => downloadJSON(messages, chatTitle)}
        className={btn}
      >
        JSON
      </button>

      {prospects.length > 0 && (
        <>
          <button
            type="button"
            onClick={() => downloadPDF(prospects, query)}
            className={btn}
          >
            PDF
          </button>
          <button
            type="button"
            onClick={() => downloadCSV(prospects)}
            className={btn}
          >
            CSV
          </button>
        </>
      )}
    </div>
  );
}
