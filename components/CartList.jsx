"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

// These rows come from SQLite. PUT changes quantity; DELETE removes a row.
export default function CartList({ initialItems }) {
  const [items, setItems] = useState(initialItems);
  const [error, setError] = useState("");
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  async function updateItem(id, method, quantity) {
    setError("");
    try {
      const response = await fetch(`/api/cart/${id}`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: method === "PUT" ? JSON.stringify({ quantity }) : undefined,
      });
      const result = await response.json();
      if (!response.ok) {
        setError(result.error || "Could not update cart");
        return;
      }
      setItems(result);
    } catch {
      setError("Could not update cart. Please try again.");
    }
  }

  return (
    <section>
      <h1>Your cart</h1>
      {error && <p className="error" role="alert">{error}</p>}
      {items.length === 0 && <p>Your cart is empty. <Link href="/">See products</Link></p>}
      {items.map((item) => (
        <div className="cart-item" key={item.id}>
          <Image src={item.image} alt={item.title} width={80} height={80} />
          <div>
            <Link href={`/products/${item.id}`}>{item.title}</Link>
            <p>${item.price.toFixed(2)} each</p>
          </div>
          <div className="quantity">
            <button disabled={item.quantity === 1} onClick={() => updateItem(item.id, "PUT", item.quantity - 1)}>−</button>
            <span>{item.quantity}</span>
            <button disabled={item.quantity === 99} onClick={() => updateItem(item.id, "PUT", item.quantity + 1)}>+</button>
          </div>
          <button className="remove" onClick={() => updateItem(item.id, "DELETE")}>Remove</button>
        </div>
      ))}
      {items.length > 0 && <h2>Total: ${total.toFixed(2)}</h2>}
      <p className="note">This is a learning project. There is no payment or checkout.</p>
    </section>
  );
}
