"use client";

import { useState } from "react";

export default function AdminProducts({ initialProducts }) {
  const [products, setProducts] = useState(initialProducts);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  function clearForm() {
    setTitle("");
    setDescription("");
    setPrice("");
    setEditingId(null);
  }

  async function refreshProducts() {
    const response = await fetch("/api/products");
    const latestProducts = await response.json();
    setProducts(latestProducts);
  }

  async function saveProduct(event) {
    event.preventDefault();
    setMessage("");

    // New products use POST. Existing products use PUT.
    const url = editingId ? `/api/products/${editingId}` : "/api/products";
    const method = editingId ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: title.trim(),
        description: description.trim(),
        price: Number(price),
      }),
    });

    const result = await response.json();
    if (!response.ok) {
      setMessage(result.error || "Could not save product");
      return;
    }

    setMessage(editingId ? "Product updated" : "Product added");
    clearForm();
    await refreshProducts();
  }

  function editProduct(product) {
    setEditingId(product.id);
    setTitle(product.title);
    setDescription(product.description);
    setPrice(String(product.price));
    setMessage("");
  }

  async function deleteProduct(id) {
    if (!window.confirm("Delete this product?")) return;

    const response = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (!response.ok) {
      setMessage("Could not delete product");
      return;
    }

    if (editingId === id) clearForm();
    setMessage("Product deleted");
    await refreshProducts();
  }

  return (
    <section className="admin-page">
      <h1>Manage products</h1>

      <form className="product-form" onSubmit={saveProduct}>
        <h2>{editingId ? "Edit product" : "Add product"}</h2>

        <label>
          Name
          <input
            required
            maxLength="100"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </label>

        <label>
          Description
          <textarea
            maxLength="1000"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </label>

        <label>
          Price ($)
          <input
            required
            type="number"
            min="0"
            max="1000000"
            step="0.01"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
          />
        </label>

        <div className="form-buttons">
          <button type="submit">
            {editingId ? "Save changes" : "Add product"}
          </button>
          {editingId && (
            <button type="button" className="remove" onClick={clearForm}>
              Cancel
            </button>
          )}
        </div>

        {message && <p role="status">{message}</p>}
      </form>

      <h2>Products ({products.length})</h2>
      <div className="admin-list">
        {products.map((product) => (
          <div className="admin-item" key={product.id}>
            <span>{product.title} — ${product.price.toFixed(2)}</span>
            <div>
              <button type="button" className="remove" onClick={() => editProduct(product)}>
                Edit
              </button>
              <button type="button" className="remove" onClick={() => deleteProduct(product.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
