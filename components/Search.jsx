"use client";

import { useState } from "react";
import ProductCard from "./ProductCard";

export default function Search() {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function searchProducts(event) {
    event.preventDefault();
    setLoading(true);
    setSearched(true);
    setError("");

    try {
      // Client fetch: this request happens in the browser.
      const url = `/api/products?q=${encodeURIComponent(query)}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Search failed");
      const data = await response.json();
      setProducts(data);
    } catch {
      setError("Search is unavailable. Please try again.");
      setProducts([]);
    }

    setLoading(false);
  }

  return (
    <>
      <h1>Search products</h1>
      <p>This page fetches SQLite products from our API when you click Search.</p>
      <form className="search-form" onSubmit={searchProducts}>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Try lamp, chair, or table"
          aria-label="Product name"
        />
        <button type="submit">Search</button>
      </form>
      {loading && <p>Searching...</p>}
      {error && <p role="alert" className="error">{error}</p>}
      {!loading && !error && searched && products.length === 0 && <p>No products found.</p>}
      {!loading && <div className="grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>}
    </>
  );
}
