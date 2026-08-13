import { Building2, Globe, Mail, MapPin, Phone, Sparkles, Users } from "lucide-react";
import type { Prospect } from "@/data/mockData";
import DownloadButtons from "./DownloadButtons";

type Props = {
  prospects: Prospect[];
  query: string;
  summary?: string;
  industry?: string | null;
  location?: string | null;
  selectedIds?: number[];
  onToggleSelect?: (id: number) => void;
  onToggleAll?: () => void;
};

export default function ResultsCard({
  prospects,
  query,
  summary,
  industry,
  location,
  selectedIds,
  onToggleSelect,
  onToggleAll,
}: Props) {
  if (prospects.length === 0) return null;

  const selectable = typeof onToggleSelect === "function";
  const selected = new Set(selectedIds ?? []);
  const allSelected = selectable && prospects.length > 0 && prospects.every((p) => selected.has(p.id));
  const someSelected = selectable && selected.size > 0 && !allSelected;
  const exportProspects =
    selectable && selected.size > 0
      ? prospects.filter((p) => selected.has(p.id))
      : prospects;

  return (
    <div
      className="mt-3 w-full animate-fade-in overflow-hidden rounded-2xl border bg-white"
      style={{
        borderColor: "var(--color-border)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      {/* ── Header ── */}
      <div className="border-b px-5 py-4" style={{ borderColor: "var(--color-border-light)" }}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white shadow-sm"
              style={{ background: "linear-gradient(135deg, #3a5fa0 0%, #17345e 100%)" }}
            >
              <Building2 size={18} />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-[15px] font-semibold tracking-tight" style={{ color: "var(--color-text-heading)" }}>
                  Prospect results
                </h3>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
                  Mock Data
                </span>
              </div>
              <p className="mt-0.5 text-[12px]" style={{ color: "var(--color-text-muted)" }}>
                {selected.size > 0
                  ? `${selected.size} selected of ${prospects.length}`
                  : `${prospects.length} matching record${prospects.length !== 1 ? "s" : ""}`}
              </p>
            </div>
          </div>

          <DownloadButtons prospects={exportProspects} query={query} />
        </div>

        {(industry || location) && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {industry && (
              <span className="rounded-full border border-[#d8e1ed] bg-white px-2.5 py-1 text-[11px] font-medium text-[#334b6b] transition-colors duration-150 hover:border-[#17345e] hover:bg-[#17345e] hover:text-white">
                Industry: {industry}
              </span>
            )}
            {location && (
              <span className="rounded-full border border-[#d8e1ed] bg-white px-2.5 py-1 text-[11px] font-medium text-[#334b6b] transition-colors duration-150 hover:border-[#17345e] hover:bg-[#17345e] hover:text-white">
                Location: {location}
              </span>
            )}
          </div>
        )}

        {summary && (
          <div
            className="mt-3 flex gap-2.5 rounded-xl border px-3 py-2.5"
            style={{ borderColor: "var(--color-border-light)", background: "var(--color-accent-active)" }}
          >
            <Sparkles size={14} className="mt-0.5 shrink-0" style={{ color: "var(--color-primary)" }} />
            <p className="text-xs leading-5" style={{ color: "var(--color-text-body)" }}>{summary}</p>
          </div>
        )}
      </div>

      {/* ── Table ── */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] table-fixed border-collapse text-sm">
          <colgroup>
            {selectable && <col className="w-9" />}
            <col className="w-[26%]" />
            <col className="w-[12%]" />
            <col className="w-[10%]" />
            <col className="w-[14%]" />
            <col className="w-[16%]" />
            <col className="w-[20%]" />
          </colgroup>
          <thead>
            <tr style={{ background: "#f7f9fd" }}>
              {selectable && (
                <th className="px-3 py-2.5 text-left">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = someSelected;
                    }}
                    onChange={onToggleAll}
                    aria-label="Select all records"
                    className="tiny-check"
                  />
                </th>
              )}
              {["Company", "Industry", "Employees", "Location", "Website", "Contact"].map((h) => (
                <th
                  key={h}
                  className="px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-[0.08em]"
                  style={{ color: "var(--color-text-faint)" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {prospects.map((p) => {
              const isSelected = selected.has(p.id);
              return (
                <tr
                  key={p.id}
                  onClick={selectable ? () => onToggleSelect?.(p.id) : undefined}
                  className={[
                    "border-t transition-colors duration-150",
                    selectable ? "cursor-pointer" : "",
                    "hover:bg-[#f5f8fd]",
                  ].join(" ")}
                  style={{ borderColor: "var(--color-border-light)" }}
                >
                  {selectable && (
                    <td className="px-3 py-3 align-middle" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelect?.(p.id)}
                        aria-label={`Select ${p.company}`}
                        className="tiny-check"
                      />
                    </td>
                  )}

                  {/* Company */}
                  <td className="px-3 py-3 align-middle">
                    <div className="flex items-start gap-2.5">
                      <div
                        className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[12px] font-bold"
                        style={{
                          background: "linear-gradient(180deg, #eef3fb 0%, #e2eaf6 100%)",
                          color: "var(--color-primary-deep)",
                        }}
                      >
                        {p.company[0]}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-semibold leading-5" style={{ color: "var(--color-text-heading)" }}>
                          {p.company}
                        </p>
                        <p className="mt-0.5 line-clamp-2 text-[11px] leading-4" style={{ color: "var(--color-text-muted)" }}>
                          {p.description}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Industry */}
                  <td className="px-3 py-3 align-middle">
                    <span className="inline-flex max-w-full truncate rounded-full border border-[#d8e1ed] bg-white px-2.5 py-1 text-[11px] font-medium text-[#334b6b] transition-colors duration-150 hover:border-[#17345e] hover:bg-[#17345e] hover:text-white">
                      {p.industry}
                    </span>
                  </td>

                  {/* Employees */}
                  <td className="px-3 py-3 align-middle">
                    <div className="flex items-center gap-1.5 whitespace-nowrap text-[12px]" style={{ color: "var(--color-text-body)" }}>
                      <Users size={12} className="shrink-0" style={{ color: "var(--color-text-faint)" }} />
                      <span className="tabular-nums font-medium">{p.employees.toLocaleString()}</span>
                    </div>
                  </td>

                  {/* Location */}
                  <td className="px-3 py-3 align-middle">
                    <div className="flex items-center gap-1.5 text-[12px]" style={{ color: "var(--color-text-body)" }}>
                      <MapPin size={12} className="shrink-0" style={{ color: "var(--color-text-faint)" }} />
                      <span className="leading-4">{p.location}</span>
                    </div>
                  </td>

                  {/* Website */}
                  <td className="px-3 py-3 align-middle">
                    <a
                      href={`https://${p.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex max-w-full items-center gap-1.5 text-[12px] font-medium transition hover:underline"
                      style={{ color: "var(--color-primary)" }}
                      onClick={(e) => e.stopPropagation()}
                      title={p.website}
                    >
                      <Globe size={12} className="shrink-0" />
                      <span className="truncate">{p.website.replace(/^www\./, "")}</span>
                    </a>
                  </td>

                  {/* Contact */}
                  <td className="px-3 py-3 align-middle">
                    <div className="min-w-0 leading-4">
                      <p className="truncate text-[12px] font-semibold" style={{ color: "var(--color-text-heading)" }}>
                        {p.contactName}
                      </p>
                      <p className="truncate text-[11px]" style={{ color: "var(--color-text-muted)" }}>
                        {p.contactTitle}
                      </p>
                      <div className="mt-1 flex flex-col gap-0.5">
                        {p.contactPhone && (
                          <p className="flex items-center gap-1 text-[11px] tabular-nums" style={{ color: "var(--color-text-body)" }}>
                            <Phone size={10} className="shrink-0" style={{ color: "var(--color-text-faint)" }} />
                            {p.contactPhone}
                          </p>
                        )}
                        {p.contactEmail && (
                          <p className="flex min-w-0 items-center gap-1 text-[11px]" style={{ color: "var(--color-text-body)" }}>
                            <Mail size={10} className="shrink-0" style={{ color: "var(--color-text-faint)" }} />
                            <span className="truncate">{p.contactEmail}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── Footer ── */}
      <div
        className="border-t px-5 py-2.5 text-[11px]"
        style={{ borderColor: "var(--color-border-light)", color: "var(--color-text-faint)" }}
      >
        Mock prospect data generated for demonstration purposes · {prospects.length} result
        {prospects.length !== 1 ? "s" : ""}
      </div>
    </div>
  );
}
