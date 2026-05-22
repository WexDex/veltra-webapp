"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import MessageBubble from "@/components/chat/MessageBubble";
import MessageInput from "@/components/chat/MessageInput";
import { DbMessage, DbUserWithFriendship } from "@/lib/types";
import { cn } from "@/lib/utils";

function getInitials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

export default function ConversationPage() {
  const params = useParams();
  const userId = params.userId as string;

  const [otherUser, setOtherUser] = useState<DbUserWithFriendship | null>(null);
  const [messages, setMessages] = useState<DbMessage[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((me) => setCurrentUserId(me.id));
  }, []);

  const fetchOtherUser = useCallback(() => {
    fetch("/api/users")
      .then((r) => r.json())
      .then((users: DbUserWithFriendship[]) => {
        const found = users.find((u) => u.id === parseInt(userId));
        setOtherUser(found ?? null);
      });
  }, [userId]);

  useEffect(() => { fetchOtherUser(); }, [fetchOtherUser]);

  const fetchMessages = useCallback(() => {
    fetch(`/api/messages?with=${userId}`)
      .then((r) => r.json())
      .then(setMessages);
  }, [userId]);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (content: string) => {
    await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ receiver_id: parseInt(userId), content }),
    });
    fetchMessages();
  };

  const sendRequest = async () => {
    if (!otherUser) return;
    setActionLoading(true);
    await fetch("/api/friendships", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ friend_id: otherUser.id }),
    });
    fetchOtherUser();
    setActionLoading(false);
  };

  const cancelOrUnfriend = async () => {
    if (!otherUser?.friendshipId) return;
    setActionLoading(true);
    await fetch(`/api/friendships/${otherUser.friendshipId}`, { method: "DELETE" });
    fetchOtherUser();
    setActionLoading(false);
  };

  const respond = async (status: "accepted" | "declined") => {
    if (!otherUser?.friendshipId) return;
    setActionLoading(true);
    await fetch(`/api/friendships/${otherUser.friendshipId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchOtherUser();
    setActionLoading(false);
  };

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-64px)]">
      {/* Left — profile card */}
      <div className="w-full md:w-72 border-b md:border-b-0 md:border-r border-gray-800 bg-gray-950 flex flex-col">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-800">
          <Link href="/chat" className="text-gray-400 hover:text-gray-100 transition-colors shrink-0">
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </Link>
          <span className="text-sm font-medium text-gray-400">Back to People</span>
        </div>

        {otherUser ? (
          <div className="flex flex-col items-center px-5 py-8 gap-4 flex-1">
            <div className="w-20 h-20 rounded-full bg-blue-700/20 border-2 border-blue-700/30 flex items-center justify-center text-2xl font-bold text-blue-300">
              {getInitials(otherUser.name)}
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-100">{otherUser.name}</p>
              <p className="text-sm text-gray-500">{otherUser.email}</p>
            </div>

            <div className="w-full mt-2 space-y-2">
              {!otherUser.friendshipStatus && (
                <button
                  disabled={actionLoading}
                  onClick={sendRequest}
                  className="w-full py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-sm font-medium transition-colors cursor-pointer disabled:opacity-50"
                >
                  Add Friend
                </button>
              )}

              {otherUser.friendshipStatus === "pending" && otherUser.friendshipInitiator && (
                <button
                  disabled={actionLoading}
                  onClick={cancelOrUnfriend}
                  className="w-full py-2 rounded-xl border border-gray-700 text-gray-400 hover:bg-gray-800 text-sm font-medium transition-colors cursor-pointer disabled:opacity-50"
                >
                  Cancel Request
                </button>
              )}

              {otherUser.friendshipStatus === "pending" && !otherUser.friendshipInitiator && (
                <div className="space-y-2">
                  <button
                    disabled={actionLoading}
                    onClick={() => respond("accepted")}
                    className="w-full py-2 rounded-xl bg-green-700 hover:bg-green-800 text-white text-sm font-medium transition-colors cursor-pointer disabled:opacity-50"
                  >
                    Accept Request
                  </button>
                  <button
                    disabled={actionLoading}
                    onClick={() => respond("declined")}
                    className="w-full py-2 rounded-xl border border-red-700/50 text-red-400 hover:bg-red-700/10 text-sm font-medium transition-colors cursor-pointer disabled:opacity-50"
                  >
                    Decline
                  </button>
                </div>
              )}

              {otherUser.friendshipStatus === "accepted" && (
                <div className="space-y-2">
                  <div className="w-full py-2 rounded-xl bg-green-700/10 text-green-400 text-sm font-medium text-center">
                    Friends
                  </div>
                  <button
                    disabled={actionLoading}
                    onClick={cancelOrUnfriend}
                    className="w-full py-2 rounded-xl border border-red-700/50 text-red-400 hover:bg-red-700/10 text-sm font-medium transition-colors cursor-pointer disabled:opacity-50"
                  >
                    Unfriend
                  </button>
                </div>
              )}

              {otherUser.friendshipStatus === "declined" && (
                <button
                  disabled={actionLoading}
                  onClick={sendRequest}
                  className="w-full py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-sm font-medium transition-colors cursor-pointer disabled:opacity-50"
                >
                  Add Friend
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center flex-1">
            <p className="text-gray-500 text-sm">Loading…</p>
          </div>
        )}
      </div>

      {/* Right — chat */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className={cn(
          "flex items-center gap-3 px-5 py-3.5 border-b border-gray-800 bg-gray-950",
          !otherUser && "opacity-50"
        )}>
          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs font-semibold text-gray-300">
            {otherUser ? getInitials(otherUser.name) : "?"}
          </div>
          <div>
            <p className="text-gray-100 font-semibold text-sm">{otherUser?.name ?? "Loading…"}</p>
            <p className="text-gray-500 text-xs">Conversation</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6">
          {messages.length === 0 ? (
            <p className="text-center text-gray-600 text-sm mt-12">Start the conversation.</p>
          ) : (
            messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} isOwn={msg.sender_id === currentUserId} />
            ))
          )}
          <div ref={bottomRef} />
        </div>

        <MessageInput onSend={handleSend} />
      </div>
    </div>
  );
}
