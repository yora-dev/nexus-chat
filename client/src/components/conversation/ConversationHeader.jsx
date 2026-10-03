import React from 'react';
import { Avatar } from '../common/Avatar';
import { Phone, Video, MoreVertical, Pin } from 'lucide-react';

export const ConversationHeader = ({ conversation, onPinToggle }) => {
  if (!conversation) return null;

  const title = conversation.isGroup
    ? conversation.groupName
    : conversation.participant?.name || 'Direct Chat';

  const isOnline = conversation.participant?.isOnline;

  return (
    <div className="bg-slate-900/50 backdrop-blur-md border-b border-slate-800 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Avatar
          name={title}
          src={conversation.isGroup ? conversation.groupImage : conversation.participant?.avatar}
          isOnline={!conversation.isGroup && isOnline}
        />
        <div>
          <h2 className="font-semibold text-slate-100 text-sm leading-none">{title}</h2>
          <span className="text-xs text-slate-400">
            {conversation.isGroup
              ? `${conversation.members?.length || 0} members`
              : isOnline
              ? 'Online'
              : 'Offline'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 text-slate-400">
        <button
          onClick={onPinToggle}
          className={`p-2 hover:bg-slate-800 rounded-lg transition-colors ${
            conversation.isPinned ? 'text-indigo-400' : ''
          }`}
        >
          <Pin className="h-4 w-4" />
        </button>
        <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors hover:text-slate-200">
          <Phone className="h-4 w-4" />
        </button>
        <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors hover:text-slate-200">
          <Video className="h-4 w-4" />
        </button>
        <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors hover:text-slate-200">
          <MoreVertical className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};