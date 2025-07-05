/* eslint-disable @typescript-eslint/no-explicit-any */
// This file handles API requests for product details and updates based on barcode.
import { getDb } from "@/app/lib/mongodb";
import { Product } from "@/app/lib/types";
import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  context: { params: Promise<{ barcode: string }> }
) {
  try {
    const { barcode } = await context.params; // Await params to resolve the promise
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/product/${barcode}`
    );
    const productData = response.data.product; // Adjust based on external API response structure
    const db = await getDb();
    const existingProduct = await db
      .collection<Product>("products")
      .findOne({ barcode });

    if (!existingProduct) {
      const product: Product = {
        barcode,
        name: productData.description || "Unknown Product", // Use description as name
        description: productData.description || "",
        price: productData.price || 0, // Default to 0 if price is missing
        category: "Uncategorized",
      };
      await db.collection<Product>("products").insertOne(product);
    }

    return NextResponse.json(productData);
  } catch (error: any) {
    console.error(
      "GET /api/products/[barcode] error:",
      error.message,
      error.stack
    );
    return NextResponse.json(
      { error: "Failed to fetch product", details: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ barcode: string }> }
) {
  try {
    const { barcode } = await context.params; // Await params
    const { category } = await request.json();
    const db = await getDb();
    const result = await db
      .collection<Product>("products")
      .updateOne({ barcode }, { $set: { category } });

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ barcode, category });
  } catch (error: any) {
    console.error(
      "PATCH /api/products/[barcode] error:",
      error.message,
      error.stack
    );
    return NextResponse.json(
      { error: "Failed to update product", details: error.message },
      { status: 500 }
    );
  }
}
