import { redirect } from "next/navigation";
import { auth } from "@/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background md:flex-row">
      <AdminSidebar email={session.user.email} />
      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-5 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-10">
        {children}
      </div>
    </div>
  );
}
