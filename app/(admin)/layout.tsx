import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import AdminSidebar from "@/components/layout/AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();
  if (!session || session.role !== "admin") redirect("/auth/login");

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 bg-gray-950 overflow-auto">{children}</main>
    </div>
  );
}
