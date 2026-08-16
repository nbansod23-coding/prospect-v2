import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import ChatPage from "@/pages/ChatPage";
import ChatHistoryPage from "@/pages/ChatHistoryPage";
import ListsPage from "@/pages/ListsPage";
import ExtensionsPage from "@/pages/ExtensionsPage";
import PromptsPage from "@/pages/PromptsPage";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/chat-history" element={<ChatHistoryPage />} />
        <Route path="/lists" element={<ListsPage />} />
        <Route path="/extensions" element={<ExtensionsPage />} />
        <Route path="/prompts" element={<PromptsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      
    </BrowserRouter>
  );
}
