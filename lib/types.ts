export interface DbCategory {
  id: number;
  name: string;
  created_at: string;
}

export interface DbProduct {
  id: number;
  name: string;
  description: string | null;
  image_url: string | null;
  category_id: number;
  category: DbCategory;
  created_at: string;
  updated_at: string;
}

export interface DbEmployee {
  id: number;
  name: string;
  role: string;
  phone: string | null;
  created_at: string;
}

export interface DbUser {
  id: number;
  name: string;
  email: string;
}

export interface DbMessage {
  id: number;
  sender_id: number;
  receiver_id: number;
  content: string;
  created_at: string;
  read_at: string | null;
}

export interface DbContact {
  id: number;
  name: string;
  message: string;
  created_at: string;
}

export interface DbUserFull extends DbUser {
  role: string;
  created_at: string;
}

export interface DbFriendship {
  id: number;
  user_id: number;
  friend_id: number;
  status: "pending" | "accepted" | "declined";
  created_at: string;
}

export interface DbNotification {
  id: number;
  user_id: number;
  type: "friend_request" | "friend_accepted" | "new_message" | "new_contact";
  from_user_id: number | null;
  ref_id: number | null;
  read: boolean;
  created_at: string;
  fromUser?: { id: number; name: string };
}

export interface DbUserWithFriendship extends DbUser {
  friendshipId?: number;
  friendshipStatus?: "pending" | "accepted" | "declined";
  friendshipInitiator?: boolean;
}

export interface DbConversation {
  user: { id: number; name: string };
  lastMessage: { content: string; created_at: string; sender_id: number };
  unreadCount: number;
}

export interface DashboardStats {
  totalProducts: number;
  totalEmployees: number;
  totalUsers: number;
  recentContacts: DbContact[];
}
