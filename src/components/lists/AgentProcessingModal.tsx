import { useEffect, useRef, useState } from "react";
import {
  Brain,
  CheckCircle2,
  Mic,
  Phone,
  Square,
  Volume2,
  X,
} from "lucide-react";

import type { Contact } from "@/types/contact";
import type {
  AgentMessage,
  AgentResult,
  ConversationState,
} from "@/types/agent";

import { reasonAboutResponse } from "@/data/agentConversation";

type Props = {
  contacts: Contact[];
  agentName: string;
  onClose: () => void;
  onComplete?: (
    results: {
      contactId: number;
      result: AgentResult;
      conversation: AgentMessage[];
    }[]
  ) => void;
};

export default function AgentProcessingModal({
  contacts,
  agentName,
  onClose,
  onComplete,
}: Props) {
  const [contactIndex, setContactIndex] = useState(0);
  const [state, setState] = useState<ConversationState>("idle");

  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [questionNumber, setQuestionNumber] = useState(0);

  const [result, setResult] = useState<AgentResult | null>(null);

  const [transcript, setTranscript] = useState("");

  const recognitionRef = useRef<any>(null);

  const contact = contacts[contactIndex];

  /*
   * Browser Speech Recognition
   */
  function startListening() {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setState("listening");

      setTranscript(
        "Speech recognition is not supported in this browser."
      );

      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognitionRef.current = recognition;

    recognition.onstart = () => {
      setState("listening");
    };

    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;

      setTranscript(text);

      handleUserResponse(text);
    };

    recognition.onerror = () => {
      setState("idle");
    };

    recognition.onend = () => {
      recognitionRef.current = null;
    };

    recognition.start();
  }

  /*
   * Browser Text-to-Speech
   */
  function speak(text: string, callback?: () => void) {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = "en-IN";
    utterance.rate = 0.95;
    utterance.pitch = 1;

    utterance.onstart = () => {
      setState("speaking");
    };

    utterance.onend = () => {
      callback?.();
    };

    window.speechSynthesis.speak(utterance);
  }

  /*
   * Start conversation
   */
  function startConversation() {
    if (!contact) return;

    setMessages([]);
    setQuestionNumber(1);
    setResult(null);
    setTranscript("");

    const greeting = `Hello ${contact.name}. This is ${agentName}. Am I speaking with you?`;

    addMessage("agent", greeting);

    speak(greeting, () => {
      startListening();
    });
  }

  function addMessage(
    role: AgentMessage["role"],
    text: string
  ) {
    setMessages((current) => [
      ...current,
      {
        id: Date.now(),
        role,
        text,
      },
    ]);
  }

  /*
   * Frontend reasoning
   */
  function handleUserResponse(text: string) {
    addMessage("user", text);

    setState("thinking");

    window.setTimeout(() => {
      const reasoning = reasonAboutResponse(
        text,
        questionNumber
      );

      addMessage("system", reasoning.response);

      if (reasoning.result) {
        setResult(reasoning.result);
        setState("completed");

        return;
      }

      if (reasoning.nextQuestion) {
        const nextQuestion = reasoning.nextQuestion;

        setQuestionNumber((current) => current + 1);

        addMessage("agent", nextQuestion);

        speak(nextQuestion, () => {
          startListening();
        });
      }
    }, 1000);
  }

  /*
   * Start when modal opens
   */
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
      recognitionRef.current?.stop();
    };
  }, []);

  if (!contact) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className="relative z-10 flex w-full max-w-2xl flex-col overflow-hidden rounded-2xl shadow-2xl"
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between border-b p-5"
          style={{
            borderColor: "var(--color-border-light)",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{
                background: "var(--color-accent-bg)",
                color: "var(--color-primary)",
              }}
            >
              <Phone size={19} />
            </div>

            <div>
              <h2
                className="text-sm font-semibold"
                style={{
                  color: "var(--color-text-heading)",
                }}
              >
                {agentName}
              </h2>

              <p
                className="text-xs"
                style={{
                  color: "var(--color-text-muted)",
                }}
              >
                Contact {contactIndex + 1} of {contacts.length}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{
              color: "var(--color-text-faint)",
            }}
          >
            <X size={17} />
          </button>
        </div>

        {/* Contact */}
        <div className="p-5">
          <div
            className="rounded-xl p-4"
            style={{
              background: "var(--color-bg)",
            }}
          >
            <p
              className="text-sm font-semibold"
              style={{
                color: "var(--color-text-heading)",
              }}
            >
              {contact.name}
            </p>

            <p
              className="mt-1 text-xs"
              style={{
                color: "var(--color-text-muted)",
              }}
            >
              {contact.company}
            </p>

            <p
              className="mt-2 text-xs"
              style={{
                color: "var(--color-text-body)",
              }}
            >
              {contact.phone}
            </p>
          </div>

          {/* Agent state */}
          <div className="mt-5 text-center">
            {state === "idle" && (
              <>
                <div
                  className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl"
                  style={{
                    background: "var(--color-accent-bg)",
                    color: "var(--color-primary)",
                  }}
                >
                  <Phone size={28} />
                </div>

                <h3
                  className="mt-4 text-base font-semibold"
                  style={{
                    color: "var(--color-text-heading)",
                  }}
                >
                  Ready to call
                </h3>

                <button
                  type="button"
                  onClick={startConversation}
                  className="mt-5 rounded-xl px-6 py-3 text-sm font-medium text-white"
                  style={{
                    background: "var(--color-primary)",
                  }}
                >
                  Start Call
                </button>
              </>
            )}

            {state === "speaking" && (
              <>
                <Volume2
                  size={32}
                  className="mx-auto animate-pulse"
                  style={{
                    color: "var(--color-primary)",
                  }}
                />

                <p
                  className="mt-3 text-sm font-medium"
                  style={{
                    color: "var(--color-text-heading)",
                  }}
                >
                  Agent is speaking...
                </p>
              </>
            )}

            {state === "listening" && (
              <>
                <Mic
                  size={32}
                  className="mx-auto animate-pulse text-red-500"
                />

                <p
                  className="mt-3 text-sm font-medium"
                  style={{
                    color: "var(--color-text-heading)",
                  }}
                >
                  Listening...
                </p>

                {transcript && (
                  <p
                    className="mt-2 text-xs"
                    style={{
                      color: "var(--color-text-muted)",
                    }}
                  >
                    "{transcript}"
                  </p>
                )}
              </>
            )}

            {state === "thinking" && (
              <>
                <Brain
                  size={32}
                  className="mx-auto animate-pulse"
                  style={{
                    color: "var(--color-primary)",
                  }}
                />

                <p
                  className="mt-3 text-sm font-medium"
                  style={{
                    color: "var(--color-text-heading)",
                  }}
                >
                  Agent is reasoning...
                </p>
              </>
            )}

            {state === "completed" && result && (
              <>
                <CheckCircle2
                  size={38}
                  className="mx-auto text-green-500"
                />

                <h3
                  className="mt-3 text-base font-semibold"
                  style={{
                    color: "var(--color-text-heading)",
                  }}
                >
                  Conversation Complete
                </h3>

                <p
                  className="mt-2 text-sm capitalize"
                  style={{
                    color: "var(--color-text-muted)",
                  }}
                >
                  Result: {result.replaceAll("_", " ")}
                </p>
              </>
            )}
          </div>

          {/* Conversation */}
          {messages.length > 0 && (
            <div className="mt-5 max-h-56 space-y-2 overflow-y-auto">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className="rounded-xl p-3 text-xs"
                  style={{
                    background:
                      message.role === "agent"
                        ? "var(--color-accent-bg)"
                        : "var(--color-bg)",
                  }}
                >
                  <p
                    className="mb-1 text-[10px] font-semibold uppercase"
                    style={{
                      color:
                        message.role === "system"
                          ? "var(--color-primary)"
                          : "var(--color-text-faint)",
                    }}
                  >
                    {message.role}
                  </p>

                  <p
                    style={{
                      color: "var(--color-text-body)",
                    }}
                  >
                    {message.text}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Stop */}
          {state !== "completed" && state !== "idle" && (
            <button
              type="button"
              onClick={() => {
                window.speechSynthesis.cancel();
                recognitionRef.current?.stop();
                onClose();
              }}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 py-3 text-sm font-medium text-red-500"
            >
              <Square size={14} />
              End Call
            </button>
          )}
        </div>
      </div>
    </div>
  );
}