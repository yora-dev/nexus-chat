import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen w-screen items-center justify-center bg-slate-950 text-slate-100">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-8 shadow-2xl backdrop-blur-md text-center max-w-md">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white mb-4 text-xl shadow-lg shadow-indigo-500/30">
            N
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-2">NexusChat Platform</h1>
          <p className="text-sm text-slate-400 mb-6">
            Real-Time Messaging Engine Core Initialized & Ready.
          </p>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 border border-emerald-500/20">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Backend & Frontend Synced
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}