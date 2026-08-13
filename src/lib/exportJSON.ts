import type { Prospect } from "@/data/mockData";

export function downloadJSON(prospects: Prospect[]): void {
  const blob = new Blob([JSON.stringify(prospects, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "prospect-results.json";
  a.click();
  URL.revokeObjectURL(url);
}
