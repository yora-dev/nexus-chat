import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { X, Camera } from 'lucide-react';
import API from '../../utils/axios';

export const ProfileModal = ({ isOpen, onClose }) => {
  const { user } = useAuthStore();
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [file, setFile] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('bio', bio);
    if (file) formData.append('avatar', file);

    await API.put('/users/profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-xl relative">
        <button onClick={onClose} className="absolute right-4 top-4 text-slate-400 hover:text-white">
          <X className="h-5 w-5" />
        </button>
        <h3 className="text-lg font-bold text-slate-100 mb-4">Edit Profile</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Display Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm text-slate-100"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm text-slate-100 h-24"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Avatar Image</label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-600 file:text-white hover:file:bg-indigo-500"
            />
          </div>
          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 rounded-lg">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};