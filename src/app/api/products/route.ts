// This file handles product-related API requests, including fetching and adding products.
import { getDb } from "@/app/lib/mongodb";
import { Product } from "@/app/lib/types";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    const db = await getDb();
    const query = category ? { category } : {};
    const products = await db
      .collection<Product>("products")
      .find(query)
      .toArray();

    return NextResponse.json(products);
  } catch (error: any) {
    console.error("GET /api/products error:", error.message, error.stack);
    return NextResponse.json(
      { error: "Failed to fetch products", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const db = await getDb();
    const product: Product = await request.json();

    const result = await db.collection<Product>("products").insertOne({
      ...product,
      category: product.category || "Uncategorized",
    });

    return NextResponse.json({ _id: result.insertedId, ...product });
  } catch (error: any) {
    console.error("POST /api/products error:", error.message, error.stack);
    return NextResponse.json(
      { error: "Failed to add product", details: error.message },
      { status: 500 }
    );
  }
}
