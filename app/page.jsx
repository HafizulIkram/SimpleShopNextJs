import ProductCard from "@/components/ProductCard";
import { getAllProducts } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";


export const dynamic = "force-dynamic";

// Server component: this page is the / route.
export default async function HomePage() {
  if (!(await getServerSession(authOptions))) redirect("/signin");

  // Read products from SQLite on the server.
  const products = getAllProducts();

  return (
    <>
      <div className="intro">
        <p className="label">WELCOME TO SIMPLE SHOP</p>
        <h1>Small shop, simple code.</h1>
        <p>Choose a product, add it to your cart, and see how Next.js pages work.</p>
      </div>
      <div className="grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </>
  );
}
