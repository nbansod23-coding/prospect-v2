export type AgentDecision = {
  message: string;
  reasoning: string;
  nextAction:
    | "continue"
    | "complete";

  result?:
    | "hot_lead"
    | "interested"
    | "call_back"
    | "not_interested"
    | "no_answer";
};

export async function processAgentMessage(
  conversation: {
    role: "agent" | "user";
    text: string;
  }[]
): Promise<AgentDecision> {
  // Browser AI inference will live here.
  
  throw new Error("AI engine not initialized");
}