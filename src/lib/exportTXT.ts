import type { StoredMessage } from "./chatStorage";
import type { Prospect } from "@/data/mockData";

export function downloadChatAsText(messages: StoredMessage[], title: string): void {
  const lines: string[] = [
    `Chat: ${title}`,
    `Exported: ${new Date().toLocaleString()}`,
    `Messages: ${messages.length}`,
    "─".repeat(60),
    "",
  ];

  messages.forEach((m) => {
    const ts = new Date(m.createdAt).toLocaleTimeString();
    lines.push(`[${ts}] ${m.role === "user" ? "You" : "AI"}:`);
    lines.push(m.content);
    lines.push("");
  });

  const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `chat-${Date.now()}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadProspectsAsText(prospects: Prospect[], query: string): void {
  const lines: string[] = [
    `Query: ${query}`,
    `Results: ${prospects.length}`,
    `Generated: ${new Date().toLocaleString()}`,
    "─".repeat(60),
    "",
  ];

  prospects.forEach((p, i) => {
    lines.push(`${i + 1}. ${p.company}`);
    lines.push(`   Industry:  ${p.industry}`);
    lines.push(`   Employees: ${p.employees.toLocaleString()}`);
    lines.push(`   Location:  ${p.location}`);
    lines.push(`   Website:   ${p.website}`);
    lines.push(`   Contact:   ${p.contactName} (${p.contactTitle})`);
    lines.push(`   Email:     ${p.contactEmail}`);
    lines.push("");
  });

  const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `prospects-${Date.now()}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}
