import React from 'react';

export const Avatar = ({ name = 'User', src = '', isOnline = false, size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-14 w-14 text-base'
  };

  return (
    <div className="relative inline-block">
      {src ? (
        <img
          src={src}
          alt={name}
          className={`${sizeClasses[size]} rounded-full object-cover border border-slate-700`}
        />
      ) : (
        <div
          className={`${sizeClasses[size]} rounded-full bg-indigo-600 border border-indigo-500 flex items-center justify-center font-bold text-white uppercase`}
        >
          {name?.[0] || 'U'}
        </div>
      )}
      {isOnline && (
        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
      )}
    </div>
  );
};