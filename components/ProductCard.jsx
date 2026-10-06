import Image from "next/image";
import Link from "next/link";

// This card links to the product page, where CartForm adds it to the cart.
export default function ProductCard({ product }) {
  return (
    <article className="card">
      <Link href={`/products/${product.id}`}>
        <Image
          src={product.image || `/images/product-${product.id}.webp`}
          alt={product.title}
          width={240}
          height={240}
        />
        <h2>{product.title}</h2>
      </Link>
      <p>${product.price.toFixed(2)}</p>
    </article>
  );
}
