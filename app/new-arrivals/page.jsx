import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/get-products";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

// Server component: fetch fresh products for every request.
export default async function FreshProductsPage() {
  if (!(await getServerSession(authOptions))) redirect("/signin");
  const products = await getProducts("no-store");

  return (
    <>
      <h1>Fresh API products</h1>
      <p>This page asks the third-party API for fresh data each time.</p>
      <div className="grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </>
  );
}
