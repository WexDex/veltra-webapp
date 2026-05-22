"use client";

import { useState, useEffect, useCallback } from "react";
import { DbUserFull } from "@/lib/types";
import { cn } from "@/lib/utils";

function getInitials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<DbUserFull[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/auth/me").then((r) => r.json()).then((me) => setCurrentId(me.id));
  }, []);

  const fetchUsers = useCallback(() => {
    fetch("/api/admin/users")
      .then((r) => r.ok ? r.json() : [])
      .then((data) => { setUsers(data); setLoading(false); });
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const toggleRole = async (user: DbUserFull) => {
    setActionLoading(user.id);
    const newRole = user.role === "admin" ? "user" : "admin";
    await fetch(`/api/admin/users/${user.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });
    fetchUsers();
    setActionLoading(null);
  };

  const deleteUser = async (id: number) => {
    setActionLoading(id);
    setDeleteConfirm(null);
    await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    fetchUsers();
    setActionLoading(null);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-100">Users</h1>
        <p className="text-gray-400 text-sm mt-1">Manage registered user accounts</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left px-5 py-3.5 text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="text-left px-5 py-3.5 text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Email</th>
              <th className="text-left px-5 py-3.5 text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="text-left px-5 py-3.5 text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Joined</th>
              <th className="text-right px-5 py-3.5 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-gray-500 text-sm">Loading…</td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-gray-500 text-sm">No users found.</td>
              </tr>
            ) : (
              users.map((user) => {
                const isSelf = user.id === currentId;
                const busy = actionLoading === user.id;
                return (
                  <tr key={user.id} className="border-b border-gray-800 last:border-0 hover:bg-gray-800/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs font-semibold text-gray-300 shrink-0">
                          {getInitials(user.name)}
                        </div>
                        <span className="text-sm font-medium text-gray-100">{user.name}</span>
                        {isSelf && <span className="text-[10px] text-gray-500">(you)</span>}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-400 hidden sm:table-cell">{user.email}</td>
                    <td className="px-5 py-3.5">
                      <span className={cn(
                        "inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold",
                        user.role === "admin" ? "bg-blue-700/20 text-blue-400" : "bg-gray-700/50 text-gray-400"
                      )}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-500 hidden md:table-cell">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {!isSelf && (
                          <>
                            <button
                              disabled={busy}
                              onClick={() => toggleRole(user)}
                              className="px-3 py-1.5 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
                            >
                              {user.role === "admin" ? "Demote" : "Promote"}
                            </button>
                            {deleteConfirm === user.id ? (
                              <div className="flex items-center gap-1">
                                <button
                                  disabled={busy}
                                  onClick={() => deleteUser(user.id)}
                                  className="px-3 py-1.5 rounded-lg bg-red-700 hover:bg-red-800 text-white text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
                                >
                                  Confirm
                                </button>
                                <button
                                  onClick={() => setDeleteConfirm(null)}
                                  className="px-3 py-1.5 rounded-lg border border-gray-700 text-gray-400 hover:bg-gray-800 text-xs font-medium transition-colors cursor-pointer"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                disabled={busy}
                                onClick={() => setDeleteConfirm(user.id)}
                                className="px-3 py-1.5 rounded-lg border border-red-700/50 text-red-400 hover:bg-red-700/10 text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
                              >
                                Delete
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
