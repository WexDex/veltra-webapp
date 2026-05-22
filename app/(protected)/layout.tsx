import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import Navbar from "@/components/layout/Navbar";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();
  if (!session) redirect("/auth/login");

  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
    </>
  );
}
