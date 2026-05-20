"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { messages as initialMessages, users, CURRENT_USER } from "@/lib/mock-data";
import MessageBubble from "@/components/chat/MessageBubble";
import MessageInput from "@/components/chat/MessageInput";
import Avatar from "@/components/ui/Avatar";
import { Message } from "@/lib/mock-data";

export default function ConversationPage() {
  const params = useParams();
  const userId = params.userId as string;
  const otherUser = users.find((u) => u.id === userId);
  const [msgs, setMsgs] = useState(initialMessages);

  if (!otherUser) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <p className="text-gray-500">User not found.</p>
      </div>
    );
  }

  const conversation = msgs.filter(
    (m) =>
      (m.sender_id === CURRENT_USER.id && m.receiver_id === otherUser.id) ||
      (m.sender_id === otherUser.id && m.receiver_id === CURRENT_USER.id)
  );

  const handleSend = (content: string) => {
    const newMsg: Message = {
      id: String(Date.now()),
      sender_id: CURRENT_USER.id,
      receiver_id: otherUser.id,
      content,
      created_at: new Date().toISOString(),
      read_at: null,
    };
    setMsgs((prev) => [...prev, newMsg]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      <div className="flex items-center gap-4 px-4 py-3.5 border-b border-gray-800 bg-gray-950">
        <Link
          href="/chat"
          className="text-gray-400 hover:text-gray-100 transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
        </Link>
        <Avatar name={otherUser.name} size="sm" />
        <div>
          <p className="text-gray-100 font-semibold text-sm">{otherUser.name}</p>
          <p className="text-gray-500 text-xs">{otherUser.email}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        {conversation.length === 0 ? (
          <p className="text-center text-gray-600 text-sm mt-12">
            Start the conversation.
          </p>
        ) : (
          conversation.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              isOwn={msg.sender_id === CURRENT_USER.id}
            />
          ))
        )}
      </div>

      <MessageInput onSend={handleSend} />
    </div>
  );
}
