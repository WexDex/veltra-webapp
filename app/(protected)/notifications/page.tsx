"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { DbNotification } from "@/lib/types";
import { cn } from "@/lib/utils";

function getInitials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "yesterday";
  return `${days}d ago`;
}

function groupByDate(notifications: DbNotification[]) {
  const groups: Record<string, DbNotification[]> = {};
  for (const n of notifications) {
    const d = new Date(n.created_at);
    const now = new Date();
    let label: string;
    if (d.toDateString() === now.toDateString()) label = "Today";
    else {
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      label = d.toDateString() === yesterday.toDateString() ? "Yesterday" : "Earlier";
    }
    if (!groups[label]) groups[label] = [];
    groups[label].push(n);
  }
  return groups;
}

function notifMeta(n: DbNotification): { label: string; href?: string; icon?: string } {
  if (n.type === "friend_request") return { label: `${n.fromUser?.name ?? "Someone"} sent you a friend request`, href: "/chat" };
  if (n.type === "friend_accepted") return { label: `${n.fromUser?.name ?? "Someone"} accepted your friend request`, href: "/chat" };
  if (n.type === "new_message") return { label: `${n.fromUser?.name ?? "Someone"} sent you a message`, href: n.fromUser ? `/chat/${n.fromUser.id}` : "/messages" };
  if (n.type === "new_contact") return { label: "New contact form submission", href: "/admin/dashboard" };
  return { label: "New notification" };
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<DbNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/notifications")
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data) setNotifications(data.notifications);
        setLoading(false);
      });

    fetch("/api/notifications/read", { method: "POST", body: "{}" });
  }, []);

  const groups = groupByDate(notifications);
  const groupOrder = ["Today", "Yesterday", "Earlier"].filter((g) => groups[g]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-100">Notifications</h1>
        <p className="text-gray-400 text-sm mt-1">Your activity feed</p>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-500">Loading…</div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-12 h-12 rounded-2xl bg-gray-800 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
          </div>
          <p className="text-gray-500 text-sm">No notifications yet</p>
        </div>
      ) : (
        <div className="space-y-8">
          {groupOrder.map((group) => (
            <div key={group}>
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">{group}</h2>
              <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                {groups[group].map((n, i) => {
                  const { label, href } = notifMeta(n);
                  const cls = cn(
                    "flex items-start gap-3 px-5 py-4",
                    i < groups[group].length - 1 && "border-b border-gray-800",
                    !n.read && "bg-blue-700/5",
                    href && "hover:bg-gray-800/50 transition-colors"
                  );
                  const inner = (
                    <>
                      <div className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center text-xs font-semibold text-gray-300 shrink-0">
                        {n.fromUser ? getInitials(n.fromUser.name) : "✉"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-200 leading-snug">{label}</p>
                        <p className="text-xs text-gray-500 mt-1">{timeAgo(n.created_at)}</p>
                      </div>
                      {!n.read && (
                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0" />
                      )}
                    </>
                  );
                  return href ? (
                    <Link key={n.id} href={href} className={cls}>{inner}</Link>
                  ) : (
                    <div key={n.id} className={cls}>{inner}</div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
