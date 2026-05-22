import Link from "next/link";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import { DbUser } from "@/lib/types";

interface UserListItemProps {
  user: DbUser;
  isFriend?: boolean;
  onAddFriend?: (id: number) => void;
}

export default function UserListItem({ user, isFriend, onAddFriend }: UserListItemProps) {
  return (
    <div className="flex items-center justify-between py-3 px-4 hover:bg-gray-800/60 transition-colors">
      <Link
        href={`/chat/${user.id}`}
        className="flex items-center gap-3 flex-1 min-w-0"
      >
        <Avatar name={user.name} size="md" />
        <div className="min-w-0">
          <p className="text-gray-100 font-medium text-sm truncate">{user.name}</p>
          <p className="text-gray-500 text-xs truncate">{user.email}</p>
        </div>
      </Link>
      {!isFriend && onAddFriend ? (
        <Button variant="ghost" size="sm" onClick={() => onAddFriend(user.id)}>
          + Add Friend
        </Button>
      ) : (
        <Link href={`/chat/${user.id}`}>
          <Button variant="ghost" size="sm">Message</Button>
        </Link>
      )}
    </div>
  );
}
