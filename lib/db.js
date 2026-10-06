import { mkdirSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

// SQLite saves data in a file on this computer.
const folder = path.join(process.cwd(), "data");
mkdirSync(folder, { recursive: true });

const db = new DatabaseSync(path.join(folder, "shop.sqlite"));
db.exec("PRAGMA foreign_keys = ON");
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price REAL NOT NULL,
    image TEXT NOT NULL
  )
`);
db.exec(`
  CREATE TABLE IF NOT EXISTS cart_items (
    product_id INTEGER PRIMARY KEY,
    quantity INTEGER NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
  )
`);

// Add the six starting products only once. The transaction prevents two
// requests from seeding the new file at the same time.
db.exec("BEGIN IMMEDIATE");
try {
  if (db.prepare("PRAGMA user_version").get().user_version === 0) {
    const insert = db.prepare(
      "INSERT INTO products (id, title, description, price, image) VALUES (?, ?, ?, ?, ?)",
    );
    insert.run(14, "Knoll Saarinen Executive Conference Chair", "A comfortable, modern chair for work or home.", 499.99, "/images/product-14.webp");
    insert.run(47, "Table Lamp", "A simple lamp that brings warm light to a room.", 49.99, "/images/product-47.webp");
    insert.run(13, "Bedside Table African Cherry", "A bedside table with useful storage.", 299.99, "/images/product-13.webp");
    insert.run(46, "Plant Pot", "A neat home for your favorite plant.", 14.99, "/images/product-46.webp");
    insert.run(49, "Black Aluminium Cup", "A cup for everyday drinks.", 5.99, "/images/product-49.webp");
    insert.run(53, "Chopping Board", "A practical board for preparing food.", 12.99, "/images/product-53.webp");
    db.exec("PRAGMA user_version = 1");
  }
  db.exec("COMMIT");
} catch (error) {
  db.exec("ROLLBACK");
  throw error;
}

export function getAllProducts() {
  // node:sqlite returns rows with a null prototype. Client Components need
  // ordinary JavaScript objects, so copy each row before returning it.
  return db.prepare("SELECT * FROM products ORDER BY id").all().map((row) => ({ ...row }));
}

export function getProduct(id) {
  const row = db.prepare("SELECT * FROM products WHERE id = ?").get(id);
  return row ? { ...row } : null;
}

export function createProduct(product) {
  const result = db.prepare(
    "INSERT INTO products (title, description, price, image) VALUES (?, ?, ?, ?)",
  ).run(product.title, product.description, product.price, "/product-placeholder.svg");
  return getProduct(Number(result.lastInsertRowid));
}

export function updateProduct(id, product) {
  db.prepare(
    "UPDATE products SET title = ?, description = ?, price = ? WHERE id = ?",
  ).run(product.title, product.description, product.price, id);
  return getProduct(id);
}

export function deleteProduct(id) {
  const result = db.prepare("DELETE FROM products WHERE id = ?").run(id);
  return result.changes > 0;
}

// The demo has one trainer account, so it has one cart.
export function getCartItems() {
  return db.prepare(`
    SELECT products.id, products.title, products.price, products.image,
           cart_items.quantity
    FROM cart_items
    JOIN products ON products.id = cart_items.product_id
    ORDER BY products.id
  `).all().map((row) => ({ ...row }));
}

export function addCartItem(productId, quantity) {
  db.prepare(`
    INSERT INTO cart_items (product_id, quantity) VALUES (?, ?)
    ON CONFLICT(product_id) DO UPDATE SET quantity = MIN(quantity + excluded.quantity, 99)
  `).run(productId, quantity);
  return getCartItems();
}

export function changeCartQuantity(productId, quantity) {
  const result = db.prepare(
    "UPDATE cart_items SET quantity = ? WHERE product_id = ?",
  ).run(quantity, productId);
  return result.changes > 0 ? getCartItems() : null;
}

export function removeCartItem(productId) {
  const result = db.prepare("DELETE FROM cart_items WHERE product_id = ?").run(productId);
  return result.changes > 0 ? getCartItems() : null;
}
