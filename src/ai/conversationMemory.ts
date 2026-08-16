import type { MLCEngine } from "@mlc-ai/web-llm";

import {
  AGENT_SYSTEM_PROMPT,
} from "./agentPrompt";

export type ConversationMessage = {
  role: "user" | "assistant";
  content: string;
};

export type AgentDecision = {
  message: string;
  reasoning: string;
  action: "continue" | "complete";
  result:
    | "hot_lead"
    | "interested"
    | "call_back"
    | "not_interested"
    | "no_answer"
    | null;
};

export async function processConversation(
  engine: MLCEngine,
  messages: ConversationMessage[]
): Promise<AgentDecision> {
  const response = await engine.chat.completions.create({
    messages: [
      {
        role: "system",
        content: AGENT_SYSTEM_PROMPT,
      },
      ...messages,
    ],

    temperature: 0.4,

    max_tokens: 300,
  });

  const content =
    response.choices[0]?.message?.content;

  if (!content) {
    throw new Error(
      "Local AI returned an empty response."
    );
  }

  return parseAgentResponse(content);
}

function parseAgentResponse(
  content: string
): AgentDecision {
  const cleaned = content
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  try {
    const parsed = JSON.parse(cleaned);

    return {
      message: String(parsed.message ?? ""),
      reasoning: String(parsed.reasoning ?? ""),
      action:
        parsed.action === "complete"
          ? "complete"
          : "continue",
      result:
        parsed.result === "hot_lead" ||
        parsed.result === "interested" ||
        parsed.result === "call_back" ||
        parsed.result === "not_interested" ||
        parsed.result === "no_answer"
          ? parsed.result
          : null,
    };
  } catch {
    return {
      message: content,
      reasoning: "The local model returned non-JSON output.",
      action: "continue",
      result: null,
    };
  }
}