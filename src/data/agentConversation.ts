import type { AgentResult } from "@/types/agent";

type ReasoningResult = {
  response: string;
  nextQuestion?: string;
  result?: AgentResult;
};

export function reasonAboutResponse(
  response: string,
  questionNumber: number
): ReasoningResult {
  const text = response.toLowerCase().trim();

  /*
   * This is intentionally a frontend-only reasoning layer.
   * It is NOT an LLM.
   */

  const negativeWords = [
    "no",
    "not interested",
    "don't want",
    "do not want",
    "remove",
    "stop",
    "busy",
  ];

  const callbackWords = [
    "call later",
    "call back",
    "later",
    "tomorrow",
    "next week",
  ];

  const positiveWords = [
    "yes",
    "interested",
    "sure",
    "okay",
    "ok",
    "tell me",
    "sounds good",
    "send me",
  ];

  if (negativeWords.some((word) => text.includes(word))) {
    return {
      response: "The prospect does not appear interested.",
      result: "not_interested",
    };
  }

  if (callbackWords.some((word) => text.includes(word))) {
    return {
      response: "The prospect appears interested but wants to continue later.",
      result: "call_back",
    };
  }

  if (
    positiveWords.some((word) => text.includes(word)) &&
    questionNumber >= 2
  ) {
    return {
      response: "The prospect is showing strong buying interest.",
      result: "hot_lead",
    };
  }

  if (questionNumber === 1) {
    return {
      response: "The prospect has engaged with the conversation.",
      nextQuestion:
        "Great. Could you tell me a little about your current requirement?",
    };
  }

  if (questionNumber === 2) {
    return {
      response: "The prospect has provided some information.",
      nextQuestion:
        "That sounds interesting. Are you currently looking for a solution like this?",
    };
  }

  return {
    response: "The conversation indicates potential interest.",
    result: "interested",
  };
}