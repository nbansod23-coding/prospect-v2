import type { Contact } from "@/types/contact";

export type LeadResult =
  | "not_called"
  | "calling"
  | "interested"
  | "not_interested"
  | "call_back"
  | "no_answer";

export type CampaignStatus =
  | "idle"
  | "running"
  | "completed"
  | "cancelled";

export type Campaign = {
  id: string;
  listId: number;
  agentId: string;
  agentName: string;

  contacts: Contact[];

  currentIndex: number;

  results: Record<number, LeadResult>;

  status: CampaignStatus;

  startedAt?: string;
  completedAt?: string;
};