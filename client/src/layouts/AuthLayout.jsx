import React from 'react';

export const AuthLayout = ({ children }) => {
  return (
    <div className="h-screen w-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
        {children}
      </div>
    </div>
  );
};