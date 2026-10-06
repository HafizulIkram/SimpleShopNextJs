import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { deleteProduct, getProduct, updateProduct } from "@/lib/db";
import { NextResponse } from "next/server";



function readId(id) {
  const number = Number(id);
  return Number.isSafeInteger(number) && number > 0 ? number : null;
}

// GET /api/products/14
export async function GET(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const { id } = await params;
  const product = getProduct(readId(id));
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(product, { headers: { "Cache-Control": "no-store" } });
}

// PUT /api/products/14
export async function PUT(request, { params }) {
  if (!(await getServerSession(authOptions))) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  const { id } = await params;
  const productId = readId(id);
  if (!productId || !getProduct(productId)) return NextResponse.json({ error: "Not found" }, { status: 404 });

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

  return NextResponse.json(updateProduct(productId, product));
}

// DELETE /api/products/14
export async function DELETE(request, { params }) {
  if (!(await getServerSession(authOptions))) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  const { id } = await params;
  const productId = readId(id);
  if (!productId || !deleteProduct(productId)) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ deleted: true });
}
