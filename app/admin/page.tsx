import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/adminAuth";
import AdminTabs from "@/components/admin/AdminTabs";

export default async function AdminPage() {
  const adminId = await requireAdmin();
  if (!adminId) redirect("/admin/login");

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="mb-8 font-heading text-3xl font-bold text-primary">Admin Panel</h1>
      <AdminTabs />
    </div>
  );
}
