import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

// This layout wraps pages inside the /products folder only.
export default async function ProductLayout({ children }) {
  if (!(await getServerSession(authOptions))) redirect("/signin");

  return (
    <>
      <p className="back-link"><Link href="/">← Back to products</Link></p>
      {children}
    </>
  );
}
