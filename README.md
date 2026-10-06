# Simple Shop

A small Next.js store for learning routing, server and client components, authentication, SQLite, and CRUD. The JSX files contain the screens and components. API route handlers stay in `.js` files because they do not render JSX.

## Run it

Use **Node.js 24 or newer** for the built-in SQLite module.

```sh
npm install
npm run setup
npm run dev
```

Open http://localhost:3000. Without a session, the home page sends you to `/signin`. Use the demo username **trainer** and password **hands-on**. These hardcoded credentials are only for learning and must not be used for a real store.

`npm run setup` adds a random `NEXTAUTH_SECRET` to `.env.local`. Git ignores that file. You can also copy `.env.example` and supply your own secret.

## Pages and layouts

| URL | File | Purpose |
| --- | --- | --- |
| `/` | `app/page.jsx` | Shop products stored in SQLite |
| `/products/14` | `app/products/[id]/page.jsx` | Product detail; `[id]` is dynamic routing |
| `/cart` | `app/cart/page.jsx` | Cart list from SQLite |
| `/search` | `app/search/page.jsx` | Browser fetch from the product API |
| `/admin` | `app/admin/page.jsx` | Create, edit, and delete products |
| `/signin` | `app/signin/page.jsx` | Demo sign-in |
| `/cached-products` | `app/cached-products/page.jsx` | Cached fetch from DummyJSON |
| `/new-arrivals` | `app/new-arrivals/page.jsx` | Fresh fetch from DummyJSON |

`app/layout.jsx` wraps every page with `SessionProviderWrapper.jsx` and the header. `app/products/layout.jsx` checks the session and adds a back link around product detail pages. Other shop pages also call `getServerSession(authOptions)` on the server and send unsigned visitors to `/signin`.

## How the cart works

1. Click a product card to open its detail page.
2. Enter a quantity in `components/CartForm.jsx` and submit **Add to cart**.
3. The form sends `POST /api/cart`. That route calls `addCartItem()` in `lib/db.js`, which runs a SQLite `INSERT`.
4. `/cart` reads the saved rows and passes plain objects to `components/CartList.jsx`.
5. The list uses `PUT /api/cart/[id]` to change quantity and `DELETE /api/cart/[id]` to remove an item.

The file `data/shop.sqlite` stores both products and cart items. The app creates it and seeds six products on first run. Git ignores the file. This demo has one trainer account and one cart. The cart remains after refreshing the browser.

## API routes

The product routes are `app/api/products/route.js` and `app/api/products/[id]/route.js`. The cart routes are `app/api/cart/route.js` and `app/api/cart/[id]/route.js`.

| Method | URL | Action |
| --- | --- | --- |
| `GET` | `/api/products` | List products; `?q=lamp` searches names |
| `GET` | `/api/products/14` | Get one product |
| `POST` | `/api/products` | Create a product |
| `PUT` | `/api/products/14` | Change a product |
| `DELETE` | `/api/products/14` | Delete a product |
| `GET` | `/api/cart` | List cart rows |
| `POST` | `/api/cart` | Insert a cart row |
| `PUT` | `/api/cart/14` | Change quantity for product 14 |
| `DELETE` | `/api/cart/14` | Remove product 14 from cart |

Every API method calls `getServerSession(authOptions)` and returns `401` without a session. `lib/auth.js` defines the single demo user and exports `authOptions`. `app/api/auth/[...nextauth]/route.js` passes those options to NextAuth.

The product POST and PUT routes accept JSON like:

```json
{ "title": "Wooden Chair", "description": "A dining chair", "price": 59.99 }
```

The cart POST route accepts:

```json
{ "productId": 14, "quantity": 2 }
```

## Fetching examples

- `app/cached-products/page.jsx` calls `getProducts("force-cache")`: a cached server fetch from DummyJSON. The page still checks the session on each request.
- `app/new-arrivals/page.jsx` calls `getProducts("no-store")`: a fresh server fetch from DummyJSON.
- These API pages need DummyJSON to be available; they no longer use local fallback products.
- `components/Search.jsx` calls `fetch("/api/products?q=...")` in the browser after you submit a search: a client fetch.
- `app/page.jsx` reads SQLite on the server so shop product edits show up immediately.

The cart has no payment or checkout. SQLite is a local file; deployment requires persistent storage or a hosted database.

Run `npm run lint` and `npm run build` to check the project.
