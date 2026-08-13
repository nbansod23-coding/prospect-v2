import { mockProspects, type Prospect } from "@/data/mockData";

export type MockAIResult = {
  prospects: Prospect[];
  summary: string;
  total: number;
  requestedLimit: number;
  industry: string | null;
  location: string | null;
};

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 20;

function extractLimit(query: string): number {
  const match = query.match(/\b(\d{1,2})\b/);
  if (!match) return DEFAULT_LIMIT;
  return Math.min(Math.max(parseInt(match[1], 10), 1), MAX_LIMIT);
}

function detectIndustry(query: string): string | null {
  const q = query.toLowerCase();
  if (q.includes("saas") || q.includes("software")) return "SaaS";
  if (q.includes("pharma") || q.includes("pharmaceutical")) return "Pharmaceutical";
  if (q.includes("health") || q.includes("medical") || q.includes("clinic")) return "Healthcare";
  if (q.includes("fintech") || q.includes("finance") || q.includes("banking")) return "SaaS";
  return null;
}

function detectLocation(query: string): string | null {
  const q = query.toLowerCase();
  if (q.includes("bangalore") || q.includes("bengaluru")) return "Bengaluru";
  if (q.includes("mumbai") || q.includes("bombay")) return "Mumbai";
  if (q.includes("delhi") || q.includes("new delhi")) return "Delhi";
  if (q.includes("pune")) return "Pune";
  if (q.includes("hyderabad")) return "Hyderabad";
  if (q.includes("chennai")) return "Chennai";
  if (q.includes("india")) return "India";
  return null;
}

function filterProspects(industry: string | null, location: string | null): Prospect[] {
  return mockProspects.filter((p) => {
    const matchIndustry = !industry || p.industry.toLowerCase() === industry.toLowerCase();
    const matchLocation =
      !location ||
      location === "India" ||
      p.location.toLowerCase().includes(location.toLowerCase());
    return matchIndustry && matchLocation;
  });
}

function createSummary(count: number, industry: string | null, location: string | null): string {
  const ind = industry ? ` ${industry}` : "";
  const loc = location ? ` in ${location}` : "";
  return `I found ${count}${ind} prospect${count === 1 ? "" : "s"}${loc} matching your request. Here are the top results based on your criteria.`;
}

export async function generateMockResponse(query: string): Promise<MockAIResult> {
  await new Promise((resolve) => setTimeout(resolve, 900));

  const limit = extractLimit(query);
  const industry = detectIndustry(query);
  const location = detectLocation(query);

  let filtered = filterProspects(industry, location);
  if (filtered.length === 0 && !industry && !location) {
    filtered = [...mockProspects];
  }

  const prospects = filtered.slice(0, limit);

  return {
    prospects,
    summary: createSummary(prospects.length, industry, location),
    total: filtered.length,
    requestedLimit: limit,
    industry,
    location,
  };
}
