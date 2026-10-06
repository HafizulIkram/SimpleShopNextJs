import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { addCartItem, getCartItems, getProduct } from "@/lib/db";
import { NextResponse } from "next/server";



// GET /api/cart reads the saved cart.
export async function GET() {
  if (!(await getServerSession(authOptions))) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  return NextResponse.json(getCartItems());
}

// POST /api/cart inserts a product and quantity into SQLite.
export async function POST(request) {
  if (!(await getServerSession(authOptions))) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  let data;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ error: "Send JSON" }, { status: 400 });
  }

  const { productId, quantity } = data || {};
  if (!Number.isSafeInteger(productId) || !Number.isSafeInteger(quantity) || quantity < 1 || quantity > 99) {
    return NextResponse.json({ error: "Choose a product and a quantity from 1 to 99" }, { status: 400 });
  }
  if (!getProduct(productId)) return NextResponse.json({ error: "Product not found" }, { status: 404 });

  return NextResponse.json(addCartItem(productId, quantity), { status: 201 });
}
