import { notFound } from "next/navigation";
import Image from "next/image";
import CartForm from "@/components/CartForm";
import { getProduct } from "@/lib/db";


export const dynamic = "force-dynamic";

// [id] makes this route dynamic: /products/14, /products/47, and so on.
export default async function ProductPage({ params }) {
  const { id } = await params;
  const productId = Number(id);
  const product = Number.isSafeInteger(productId) && productId > 0
    ? getProduct(productId)
    : null;

  if (!product) notFound();

  return (
    <div className="details">
      <Image
        src={product.image}
        alt={product.title}
        width={400}
        height={400}
      />
      <div>
        <p className="label">PRODUCT DETAILS</p>
        <h1>{product.title}</h1>
        <p>{product.description}</p>
        <p className="price">${product.price.toFixed(2)}</p>
        <CartForm product={product} />
      </div>
    </div>
  );
}
