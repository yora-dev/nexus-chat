import React from 'react';
import { Sidebar } from '../components/chat/Sidebar';

export const DashboardLayout = ({ children }) => {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100">
      <Sidebar />
      <main className="flex-1 flex flex-col h-full bg-slate-950">{children}</main>
    </div>
  );
};