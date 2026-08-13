import type { Prospect } from "@/data/mockData";

function escape(v: string | number): string {
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function downloadCSV(prospects: Prospect[]): void {
  const headers = [
    "Company",
    "Industry",
    "Employees",
    "Location",
    "Website",
    "Contact Name",
    "Contact Title",
    "Phone",
    "Email",
    "Description",
  ];
  const rows = prospects.map((p) => [
    p.company,
    p.industry,
    p.employees,
    p.location,
    p.website,
    p.contactName,
    p.contactTitle,
    p.contactPhone,
    p.contactEmail,
    p.description,
  ]);
  const csv = [headers, ...rows].map((r) => r.map(escape).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "prospect-results.csv";
  a.click();
  URL.revokeObjectURL(url);
}
