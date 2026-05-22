"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { DbConversation } from "@/lib/types";
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
  return `${Math.floor(hours / 24)}d ago`;
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<DbConversation[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.ok ? r.json() : null)
      .then((me) => { if (me) setCurrentUserId(me.id); });

    fetch("/api/messages/conversations")
      .then((r) => r.ok ? r.json() : [])
      .then((data) => { setConversations(data); setLoading(false); });
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">Messages</h1>
          <p className="text-gray-400 text-sm mt-1">Your recent conversations</p>
        </div>
        <Link
          href="/chat"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-sm font-medium transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
          </svg>
          New Message
        </Link>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        {loading ? (
          <p className="text-center text-gray-500 py-16 text-sm">Loading…</p>
        ) : conversations.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-12 h-12 rounded-2xl bg-gray-800 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-gray-500 text-sm">No conversations yet</p>
            <Link href="/chat" className="mt-3 inline-block text-sm text-blue-400 hover:text-blue-300 transition-colors">
              Find people to message
            </Link>
          </div>
        ) : (
          conversations.map((conv, i) => (
            <Link
              key={conv.user.id}
              href={`/chat/${conv.user.id}`}
              className={cn(
                "flex items-center gap-4 px-5 py-4 hover:bg-gray-800/50 transition-colors",
                i < conversations.length - 1 && "border-b border-gray-800"
              )}
            >
              <div className="relative shrink-0">
                <div className="w-11 h-11 rounded-full bg-gray-700 flex items-center justify-center text-sm font-semibold text-gray-300">
                  {getInitials(conv.user.name)}
                </div>
                {conv.unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-[10px] text-white font-bold">
                    {conv.unreadCount > 9 ? "9+" : conv.unreadCount}
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                  <p className={cn("text-sm font-medium truncate", conv.unreadCount > 0 ? "text-gray-100" : "text-gray-300")}>
                    {conv.user.name}
                  </p>
                  <span className="text-xs text-gray-500 shrink-0">
                    {timeAgo(conv.lastMessage.created_at)}
                  </span>
                </div>
                <p className={cn("text-xs truncate mt-0.5", conv.unreadCount > 0 ? "text-gray-300 font-medium" : "text-gray-500")}>
                  {conv.lastMessage.sender_id === currentUserId ? "You: " : ""}
                  {conv.lastMessage.content}
                </p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
