import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Chat, ChatMessage } from "@/types/chat";

type ChatStore = {
  chats: Chat[];
  createChat: (message: string) => string;
  addMessage: (chatId: string, message: ChatMessage) => void;
  getChat: (chatId: string) => Chat | undefined;
  deleteChat: (chatId: string) => void;
  clearChats: () => void;
};

function makeTitle(message: string): string {
  const s = message.trim();
  if (!s) return "New Chat";
  return s.length > 45 ? `${s.slice(0, 45)}…` : s;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      chats: [],

      createChat: (message) => {
        const now = new Date().toISOString();
        const chat: Chat = {
          id: crypto.randomUUID(),
          title: makeTitle(message),
          preview: message.length > 80 ? `${message.slice(0, 80)}…` : message,
          createdAt: now,
          updatedAt: now,
          messages: [{ id: crypto.randomUUID(), role: "user", content: message, createdAt: now }],
        };
        set((s) => ({ chats: [chat, ...s.chats] }));
        return chat.id;
      },

      addMessage: (chatId, message) => {
        set((s) => ({
          chats: s.chats.map((c) =>
            c.id !== chatId
              ? c
              : {
                  ...c,
                  preview:
                    message.content.length > 80
                      ? `${message.content.slice(0, 80)}…`
                      : message.content,
                  updatedAt: message.createdAt,
                  messages: [...c.messages, message],
                },
          ),
        }));
      },

      getChat: (chatId) => get().chats.find((c) => c.id === chatId),

      deleteChat: (chatId) =>
        set((s) => ({ chats: s.chats.filter((c) => c.id !== chatId) })),

      clearChats: () => set({ chats: [] }),
    }),
    { name: "lexiflow-chat-history" },
  ),
);
