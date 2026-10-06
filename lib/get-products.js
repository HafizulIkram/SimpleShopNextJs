const ids = [14, 47, 13, 46, 49, 53];

// This function runs on the server. DummyJSON is a third-party API.
export async function getProducts(cache = "force-cache") {
  const response = await fetch("https://dummyjson.com/products?limit=0", { cache });
  if (!response.ok) throw new Error("Could not load API products");

  const data = await response.json();
  return data.products.filter((product) => ids.includes(product.id));
}
