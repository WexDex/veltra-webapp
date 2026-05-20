export type Category = {
  id: string;
  name: string;
  created_at: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  image_url: string;
  category_id: string;
  category: Category;
  created_at: string;
  updated_at: string;
};

export type Employee = {
  id: string;
  name: string;
  role: string;
  phone: string;
  created_at: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  created_at: string;
};

export type Message = {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  read_at: string | null;
};

export type Contact = {
  id: string;
  name: string;
  message: string;
  created_at: string;
};

export const categories: Category[] = [
  { id: "1", name: "Electronics", created_at: "2024-01-10" },
  { id: "2", name: "Furniture", created_at: "2024-01-10" },
  { id: "3", name: "Lighting", created_at: "2024-01-10" },
  { id: "4", name: "Accessories", created_at: "2024-01-10" },
];

export const products: Product[] = [
  {
    id: "1",
    name: "Orion Desk Lamp",
    description:
      "A sleek, adjustable LED desk lamp with touch controls and 3 brightness levels. Designed for focused work environments, its minimalist form fits any desk setup without drawing attention away from what matters.",
    image_url: "https://picsum.photos/seed/lamp1/600/400",
    category_id: "3",
    category: { id: "3", name: "Lighting", created_at: "2024-01-10" },
    created_at: "2024-02-10",
    updated_at: "2024-02-10",
  },
  {
    id: "2",
    name: "Nova Standing Desk",
    description:
      "Electric height-adjustable standing desk with memory presets. Crafted from sustainably sourced oak with brushed steel legs. Supports up to 80 kg and remembers your four preferred heights.",
    image_url: "https://picsum.photos/seed/desk2/600/400",
    category_id: "2",
    category: { id: "2", name: "Furniture", created_at: "2024-01-10" },
    created_at: "2024-02-15",
    updated_at: "2024-02-15",
  },
  {
    id: "3",
    name: "Arc Pendant Light",
    description:
      "Handcrafted pendant light with a brushed brass arc arm and a frosted glass globe. Creates warm, ambient light ideal for dining areas and reading corners.",
    image_url: "https://picsum.photos/seed/pendant3/600/400",
    category_id: "3",
    category: { id: "3", name: "Lighting", created_at: "2024-01-10" },
    created_at: "2024-03-01",
    updated_at: "2024-03-01",
  },
  {
    id: "4",
    name: "Slate Wireless Charger",
    description:
      "15W fast wireless charging pad with a matte slate surface. Compatible with all Qi-enabled devices. Low-profile design sits cleanly on any surface without cable clutter.",
    image_url: "https://picsum.photos/seed/charger4/600/400",
    category_id: "1",
    category: { id: "1", name: "Electronics", created_at: "2024-01-10" },
    created_at: "2024-03-05",
    updated_at: "2024-03-05",
  },
  {
    id: "5",
    name: "Linen Accent Chair",
    description:
      "A mid-century modern accent chair upholstered in natural linen fabric. Solid walnut frame with tapered legs. Pairs effortlessly with both minimal and layered interiors.",
    image_url: "https://picsum.photos/seed/chair5/600/400",
    category_id: "2",
    category: { id: "2", name: "Furniture", created_at: "2024-01-10" },
    created_at: "2024-03-10",
    updated_at: "2024-03-10",
  },
  {
    id: "6",
    name: "Mist Humidifier",
    description:
      "Ultra-quiet ultrasonic humidifier with 360° mist output and a 4-litre tank. Auto shut-off when empty. Available in matte white and charcoal.",
    image_url: "https://picsum.photos/seed/humidifier6/600/400",
    category_id: "4",
    category: { id: "4", name: "Accessories", created_at: "2024-01-10" },
    created_at: "2024-03-15",
    updated_at: "2024-03-15",
  },
  {
    id: "7",
    name: "Kinetic Wall Clock",
    description:
      "A minimalist wall clock with silent quartz movement and a spun aluminum face. The subtle texture catches natural light at different times of day, giving it a living quality.",
    image_url: "https://picsum.photos/seed/clock7/600/400",
    category_id: "4",
    category: { id: "4", name: "Accessories", created_at: "2024-01-10" },
    created_at: "2024-03-20",
    updated_at: "2024-03-20",
  },
  {
    id: "8",
    name: "Volta Portable Speaker",
    description:
      "Premium portable Bluetooth speaker with 24-hour battery life and IPX5 water resistance. Omnidirectional sound dispersion and a fabric-wrapped body that looks as good as it sounds.",
    image_url: "https://picsum.photos/seed/speaker8/600/400",
    category_id: "1",
    category: { id: "1", name: "Electronics", created_at: "2024-01-10" },
    created_at: "2024-03-25",
    updated_at: "2024-03-25",
  },
];

