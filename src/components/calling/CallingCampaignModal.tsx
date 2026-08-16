import { useRef, useState } from "react";

import {
  Bot,
  CalendarDays,
  CheckCircle2,
  Loader2,
  Phone,
  Play,
  Sparkles,
  Users,
  X,
} from "lucide-react";

import { simulateAICall } from "@/ai/callSimulator";
import { loadLocalModel } from "@/ai/llmEngine";
import { useCampaignStore } from "@/store/campaignStore";
import { useListStore } from "@/store/listStore";
import type { Contact } from "@/types/contact";

const AGENTS = [
  {
    id: "a1",
    name: "Lead Qualifier",
    desc: "Calls prospects, asks discovery questions, and identifies genuine interest",
    avatar: "LQ",
    color: "#6687dc",
  },
  {
    id: "a2",
    name: "Sales Representative",
    desc: "Presents your product, answers basic questions, and books demos",
    avatar: "SR",
    color: "#5b8def",
  },
  {
    id: "a3",
    name: "Lead Nurturer",
    desc: "Follows up with interested prospects and keeps conversations warm",
    avatar: "LN",
    color: "#7c6fe0",
  },
  {
    id: "a4",
    name: "Deal Closer",
    desc: "Handles objections, confirms buying intent, and moves prospects toward conversion",
    avatar: "DC",
    color: "#4da8a0",
  },
];

type CampaignState =
  | "select"
  | "configure"
  | "loading"
  | "running"
  | "scheduled"
  | "cancelled";

interface CallingCampaignModalProps {
  listId: number;
  listName: string;
  contacts: Contact[];
  onClose: () => void;
  onComplete: () => void;
}

