import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminProducts from "@/components/AdminProducts";
import { getAllProducts } from "@/lib/db";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/signin");

  return <AdminProducts initialProducts={getAllProducts()} />;
}
