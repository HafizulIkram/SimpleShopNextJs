"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Submit this form to insert a row into SQLite through POST /api/cart.
export default function CartForm({ product }) {
  const router = useRouter();
  const [quantity, setQuantity] = useState("1");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, quantity: Number(quantity) }),
      });
      if (!response.ok) {
        const result = await response.json();
        setError(result.error || "Could not add to cart");
        return;
      }
      router.push("/cart");
      router.refresh();
    } catch {
      setError("Could not add to cart. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="cart-form" onSubmit={handleSubmit}>
      <label htmlFor="quantity">Quantity</label>
      <input
        id="quantity"
        type="number"
        min="1"
        max="99"
        required
        value={quantity}
        onChange={(event) => setQuantity(event.target.value)}
      />
      <button disabled={loading}>{loading ? "Adding..." : "Add to cart"}</button>
      {error && <p className="error" role="alert">{error}</p>}
    </form>
  );
}
