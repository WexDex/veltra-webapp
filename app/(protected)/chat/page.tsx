"use client";

import { useState } from "react";
import { users, CURRENT_USER } from "@/lib/mock-data";
import UserListItem from "@/components/chat/UserListItem";
import Input from "@/components/ui/Input";

export default function ChatPage() {
  const [search, setSearch] = useState("");
  const [friends, setFriends] = useState<string[]>(["2", "3"]);

  const otherUsers = users.filter((u) => u.id !== CURRENT_USER.id);
  const filtered = otherUsers.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddFriend = (id: string) => {
    setFriends((prev) => [...prev, id]);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-100">Messages</h1>
        <p className="text-gray-400 text-sm mt-1">
          Chat with other Veltra users
        </p>
      </div>

      <div className="mb-5">
        <Input
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden divide-y divide-gray-800">
        {filtered.length === 0 ? (
          <p className="text-center text-gray-500 py-12 text-sm">
            No users found.
          </p>
        ) : (
          filtered.map((user) => (
            <UserListItem
              key={user.id}
              user={user}
              isFriend={friends.includes(user.id)}
              onAddFriend={handleAddFriend}
            />
          ))
        )}
      </div>
    </div>
  );
}
