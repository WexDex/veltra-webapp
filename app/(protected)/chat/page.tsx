"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Input from "@/components/ui/Input";
import { DbUserWithFriendship } from "@/lib/types";
import { cn } from "@/lib/utils";

function getInitials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

type Tab = "all" | "friends";

export default function PeoplePage() {
  const [users, setUsers] = useState<DbUserWithFriendship[]>([]);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<Tab>("all");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const fetchUsers = useCallback(() => {
    fetch("/api/users")
      .then((r) => r.ok ? r.json() : [])
      .then((data) => { setUsers(data); setLoading(false); });
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const sendRequest = async (friendId: number) => {
    setActionLoading(friendId);
    await fetch("/api/friendships", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ friend_id: friendId }),
    });
    fetchUsers();
    setActionLoading(null);
  };

  const cancelRequest = async (friendshipId: number, userId: number) => {
    setActionLoading(userId);
    await fetch(`/api/friendships/${friendshipId}`, { method: "DELETE" });
    fetchUsers();
    setActionLoading(null);
  };

  const respondRequest = async (friendshipId: number, status: "accepted" | "declined", userId: number) => {
    setActionLoading(userId);
    await fetch(`/api/friendships/${friendshipId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchUsers();
    setActionLoading(null);
  };

  const filtered = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase());
    if (tab === "friends") return matchSearch && u.friendshipStatus === "accepted";
    return matchSearch;
  });

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-100">People</h1>
        <p className="text-gray-400 text-sm mt-1">Manage your connections</p>
      </div>

      <div className="flex items-center gap-1 bg-gray-900 border border-gray-800 rounded-xl p-1 mb-5 w-fit">
        {(["all", "friends"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "px-4 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer capitalize",
              tab === t ? "bg-gray-700 text-gray-100" : "text-gray-400 hover:text-gray-200"
            )}
          >
            {t === "all" ? "All Users" : "Friends"}
          </button>
        ))}
      </div>

      <div className="mb-5">
        <Input
          placeholder="Search people..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden divide-y divide-gray-800">
        {loading ? (
          <p className="text-center text-gray-500 py-12 text-sm">Loading…</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-500 py-12 text-sm">
            {tab === "friends" ? "You have no friends yet." : "No users found."}
          </p>
        ) : (
          filtered.map((user) => {
            const busy = actionLoading === user.id;
            return (
              <div key={user.id} className="flex items-center gap-4 px-5 py-4">
                <Link href={`/chat/${user.id}`} className="flex items-center gap-3 flex-1 min-w-0 hover:opacity-80 transition-opacity">
                  <div className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center text-xs font-semibold text-gray-300 shrink-0">
                    {getInitials(user.name)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-100 truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                </Link>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/chat/${user.id}`}
                    className="p-2 rounded-lg text-gray-400 hover:text-gray-100 hover:bg-gray-800 transition-colors"
                    title="Send message"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                    </svg>
                  </Link>

                  {!user.friendshipStatus && (
                    <button
                      disabled={busy}
                      onClick={() => sendRequest(user.id)}
                      className="px-3 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
                    >
                      Add Friend
                    </button>
                  )}

                  {user.friendshipStatus === "pending" && user.friendshipInitiator && (
                    <button
                      disabled={busy}
                      onClick={() => cancelRequest(user.friendshipId!, user.id)}
                      className="px-3 py-1.5 rounded-lg border border-gray-700 text-gray-400 hover:bg-gray-800 text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  )}

                  {user.friendshipStatus === "pending" && !user.friendshipInitiator && (
                    <>
                      <button
                        disabled={busy}
                        onClick={() => respondRequest(user.friendshipId!, "accepted", user.id)}
                        className="px-3 py-1.5 rounded-lg bg-green-700 hover:bg-green-800 text-white text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
                      >
                        Accept
                      </button>
                      <button
                        disabled={busy}
                        onClick={() => respondRequest(user.friendshipId!, "declined", user.id)}
                        className="px-3 py-1.5 rounded-lg bg-red-700/80 hover:bg-red-700 text-white text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
                      >
                        Decline
                      </button>
                    </>
                  )}

                  {user.friendshipStatus === "accepted" && (
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-green-700/20 text-green-400 text-xs font-medium">Friends</span>
                      <button
                        disabled={busy}
                        onClick={() => cancelRequest(user.friendshipId!, user.id)}
                        className="px-3 py-1.5 rounded-lg border border-red-700/50 text-red-400 hover:bg-red-700/10 text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
                      >
                        Unfriend
                      </button>
                    </div>
                  )}

                  {user.friendshipStatus === "declined" && (
                    <button
                      disabled={busy}
                      onClick={() => sendRequest(user.id)}
                      className="px-3 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
                    >
                      Add Friend
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
