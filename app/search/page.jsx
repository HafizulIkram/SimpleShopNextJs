import Search from "@/components/Search";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function SearchPage() {
  if (!(await getServerSession(authOptions))) redirect("/signin");
  return <Search />;
}