export const FEATURED_PRODUCTS = products.slice(0, 3);

export const employees: Employee[] = [
  {
    id: "1",
    name: "Sarah Bennett",
    role: "General Manager",
    phone: "+1 (555) 201-4401",
    created_at: "2023-06-01",
  },
  {
    id: "2",
    name: "Marcus Hill",
    role: "Head of Sales",
    phone: "+1 (555) 201-4402",
    created_at: "2023-07-15",
  },
  {
    id: "3",
    name: "Priya Nair",
    role: "Product Designer",
    phone: "+1 (555) 201-4403",
    created_at: "2023-08-20",
  },
  {
    id: "4",
    name: "Jordan Webb",
    role: "Warehouse Lead",
    phone: "+1 (555) 201-4404",
    created_at: "2024-01-05",
  },
  {
    id: "5",
    name: "Elena Castillo",
    role: "Customer Support",
    phone: "+1 (555) 201-4405",
    created_at: "2024-02-12",
  },
];

export const users: User[] = [
  {
    id: "1",
    name: "Alex Morgan",
    email: "alex@example.com",
    created_at: "2024-01-15",
  },
  {
    id: "2",
    name: "Jamie Chen",
    email: "jamie@example.com",
    created_at: "2024-02-01",
  },
  {
    id: "3",
    name: "Riley Parker",
    email: "riley@example.com",
    created_at: "2024-02-14",
  },
  {
    id: "4",
    name: "Simone Dubois",
    email: "simone@example.com",
    created_at: "2024-03-02",
  },
  {
    id: "5",
    name: "Kai Nakamura",
    email: "kai@example.com",
    created_at: "2024-03-18",
  },
];

export const CURRENT_USER = users[0];

export const messages: Message[] = [
  {
    id: "1",
    sender_id: "2",
    receiver_id: "1",
    content: "Hey Alex, did you check out the new desk lamp?",
    created_at: "2024-04-01T10:00:00Z",
    read_at: "2024-04-01T10:05:00Z",
  },
  {
    id: "2",
    sender_id: "1",
    receiver_id: "2",
    content: "Yeah! The Orion one looks great. Thinking of ordering it this week.",
    created_at: "2024-04-01T10:06:00Z",
    read_at: "2024-04-01T10:08:00Z",
  },
  {
    id: "3",
    sender_id: "2",
    receiver_id: "1",
    content: "Do it. I got mine last month and it changed my setup completely.",
    created_at: "2024-04-01T10:09:00Z",
    read_at: "2024-04-01T10:10:00Z",
  },
  {
    id: "4",
    sender_id: "1",
    receiver_id: "2",
    content: "Does it work well with the wireless charger too?",
    created_at: "2024-04-01T10:11:00Z",
    read_at: null,
  },
  {
    id: "5",
    sender_id: "2",
    receiver_id: "1",
    content: "Yep, I have both on my desk. Looks super clean.",
    created_at: "2024-04-01T10:13:00Z",
    read_at: null,
  },
  {
    id: "6",
    sender_id: "1",
    receiver_id: "2",
    content: "Alright, adding both to my cart now lol",
    created_at: "2024-04-01T10:15:00Z",
    read_at: null,
  },
  {
    id: "7",
    sender_id: "2",
    receiver_id: "1",
    content: "Smart move. You won't regret it.",
    created_at: "2024-04-01T10:16:00Z",
    read_at: null,
  },
  {
    id: "8",
    sender_id: "1",
    receiver_id: "2",
    content: "Thanks for the tip!",
    created_at: "2024-04-01T10:17:00Z",
    read_at: null,
  },
];

export const dashboardStats = {
  totalProducts: 24,
  totalEmployees: 8,
  totalUsers: 156,
};

export const recentContacts: Contact[] = [
  {
    id: "1",
    name: "Thomas Ricci",
    message:
      "I'm interested in bulk ordering the Orion Desk Lamp for our office. Could you provide pricing?",
    created_at: "2024-04-02T09:30:00Z",
  },
  {
    id: "2",
    name: "Nina Walsh",
    message:
      "Hello, I wanted to ask about the warranty on the Nova Standing Desk.",
    created_at: "2024-04-01T14:20:00Z",
  },
  {
    id: "3",
    name: "David Park",
    message: "Do you ship internationally? Specifically to South Korea?",
    created_at: "2024-03-31T11:00:00Z",
  },
];
