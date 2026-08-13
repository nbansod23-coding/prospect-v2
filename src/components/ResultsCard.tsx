import { Building2, Globe, MapPin, Phone, Sparkles, Users } from "lucide-react";
import type { Prospect } from "@/data/mockData";
import DownloadButtons from "./DownloadButtons";

type Props = {
  prospects: Prospect[];
  query: string;
  summary?: string;
  industry?: string | null;
  location?: string | null;
};

export default function ResultsCard({ prospects, query, summary, industry, location }: Props) {
  if (prospects.length === 0) return null;

  return (
    <div className="mt-3 w-full animate-fade-in overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
      {/* ── Header ── */}
      <div className="border-b border-zinc-100 p-4 md:p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-100">
              <Building2 size={18} className="text-zinc-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-zinc-800">Prospect results</span>
                <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                  Mock Data
                </span>
              </div>
              <p className="mt-0.5 text-xs text-zinc-400">
                {prospects.length} matching record{prospects.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          <DownloadButtons prospects={prospects} query={query} />
        </div>

        {/* Filter tags */}
        {(industry || location) && (
          <div className="mt-3 flex flex-wrap gap-2">
            {industry && (
              <span className="rounded-md bg-zinc-100 px-2.5 py-1 text-xs text-zinc-600">
                Industry: {industry}
              </span>
            )}
            {location && (
              <span className="rounded-md bg-zinc-100 px-2.5 py-1 text-xs text-zinc-600">
                Location: {location}
              </span>
            )}
          </div>
        )}

        {/* AI summary */}
        {summary && (
          <div className="mt-4 flex gap-2.5 rounded-xl border border-zinc-100 bg-zinc-50/70 p-3">
            <Sparkles size={14} className="mt-0.5 shrink-0 text-zinc-400" />
            <p className="text-xs leading-5 text-zinc-600">{summary}</p>
          </div>
        )}
      </div>

      {/* ── Table ── */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[920px] text-sm">
          <thead>
            <tr className="border-b border-zinc-100 bg-zinc-50/60">
              {["Company", "Industry", "Employees", "Location", "Website", "Contact"].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-zinc-400"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {prospects.map((p) => (
              <tr key={p.id} className="border-b border-zinc-50 transition hover:bg-zinc-50/70">
                {/* Company */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-xs font-bold text-zinc-600">
                      {p.company[0]}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-zinc-800">{p.company}</p>
                      <p className="truncate text-[11px] text-zinc-400">{p.description}</p>
                    </div>
                  </div>
                </td>

                {/* Industry */}
                <td className="px-4 py-3">
                  <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-[11px] text-zinc-600">
                    {p.industry}
                  </span>
                </td>

                {/* Employees */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5 text-xs text-zinc-600">
                    <Users size={12} className="text-zinc-400" />
                    {p.employees.toLocaleString()}
                  </div>
                </td>

                {/* Location */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5 text-xs text-zinc-600">
                    <MapPin size={12} className="text-zinc-400" />
                    {p.location}
                  </div>
                </td>

                {/* Website */}
                <td className="px-4 py-3">
                  <a
                    href={`https://${p.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-[#6687dc] hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Globe size={12} />
                    <span className="truncate max-w-[120px]">{p.website}</span>
                  </a>
                </td>

                {/* Contact — name + phone */}
                <td className="px-4 py-3">
                  <div className="text-xs">
                    <p className="font-medium text-zinc-700">{p.contactName}</p>
                    <p className="text-zinc-400">{p.contactTitle}</p>
                    {p.contactPhone && (
                      <p className="mt-1 flex items-center gap-1.5 text-zinc-600">
                        <Phone size={11} className="shrink-0 text-zinc-400" />
                        <span className="tabular-nums">{p.contactPhone}</span>
                      </p>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Footer ── */}
      <div className="border-t border-zinc-100 px-4 py-3 text-[11px] text-zinc-400">
        Mock prospect data generated for demonstration purposes · {prospects.length} result
        {prospects.length !== 1 ? "s" : ""}
      </div>
    </div>
  );
}
