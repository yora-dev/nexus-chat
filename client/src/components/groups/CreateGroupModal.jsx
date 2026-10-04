import React, { useEffect, useMemo, useState } from "react";
import { X, Search, Image as ImageIcon, Users } from "lucide-react";
import API from "../../utils/axios";
import { useChatStore } from "../../store/useChatStore";

export const CreateGroupModal = ({ isOpen, onClose }) => {
  const { setActiveConversation, fetchConversations } = useChatStore();
  const [groupName, setGroupName] = useState("");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [groupImage, setGroupImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setGroupName("");
      setQuery("");
      setResults([]);
      setSelectedMembers([]);
      setGroupImage(null);
      setSubmitting(false);
      setSearching(false);
      setError("");
    }
  }, [isOpen]);

  useEffect(() => {
    let active = true;

    const runSearch = async () => {
      if (!isOpen || query.trim().length === 0) {
        setResults([]);
        return;
      }

      setSearching(true);
      try {
        const res = await API.get(
          `/users/search?q=${encodeURIComponent(query.trim())}`,
        );
        if (active) {
          setResults(res.data?.data?.users || []);
        }
      } catch (err) {
        if (active) {
          setResults([]);
        }
      } finally {
        if (active) {
          setSearching(false);
        }
      }
    };

    const timer = setTimeout(runSearch, 250);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [isOpen, query]);

  const selectedIds = useMemo(
    () => new Set(selectedMembers.map((member) => member._id)),
    [selectedMembers],
  );

  const addMember = (user) => {
    setSelectedMembers((current) => {
      if (current.some((member) => member._id === user._id)) {
        return current;
      }
      return [...current, user];
    });
    setQuery("");
    setResults([]);
  };

  const removeMember = (userId) => {
    setSelectedMembers((current) =>
      current.filter((member) => member._id !== userId),
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!groupName.trim()) {
      setError("Group name is required.");
      return;
    }

    if (selectedMembers.length === 0) {
      setError("Add at least one member to create the group.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("name", groupName.trim());
      formData.append(
        "participantIds",
        JSON.stringify(selectedMembers.map((member) => member._id)),
      );
      if (groupImage) {
        formData.append("groupImage", groupImage);
      }

      const res = await API.post("/conversations/group", formData);

      const conversation = res.data?.data?.conversation;
      if (conversation) {
        await fetchConversations();
        setActiveConversation(conversation);
      }

      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create group.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl shadow-black/40">
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-100">
              Create group chat
            </h2>
            <p className="text-sm text-slate-400">
              Pick a name, add members, and optionally upload a group image.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6">
          {error ? (
            <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
              {error}
            </div>
          ) : null}

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-400">
              Group name
            </label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Design Team"
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-400">
              Group image
            </label>
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-slate-700 bg-slate-950 px-4 py-4 text-sm text-slate-400 transition hover:border-indigo-500/60 hover:text-slate-200">
              <ImageIcon className="h-5 w-5 text-indigo-400" />
              <span>
                {groupImage ? groupImage.name : "Upload a group image"}
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setGroupImage(e.target.files?.[0] || null)}
              />
            </label>
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-400">
              Members
            </label>
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
              <div className="relative mb-4">
                <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search users to add"
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2.5 pl-9 pr-4 text-sm text-slate-100 outline-none transition focus:border-indigo-500"
                />
              </div>

              {selectedMembers.length > 0 ? (
                <div className="mb-4 flex flex-wrap gap-2">
                  {selectedMembers.map((member) => (
                    <button
                      key={member._id}
                      type="button"
                      onClick={() => removeMember(member._id)}
                      className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 text-xs text-indigo-200 transition hover:bg-indigo-500/20"
                    >
                      {member.name}
                      <X className="h-3.5 w-3.5" />
                    </button>
                  ))}
                </div>
              ) : null}

              <div className="max-h-60 space-y-2 overflow-y-auto pr-1">
                {searching ? (
                  <p className="px-1 py-2 text-sm text-slate-500">
                    Searching users...
                  </p>
                ) : results.length > 0 ? (
                  results.map((user) => {
                    const alreadySelected = selectedIds.has(user._id);

                    return (
                      <button
                        key={user._id}
                        type="button"
                        onClick={() => addMember(user)}
                        disabled={alreadySelected}
                        className={`flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition ${
                          alreadySelected
                            ? "cursor-not-allowed border-slate-800 bg-slate-900 opacity-50"
                            : "border-slate-800 bg-slate-900 hover:border-indigo-500/50 hover:bg-slate-800"
                        }`}
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-sm font-semibold text-slate-200">
                          {user.name?.[0] || user.username?.[0] || "?"}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-slate-100">
                            {user.name}
                          </p>
                          <p className="truncate text-xs text-slate-400">
                            @{user.username}
                          </p>
                        </div>
                        <span className="text-xs text-slate-500">
                          {alreadySelected ? "Added" : "Add"}
                        </span>
                      </button>
                    );
                  })
                ) : (
                  <div className="rounded-xl border border-dashed border-slate-800 px-4 py-8 text-center text-sm text-slate-500">
                    <Users className="mx-auto mb-2 h-5 w-5 text-slate-600" />
                    Search for users to add them to the group.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-800 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Creating..." : "Create group"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
