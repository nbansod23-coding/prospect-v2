import { ChevronDown, Download, ExternalLink } from "lucide-react";
import type { Prospect } from "@/data/mockData";

type DownloadBoxProps = {
  prospects: Prospect[];
  title?: string;
};

export default function DownloadBox({
  prospects,
  title = "prospecting_results",
}: DownloadBoxProps) {
  if (!prospects.length) return null;

  const downloadCSV = () => {
    const rows = prospects as unknown as Record<string, unknown>[];

    if (!rows.length) return;

    const headers = Array.from(
      new Set(rows.flatMap((row) => Object.keys(row)))
    );

    const escapeCSV = (value: unknown) => {
      const text = value == null ? "" : String(value);
      return `"${text.replace(/"/g, '""')}"`;
    };

    const csv = [
      headers.join(","),
      ...rows.map((row) =>
        headers.map((header) => escapeCSV(row[header])).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${title}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto mb-3 w-full px-4 sm:px-6 lg:px-8">
      <div
        className="rounded-2xl border bg-white px-5 py-4 shadow-sm"
        style={{
          borderColor: "var(--color-border)",
        }}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h3
              className="truncate text-sm font-semibold"
              style={{ color: "var(--color-text-body)" }}
            >
              {title}
            </h3>

            <p
              className="mt-1 text-xs"
              style={{ color: "var(--color-text-muted)" }}
            >
              Your list is ready!
            </p>
          </div>

          <span
            className="shrink-0 text-xs"
            style={{ color: "var(--color-text-muted)" }}
          >
            {new Date().toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <div className="flex overflow-hidden rounded-full shadow-sm">
            <button
              type="button"
              onClick={downloadCSV}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
              style={{
                background: "var(--color-primary)",
              }}
            >
              <Download size={15} />

              Download {prospects.length} rows
            </button>

            <button
              type="button"
              className="flex items-center justify-center border-l px-3 text-white transition hover:opacity-90"
              style={{
                background: "var(--color-primary)",
                borderColor: "rgba(255,255,255,0.3)",
              }}
              aria-label="Download options"
            >
              <ChevronDown size={16} />
            </button>
          </div>

          <button
            type="button"
            className="flex items-center gap-2 text-sm font-medium transition hover:underline"
            style={{
              color: "var(--color-primary)",
            }}
            onClick={() => {
              // Connect this later to your Lists page/router.
              console.log("Open in Lists");
            }}
          >
            <ExternalLink size={15} />

            Open in Lists
          </button>
        </div>
      </div>
    </div>
  );
}