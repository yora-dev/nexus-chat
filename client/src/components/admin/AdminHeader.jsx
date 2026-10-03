import React from 'react';
import { Shield, Users, AlertTriangle, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

export const AdminHeader = ({ activeTab, setActiveTab }) => {
  const { logout } = useAuthStore();

  return (
    <div className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Shield className="h-6 w-6 text-indigo-500" />
        <h1 className="text-xl font-bold text-slate-100">Admin Command Center</h1>
      </div>

      <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'users' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="h-4 w-4" />
          Users Management
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'reports' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <AlertTriangle className="h-4 w-4" />
          Flagged Reports
        </button>
      </div>

      <button
        onClick={logout}
        className="flex items-center gap-2 text-slate-400 hover:text-red-400 text-sm font-medium transition-colors"
      >
        <LogOut className="h-4 w-4" />
        Exit Admin
      </button>
    </div>
  );
};