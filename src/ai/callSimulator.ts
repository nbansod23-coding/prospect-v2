import type { LeadResult } from "@/types/campaign";

export function simulateAICall(): Promise<LeadResult> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const results: LeadResult[] = [
        "interested",
        "not_interested",
        "call_back",
        "no_answer",
      ];

      const result =
        results[Math.floor(Math.random() * results.length)];

      resolve(result);
    }, 2000);
  });
}