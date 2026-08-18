import { Sparkles, Mail, Phone, X } from "lucide-react";

import type { MockList } from "@/data/mockList";
import type { Contact } from "@/types/contact";

export function SelectedDetail({
  list,
  contacts,
  selectedContacts,
  onSelectContact,
  onStartCampaign,
  onClose,
}: {
  list: MockList;
  contacts: Contact[];
  selectedContacts: number[];
  onSelectContact: (contactId: number) => void;
  onStartCampaign: () => void;
  onClose: () => void;
}) {
  return (
    <div
      className="mt-8 overflow-hidden rounded-2xl shadow-sm"
      style={{
        border: "1px solid var(--color-border)",
        background: "var(--color-surface)",
      }}
    >
      {/* HEADER */}

      <div
        className="flex items-center justify-between border-b p-5"
        style={{
          borderColor: "var(--color-border-light)",
        }}
      >
        <div>
          <h2
            className="text-lg font-semibold"
            style={{
              color: "var(--color-text-heading)",
            }}
          >
            {list.name}
          </h2>

          <p
            className="text-sm"
            style={{
              color: "var(--color-text-muted)",
            }}
          >
            {contacts.length} contacts · {list.source}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={contacts.length === 0}
            onClick={onStartCampaign}
            className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            style={{
              background: "var(--color-primary-deep)",
            }}
          >
            <Sparkles size={16} />
            Add Agent
          </button>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg transition hover:bg-[#f0f4f8]"
            style={{
              color: "var(--color-text-faint)",
            }}
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* STATS */}

      <div className="grid grid-cols-2 gap-4 p-5 sm:grid-cols-5">
        {[
          {
            label: "Called",
            value: list.called,
            // value: contacts.filter((contact) =>
            //   [
            //     "interested",
            //     "not_interested",
            //     "call_back",
            //     "no_answer",
            //   ].includes(contact.status),
            // ).length,
            color: "#22c55e",
          },
          {
            label: "Interested",
            value: list.interested,
            // value: contacts.filter(
            //   (contact) => contact.status === "not_interested",
            // ).length,
            color: "#ef4444",
          },
          {
            label: "Not Interested",
            value: list.notInterested,
            // value: contacts.filter((contact) => contact.status === "call_back")
            //   .length,
            color: "#f59e0b",
          },
          {
            label: "Call Back",
            value: list.callBack,
            // value: contacts.filter((contact) => contact.status === "no_answer")
            //   .length,
            color: "var(--color-text-faint)",
          },
          {
            label: "Not Answered",
            value: list.noAnswer,
            // value: contacts.filter((contact) => contact.status === "not_called")
            //   .length,
            color: "var(--color-text-muted)",
          },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className="rounded-xl p-4 text-center"
            style={{
              background: "var(--color-bg)",
            }}
          >
            <p className="text-2xl font-bold" style={{ color }}>
              {value}
            </p>

            <p
              className="mt-1 text-xs"
              style={{
                color: "var(--color-text-faint)",
              }}
            >
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* CONTACTS */}

      <div
        className="border-t"
        style={{
          borderColor: "var(--color-border-light)",
        }}
      >
        {/* CONTACT HEADER */}

        <div className="flex items-center justify-between px-5 py-4">
          <div>
            <h3
              className="text-base font-semibold"
              style={{
                color: "var(--color-text-heading)",
              }}
            >
              Contacts
            </h3>

            <p
              className="text-sm"
              style={{
                color: "var(--color-text-muted)",
              }}
            >
              {selectedContacts.length} selected
            </p>
          </div>

          <span
            className="text-sm"
            style={{
              color: "var(--color-text-muted)",
            }}
          >
            {contacts.length} total
          </span>
        </div>

        {/* CONTACT LIST */}

        <div>
          {contacts.map((contact, index) => {
            const isSelected = selectedContacts.includes(contact.id);

            return (
              <div
                key={contact.id}
                className="flex items-center gap-4 border-t px-5 py-4 transition"
                style={{
                  borderColor: "var(--color-border-light)",
                  background: isSelected
                    ? "var(--color-bg)"
                    : "var(--color-surface)",
                }}
              >
                {/* CHECKBOX */}

                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onSelectContact(contact.id)}
                  className="h-5 w-5 cursor-pointer accent-blue-600"
                />

                {/* AVATAR */}

                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold"
                  style={{
                    background: "#edf3ff",
                    color: "var(--color-primary)",
                  }}
                >
                  {contact.name
                    .split(" ")
                    .map((part) => part[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase()}
                </div>

                {/* PERSON INFORMATION */}

                <div className="min-w-0 flex-1">
                  {/* NAME + DESIGNATION */}

                  <div>
                    <p
                      className="text-sm font-semibold"
                      style={{
                        color: "var(--color-text-heading)",
                      }}
                    >
                      {contact.name}
                    </p>

                    <p
                      className="text-sm"
                      style={{
                        color: "var(--color-text-muted)",
                      }}
                    >
                      {contact.designation}
                    </p>
                  </div>

                  {/* COMPANY */}

                  <p
                    className="mt-1 text-xs"
                    style={{
                      color: "var(--color-text-faint)",
                    }}
                  >
                    {contact.company}
                  </p>
                </div>

                {/* PHONE + EMAIL */}

                <div className="hidden min-w-[280px] flex-col items-start gap-1 lg:flex">
                  <div
                    className="flex items-center gap-2 text-sm"
                    style={{
                      color: "var(--color-text-body)",
                    }}
                  >
                    <Phone size={14} />

                    <span>{contact.phone}</span>
                  </div>

                  <div
                    className="flex max-w-[280px] items-center gap-2 text-sm"
                    style={{
                      color: "var(--color-text-muted)",
                    }}
                  >
                    <Mail size={14} />

                    <span className="truncate">{contact.email}</span>
                  </div>
                </div>
                {/* CALL STATUS */}

                <div className="hidden min-w-[90px] text-right sm:block">
                  <span
                    className="text-xs"
                    style={{
                      color: "var(--color-text-faint)",
                    }}
                  >
                    {contact.callFeedback}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