export default function CallingCampaignModal({
  listId,
  listName,
  contacts,
  onClose,
  onComplete,
}: CallingCampaignModalProps) {
  const startCampaign = useCampaignStore(
    (state) => state.startCampaign,
  );
  const setLeadResult = useCampaignStore(
    (state) => state.setLeadResult,
  );
  const setCurrentLead = useCampaignStore(
    (state) => state.setCurrentLead,
  );
  const setCampaignStatus = useCampaignStore(
    (state) => state.setCampaignStatus,
  );

  const updateList = useListStore(
    (state) => state.updateList,
  );

  const [step, setStep] = useState<CampaignState>(
    "select",
  );

  const [agentId, setAgentId] = useState<string | null>(
    null,
  );

  const [scheduledTime, setScheduledTime] = useState("");
  const [aiProgress, setAiProgress] = useState(0);
  const [callProgress, setCallProgress] = useState(0);
  const [currentContact, setCurrentContact] =
    useState<Contact | null>(null);
  const [error, setError] = useState("");

  const stopRequested = useRef(false);

  const agent = AGENTS.find(
    (item) => item.id === agentId,
  );

  const isBusy =
    step === "loading" ||
    step === "running";

  const progress =
    contacts.length > 0
      ? Math.round(
          (callProgress / contacts.length) *
            100,
        )
      : 0;

  function closeIfAllowed() {
    if (isBusy) return;
    onClose();
  }

  function chooseAgent(id: string) {
    if (isBusy) return;

    setAgentId(id);
    setStep("configure");
    setError("");
  }

  async function initializeAndCall() {
    if (!agent) {
      setError("Please select an AI calling agent.");
      return;
    }

    if (contacts.length === 0) {
      setError("No contacts are available for this campaign.");
      return;
    }

    stopRequested.current = false;
    setError("");
    setAiProgress(0);
    setCallProgress(0);
    setCurrentContact(null);
    setStep("loading");

    try {
      await loadLocalModel(
        (progressValue) => {
          if (!stopRequested.current) {
            setAiProgress(progressValue);
          }
        },
      );

      if (stopRequested.current) {
        setCampaignStatus("cancelled");
        setStep("cancelled");
        return;
      }

      startCampaign(
        listId,
        agent.id,
        agent.name,
        contacts,
      );

      updateList(listId, {
        status: "ready",
      });

      setStep("running");

      for (let i = 0; i < contacts.length; i += 1) {
        if (stopRequested.current) {
          setCampaignStatus("cancelled");
          setCurrentContact(null);
          setStep("cancelled");
          return;
        }

        const contact = contacts[i];

        setCurrentLead(i);
        setCurrentContact(contact);

        console.log(
          `🤖 Calling ${contact.name} at ${contact.phone}`,
        );

        const result = await simulateAICall();

        if (stopRequested.current) {
          setCampaignStatus("cancelled");
          setCurrentContact(null);
          setStep("cancelled");
          return;
        }

        setLeadResult(contact.id, result);
        setCallProgress(i + 1);

        console.log(
          `📞 ${contact.name} → ${result}`,
        );
      }

      setCampaignStatus("completed");
      setCurrentLead(contacts.length);
      setCurrentContact(null);

      console.log("✅ Campaign completed");

      /*
       * The parent closes this popup immediately after
       * the last call and displays the success message.
       */
      onComplete();
    } catch (callError) {
      console.error(
        "Calling process failed:",
        callError,
      );

      setError(
        "The calling process failed. Please try again.",
      );
      setCurrentContact(null);
      setStep("configure");
    }
  }

  function stopCalling() {
    stopRequested.current = true;

    setCampaignStatus("cancelled");
    setCurrentContact(null);
    setStep("cancelled");
  }

  function scheduleCampaign() {
    if (!scheduledTime) {
      setError("Please select a date and time.");
      return;
    }

    setError("");
    setStep("scheduled");
  }

  function startNewCampaign() {
    setAgentId(null);
    setScheduledTime("");
    setAiProgress(0);
    setCallProgress(0);
    setCurrentContact(null);
    setError("");
    stopRequested.current = false;
    setStep("select");
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/55 backdrop-blur-md"
        onClick={closeIfAllowed}
      />

      {/* Popup */}
      <div
        className="relative z-10 w-full max-w-xl overflow-hidden rounded-3xl border bg-white shadow-[0_25px_80px_rgba(15,23,42,0.28)]"
        style={{
          borderColor: "var(--color-border)",
        }}
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        {/* Header */}
        <div
          className="relative overflow-hidden border-b px-6 py-5"
          style={{
            borderColor: "var(--color-border-light)",
            background:
              "linear-gradient(135deg, var(--color-accent-bg), var(--color-surface))",
          }}
        >
          <div
            className="absolute -right-12 -top-16 h-36 w-36 rounded-full opacity-30 blur-3xl"
            style={{
              background: "var(--color-primary)",
            }}
          />

          <div className="relative flex items-center justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-white shadow-sm"
                style={{
                  background:
                    "var(--color-primary)",
                }}
              >
                {step === "running" ? (
                  <Phone
                    size={20}
                    className="animate-pulse"
                  />
                ) : (
                  <Sparkles size={20} />
                )}
              </div>

              <div className="min-w-0">
                <h2
                  className="truncate text-base font-semibold"
                  style={{
                    color:
                      "var(--color-text-heading)",
                  }}
                >
                  Start Campaign
                </h2>

                <p
                  className="mt-0.5 truncate text-xs"
                  style={{
                    color:
                      "var(--color-text-muted)",
                  }}
                >
                  {listName} · {contacts.length} contacts
                </p>
              </div>
            </div>

            <button
              type="button"
              disabled={isBusy}
              onClick={closeIfAllowed}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition hover:bg-white/80 disabled:cursor-not-allowed disabled:opacity-35"
              style={{
                color:
                  "var(--color-text-faint)",
              }}
              aria-label="Close campaign"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="max-h-[72vh] overflow-y-auto p-6">
          {/* Agent selection */}
          {step === "select" && (
            <div>
              <div className="mb-5 flex items-center gap-2">
                <Bot
                  size={17}
                  style={{
                    color:
                      "var(--color-primary)",
                  }}
                />
                <p
                  className="text-sm font-semibold"
                  style={{
                    color:
                      "var(--color-text-heading)",
                  }}
                >
                  Choose your calling agent
                </p>
              </div>

              <div className="space-y-2.5">
                {AGENTS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      chooseAgent(item.id)
                    }
                    className="group flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition duration-200 hover:-translate-y-0.5 hover:border-[#b8ccee] hover:bg-[#f4f7ff] hover:shadow-sm"
                    style={{
                      borderColor:
                        "var(--color-border)",
                      background:
                        "var(--color-bg)",
                    }}
                  >
                    <div
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xs font-bold text-white shadow-sm"
                      style={{
                        background: item.color,
                      }}
                    >
                      {item.avatar}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p
                        className="text-sm font-semibold"
                        style={{
                          color:
                            "var(--color-text-heading)",
                        }}
                      >
                        {item.name}
                      </p>

                      <p
                        className="mt-1 text-xs leading-5"
                        style={{
                          color:
                            "var(--color-text-muted)",
                        }}
                      >
                        {item.desc}
                      </p>
                    </div>

                    <Play
                      size={15}
                      className="shrink-0 transition group-hover:translate-x-0.5"
                      style={{
                        color:
                          "var(--color-text-faint)",
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Configure */}
          {step === "configure" && (
            <div>
              {agent && (
                <div
                  className="mb-5 flex items-center gap-3 rounded-2xl border p-4"
                  style={{
                    borderColor:
                      "var(--color-border-light)",
                    background:
                      "var(--color-bg)",
                  }}
                >
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xs font-bold text-white"
                    style={{
                      background: agent.color,
                    }}
                  >
                    {agent.avatar}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p
                      className="text-sm font-semibold"
                      style={{
                        color:
                          "var(--color-text-heading)",
                      }}
                    >
                      {agent.name}
                    </p>

                    <p
                      className="mt-1 text-xs"
                      style={{
                        color:
                          "var(--color-text-muted)",
                      }}
                    >
                      {agent.desc}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setStep("select")
                    }
                    className="shrink-0 text-xs font-medium transition hover:underline"
                    style={{
                      color:
                        "var(--color-primary)",
                    }}
                  >
                    Change
                  </button>
                </div>
              )}

              <div className="mb-4 flex items-center justify-between">
                <p
                  className="text-sm font-semibold"
                  style={{
                    color:
                      "var(--color-text-body)",
                  }}
                >
                  How do you want to trigger calls?
                </p>

                <span
                  className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium"
                  style={{
                    background:
                      "var(--color-accent-bg)",
                    color:
                      "var(--color-primary)",
                  }}
                >
                  <Users size={12} />
                  {contacts.length} leads
                </span>
              </div>

              <div className="space-y-3">
                {/* Immediate calling */}
                <button
                  type="button"
                  onClick={initializeAndCall}
                  className="group flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 hover:border-[#9db7ed] hover:bg-[#f4f7ff] hover:shadow-sm"
                  style={{
                    borderColor:
                      "var(--color-border)",
                    background:
                      "var(--color-bg)",
                  }}
                >
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                    style={{
                      background:
                        "var(--color-accent-bg)",
                      color:
                        "var(--color-primary)",
                    }}
                  >
                    <Play size={18} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p
                      className="text-sm font-semibold"
                      style={{
                        color:
                          "var(--color-text-heading)",
                      }}
                    >
                      Trigger Immediately
                    </p>

                    <p
                      className="mt-1 text-xs"
                      style={{
                        color:
                          "var(--color-text-muted)",
                      }}
                    >
                      Start calling all selected contacts right now.
                    </p>
                  </div>

                  <span
                    className="text-xs font-medium"
                    style={{
                      color:
                        "var(--color-primary)",
                    }}
                  >
                    Start
                  </span>
                </button>

                {/* Schedule */}
                <div
                  className="rounded-2xl border p-4"
                  style={{
                    borderColor:
                      "var(--color-border)",
                    background:
                      "var(--color-bg)",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                      style={{
                        background:
                          "var(--color-accent-bg)",
                        color:
                          "var(--color-primary)",
                      }}
                    >
                      <CalendarDays size={18} />
                    </div>

                    <div>
                      <p
                        className="text-sm font-semibold"
                        style={{
                          color:
                            "var(--color-text-heading)",
                        }}
                      >
                        Schedule Calls
                      </p>

                      <p
                        className="mt-1 text-xs"
                        style={{
                          color:
                            "var(--color-text-muted)",
                        }}
                      >
                        Pick a date and time.
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex gap-2">
                    <input
                      type="datetime-local"
                      value={scheduledTime}
                      onChange={(event) =>
                        setScheduledTime(
                          event.target.value,
                        )
                      }
                      className="min-w-0 flex-1 rounded-xl border bg-white px-3 py-2.5 text-sm outline-none"
                      style={{
                        borderColor:
                          "var(--color-border)",
                        color:
                          "var(--color-text-body)",
                      }}
                    />

                    <button
                      type="button"
                      disabled={!scheduledTime}
                      onClick={scheduleCampaign}
                      className="rounded-xl px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                      style={{
                        background:
                          "var(--color-primary)",
                      }}
                    >
                      Schedule
                    </button>
                  </div>
                </div>
              </div>

              {error && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-600">
                  {error}
                </div>
              )}
            </div>
          )}

          {/* AI loading */}
          {step === "loading" && (
            <div>
              <div className="mb-5 flex items-center gap-3 rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                  <Loader2
                    size={20}
                    className="animate-spin"
                  />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Preparing AI calling agent
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {Math.round(aiProgress)}% initialized
                  </p>
                </div>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${aiProgress}%`,
                    background:
                      "var(--color-primary)",
                  }}
                />
              </div>

              <p className="mt-3 text-center text-xs text-slate-500">
                Please wait. Calling controls will appear when the model is ready.
              </p>

              <button
                type="button"
                onClick={stopCalling}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 py-3 text-sm font-medium text-red-500 transition hover:bg-red-100"
              >
                <X size={15} />
                Stop Calling
              </button>
            </div>
          )}

          {/* Running */}
          {step === "running" && (
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                    <p
                      className="text-sm font-semibold"
                      style={{
                        color:
                          "var(--color-text-heading)",
                      }}
                    >
                      Calling in progress
                    </p>
                  </div>

                  <p
                    className="mt-1 text-xs"
                    style={{
                      color:
                        "var(--color-text-muted)",
                    }}
                  >
                    {callProgress} of {contacts.length} calls completed
                  </p>
                </div>

                <span
                  className="text-lg font-bold"
                  style={{
                    color:
                      "var(--color-primary)",
                  }}
                >
                  {progress}%
                </span>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${progress}%`,
                    background:
                      "var(--color-primary)",
                  }}
                />
              </div>

              {currentContact ? (
                <div
                  className="mt-5 rounded-2xl border p-5"
                  style={{
                    borderColor:
                      "var(--color-border-light)",
                    background:
                      "var(--color-accent-bg)",
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm"
                      style={{
                        color:
                          "var(--color-primary)",
                      }}
                    >
                      <Phone
                        size={20}
                        className="animate-pulse"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p
                        className="text-sm font-semibold"
                        style={{
                          color:
                            "var(--color-text-heading)",
                        }}
                      >
                        Calling {currentContact.name}
                      </p>

                      <p
                        className="mt-1 truncate text-xs"
                        style={{
                          color:
                            "var(--color-text-muted)",
                        }}
                      >
                        {currentContact.company} · {currentContact.phone}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-5 rounded-2xl bg-slate-50 p-5 text-center text-xs text-slate-500">
                  Preparing the next call…
                </div>
              )}

              <button
                type="button"
                onClick={stopCalling}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 py-3 text-sm font-semibold text-red-500 transition hover:bg-red-100"
              >
                <X size={16} />
                Stop Calling
              </button>
            </div>
          )}

          {/* Scheduled */}
          {step === "scheduled" && (
            <div className="py-3 text-center">
              <div
                className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl"
                style={{
                  background:
                    "var(--color-accent-bg)",
                  color:
                    "var(--color-primary)",
                }}
              >
                <CalendarDays size={30} />
              </div>

              <h3
                className="mt-4 text-base font-semibold"
                style={{
                  color:
                    "var(--color-text-heading)",
                }}
              >
                Campaign Scheduled
              </h3>

              <p
                className="mt-2 text-sm"
                style={{
                  color:
                    "var(--color-text-muted)",
                }}
              >
                {agent?.name} will start at{" "}
                <span className="font-medium">
                  {new Date(
                    scheduledTime,
                  ).toLocaleString()}
                </span>
                .
              </p>

              <button
                type="button"
                onClick={() => setStep("cancelled")}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 py-3 text-sm font-medium text-red-500 transition hover:bg-red-100"
              >
                <X size={15} />
                Cancel Schedule
              </button>
            </div>
          )}

          {/* Cancelled */}
          {step === "cancelled" && (
            <div className="py-3 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <X size={29} />
              </div>

              <h3
                className="mt-4 text-base font-semibold"
                style={{
                  color:
                    "var(--color-text-heading)",
                }}
              >
                Calling Stopped
              </h3>

              <p
                className="mt-2 text-sm"
                style={{
                  color:
                    "var(--color-text-muted)",
                }}
              >
                The calling process has been stopped safely.
              </p>

              <button
                type="button"
                onClick={startNewCampaign}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-medium text-white transition hover:opacity-90"
                style={{
                  background:
                    "var(--color-primary)",
                }}
              >
                <Play size={15} />
                Start New Campaign
              </button>

              <button
                type="button"
                onClick={onClose}
                className="mt-2 w-full rounded-xl py-2.5 text-xs font-medium"
                style={{
                  color:
                    "var(--color-text-muted)",
                }}
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}