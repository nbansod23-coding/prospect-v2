import type { MockAIResult } from "./mockAI";

export type StoredMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: number;
};

export type StoredChat = {
  id: string;
  title: string;
  messages: StoredMessage[];
  result: MockAIResult | null;
  createdAt: number;
  updatedAt: number;
};

const STORAGE_KEY = "prospectai_chats";

export function getChats(): StoredChat[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored) as StoredChat[];
  } catch {
    return [];
  }
}

export function saveChats(chats: StoredChat[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
}

export function createChat(title: string): StoredChat {
  const now = Date.now();
  return {
    id: crypto.randomUUID(),
    title,
    messages: [],
    result: null,
    createdAt: now,
    updatedAt: now,
  };
}

export function saveChat(chat: StoredChat): void {
  const chats = getChats();
  const idx = chats.findIndex((c) => c.id === chat.id);
  if (idx >= 0) {
    chats[idx] = chat;
  } else {
    chats.unshift(chat);
  }
  chats.sort((a, b) => b.updatedAt - a.updatedAt);
  saveChats(chats);
}

export function getChat(id: string): StoredChat | null {
  return getChats().find((c) => c.id === id) ?? null;
}

export function deleteChat(id: string): void {
  saveChats(getChats().filter((c) => c.id !== id));
}
