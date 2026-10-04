import React, { useEffect, useState } from 'react';
import { useChatStore } from '../../store/useChatStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useSocketStore } from '../../store/useSocketStore';
import { Send, Paperclip, MessageSquare } from 'lucide-react';
import API from '../../utils/axios';

export const ChatArea = () => {
  const { activeConversation, messages } = useChatStore();
  const { user } = useAuthStore();
  const socket = useSocketStore((state) => state.socket);
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (!socket || !activeConversation?._id) return;

    const conversationId = activeConversation._id;
    socket.emit('join:conversation', conversationId);

    return () => {
      socket.emit('leave:conversation', conversationId);
    };
  }, [socket, activeConversation?._id]);

  if (!activeConversation) {
    return (
      <div className="flex-1 bg-slate-950 flex flex-col items-center justify-center text-slate-500 p-8">
        <MessageSquare className="h-16 w-16 mb-4 text-slate-700" />
        <h3 className="text-xl font-semibold text-slate-300 mb-1">NexusChat Workspace</h3>
        <p className="text-sm">Select a conversation or start a new chat to begin messaging.</p>
      </div>
    );
  }

  const handleSend = async (e) => {
    e.preventDefault();
    if (!content.trim() && !file) return;

    const formData = new FormData();
    formData.append('conversationId', activeConversation._id);
    formData.append('content', content);
    if (file) formData.append('attachments', file);

    await API.post('/messages', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    setContent('');
    setFile(null);
  };

  return (
    <main className="flex-1 flex flex-col h-full bg-slate-950">
      <header className="p-4 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white">
            {activeConversation.name?.[0] || 'C'}
          </div>
          <div>
            <h3 className="font-semibold text-slate-100 text-sm">
              {activeConversation.type === 'group'
                ? activeConversation.name
                : activeConversation.participants?.find((p) => p._id !== user?.id)?.name}
            </h3>
            <p className="text-xs text-emerald-400">Online</p>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m) => {
          const isMe = m.sender?._id === user?.id || m.sender === user?.id;
          return (
            <div key={m._id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
              <div
                className={`max-w-md px-4 py-2.5 rounded-2xl text-sm ${
                  isMe
                    ? 'bg-indigo-600 text-white rounded-br-none'
                    : 'bg-slate-800 text-slate-100 border border-slate-700/50 rounded-bl-none'
                }`}
              >
                {!isMe && <p className="text-xs font-semibold text-indigo-400 mb-1">{m.sender?.name}</p>}
                <p>{m.content}</p>
                {m.attachments?.map((att, i) => (
                  <div key={i} className="mt-2 text-xs underline">
                    <a href={att.url} target="_blank" rel="noreferrer">
                      Attachment: {att.fileName}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <form onSubmit={handleSend} className="p-4 border-t border-slate-800 bg-slate-900/40 flex items-center gap-2">
        <label className="p-2 text-slate-400 hover:text-white cursor-pointer rounded-lg hover:bg-slate-800">
          <Paperclip className="h-5 w-5" />
          <input
            type="file"
            className="hidden"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </label>
        <input
          type="text"
          placeholder="Type your message..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
        />
        <button
          type="submit"
          className="p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-lg shadow-indigo-600/30 transition"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </main>
  );
};