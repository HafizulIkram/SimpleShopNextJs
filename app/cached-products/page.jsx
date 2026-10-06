import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/get-products";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

// Static server fetch: Next.js can cache this API response.
export default async function CachedProductsPage() {
  if (!(await getServerSession(authOptions))) redirect("/signin");
  const products = await getProducts("force-cache");

  return (
    <>
      <h1>Cached API products</h1>
      <p>This page reuses cached data from the third-party API.</p>
      <div className="grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </>
  );
}
