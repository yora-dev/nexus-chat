import React, { useEffect, useState } from 'react';
import { useChatStore } from '../../store/useChatStore';
import { useAuthStore } from '../../store/useAuthStore';
import { LogOut, MessageSquare, Plus, Search, Shield } from 'lucide-react';
import API from '../../utils/axios';

export const Sidebar = ({ onOpenGroupModal }) => {
  const { conversations, activeConversation, setActiveConversation, fetchConversations } = useChatStore();
  const { user, logout } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const handleSearch = async (e) => {
    const q = e.target.value;
    setSearchQuery(q);
    if (q.trim().length > 0) {
      const res = await API.get(`/users/search?q=${q}`);
      setSearchResults(res.data.data.users);
    } else {
      setSearchResults([]);
    }
  };

  const startDirectChat = async (userId) => {
    const res = await API.post('/conversations/direct', { participantId: userId });
    setActiveConversation(res.data.data.conversation);
    setSearchQuery('');
    setSearchResults([]);
    fetchConversations();
  };

  return (
    <aside className="w-80 border-r border-slate-800 bg-slate-900 flex flex-col h-full">
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white">
            {user?.name?.[0]}
          </div>
          <div>
            <h2 className="font-semibold text-slate-100 text-sm">{user?.name}</h2>
            <p className="text-xs text-slate-400">@{user?.username}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={onOpenGroupModal} className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <Plus className="h-5 w-5" />
          </button>
          <button onClick={logout} className="p-2 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800">
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="p-3">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 space-y-1">
        {searchResults.length > 0 ? (
          searchResults.map((u) => (
            <div
              key={u._id}
              onClick={() => startDirectChat(u._id)}
              className="p-3 rounded-lg hover:bg-slate-800 cursor-pointer flex items-center gap-3"
            >
              <div className="h-9 w-9 rounded-full bg-slate-700 flex items-center justify-center font-bold text-slate-200">
                {u.name[0]}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-200">{u.name}</p>
                <p className="text-xs text-slate-400">@{u.username}</p>
              </div>
            </div>
          ))
        ) : (
          conversations.map((c) => {
            const isSelected = activeConversation?._id === c._id;
            const otherParticipant = c.participants?.find((p) => p._id !== user?.id);
            const title = c.type === 'group' ? c.name : otherParticipant?.name || 'Direct Chat';

            return (
              <div
                key={c._id}
                onClick={() => setActiveConversation(c)}
                className={`p-3 rounded-lg cursor-pointer flex items-center gap-3 transition ${
                  isSelected ? 'bg-indigo-600/20 border border-indigo-500/30' : 'hover:bg-slate-800/60'
                }`}
              >
                <div className="h-10 w-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-indigo-400">
                  {title[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-100 truncate">{title}</p>
                  </div>
                  <p className="text-xs text-slate-400 truncate">
                    {c.lastMessage?.content || 'No messages yet'}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
};