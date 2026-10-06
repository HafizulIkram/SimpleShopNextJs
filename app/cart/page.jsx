import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import CartList from "@/components/CartList";
import { getCartItems } from "@/lib/db";



export default async function CartPage() {
  if (!(await getServerSession(authOptions))) redirect("/signin");
  return <CartList initialItems={getCartItems()} />;
}
