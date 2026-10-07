import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import CartList from "@/components/CartList";
import { getCartItems } from "@/lib/db";



export default async function CartPage() {
  if (!(await getServerSession(authOptions))) redirect("/signin");

  const items = getCartItems();
  const savedQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <p>Saved quantity from the server: {savedQuantity}</p>
      <CartList initialItems={items} />
    </>
  );
}
