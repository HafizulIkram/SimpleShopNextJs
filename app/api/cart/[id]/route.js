import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { changeCartQuantity, removeCartItem } from "@/lib/db";
import { NextResponse } from "next/server";



// PUT /api/cart/14 changes the quantity.
export async function PUT(request, { params }) {
  if (!(await getServerSession(authOptions))) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  const { id } = await params;
  const productId = Number(id);
  if (!Number.isSafeInteger(productId) || productId < 1) {
    return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
  }

  let data;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ error: "Send JSON" }, { status: 400 });
  }
  if (!Number.isSafeInteger(data?.quantity) || data.quantity < 1 || data.quantity > 99) {
    return NextResponse.json({ error: "Quantity must be 1 to 99" }, { status: 400 });
  }

  const cart = changeCartQuantity(productId, data.quantity);
  if (!cart) return NextResponse.json({ error: "Cart item not found" }, { status: 404 });
  return NextResponse.json(cart);
}

// DELETE /api/cart/14 removes the row.
export async function DELETE(request, { params }) {
  if (!(await getServerSession(authOptions))) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  const { id } = await params;
  const productId = Number(id);
  if (!Number.isSafeInteger(productId) || productId < 1) {
    return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
  }

  const cart = removeCartItem(productId);
  if (!cart) return NextResponse.json({ error: "Cart item not found" }, { status: 404 });
  return NextResponse.json(cart);
}
