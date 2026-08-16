export type AgentResult =
  | "interested"
  | "not_interested"
  | "call_back"
  | "no_answer"
  | "hot_lead";

export type ConversationState =
  | "idle"
  | "speaking"
  | "listening"
  | "thinking"
  | "completed";

export type AgentMessage = {
  id: number;
  role: "agent" | "user" | "system";
  text: string;
};

export type AgentContactResult = {
  contactId: number;
  result: AgentResult;
  conversation: AgentMessage[];
};