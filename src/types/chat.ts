export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string; // ISO string (used by chatStore/zustand)
};

export type Chat = {
  id: string;
  title: string;
  preview: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
};
