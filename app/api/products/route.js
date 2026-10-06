import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { createProduct, getAllProducts } from "@/lib/db";
import { NextResponse } from "next/server";



// GET /api/products: read SQLite products after checking the session.
export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const query = new URL(request.url).searchParams.get("q")?.toLowerCase() || "";
  const products = getAllProducts().filter((product) => product.title.toLowerCase().includes(query));
  return NextResponse.json(products, {
    headers: { "Cache-Control": "no-store" },
  });
}

// POST /api/products: only the signed-in admin can add a product.
export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  let product;
  try {
    product = await request.json();
  } catch {
    return NextResponse.json({ error: "Send JSON" }, { status: 400 });
  }

  if (
    typeof product?.title !== "string" || !product.title.trim() ||
    typeof product?.description !== "string" ||
    typeof product?.price !== "number" || !Number.isFinite(product.price) || product.price < 0
  ) {
    return NextResponse.json({ error: "Enter a name, description, and valid price" }, { status: 400 });
  }

  return NextResponse.json(createProduct(product), { status: 201 });
}
