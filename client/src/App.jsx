import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import { useSocketStore } from "./store/useSocketStore";
import { Login } from "./pages/auth/Login";
import { Register } from "./pages/auth/Register";
import { Sidebar } from "./components/chat/Sidebar";
import { ChatArea } from "./components/chat/ChatArea";
import { CreateGroupModal } from "./components/groups/CreateGroupModal";

const ProtectedLayout = () => {
  const { isAuthenticated, token } = useAuthStore();
  const { connectSocket, disconnectSocket } = useSocketStore();
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated && token) {
      connectSocket(token);
    }
    return () => disconnectSocket();
  }, [isAuthenticated, token, connectSocket, disconnectSocket]);

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100">
      <Sidebar onOpenGroupModal={() => setIsGroupModalOpen(true)} />
      <ChatArea />
      <CreateGroupModal
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/*" element={<ProtectedLayout />} />
      </Routes>
    </BrowserRouter>
  );
}
