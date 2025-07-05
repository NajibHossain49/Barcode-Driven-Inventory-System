/* eslint-disable @typescript-eslint/no-explicit-any */
// This file handles the API route for analytics in a Next.js application.
// Description: It fetches the count of products per category and the 5 most recent products from the MongoDB database.
import { getDb } from "@/app/lib/mongodb";
import { Product } from "@/app/lib/types";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const db = await getDb();

    // Count products per category
    const categoryCounts = await db
      .collection<Product>("products")
      .aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $project: { category: "$_id", count: 1, _id: 0 } },
      ])
      .toArray();

    // Get 5 most recent products
    const recentProducts = await db
      .collection<Product>("products")
      .find()
      .sort({ _id: -1 }) // Sort by _id descending (most recent first)
      .limit(5)
      .toArray();

    return NextResponse.json({
      categoryCounts,
      recentProducts,
    });
  } catch (error: any) {
    console.error("GET /api/analytics error:", error.message, error.stack);
    return NextResponse.json(
      { error: "Failed to fetch analytics", details: error.message },
      { status: 500 }
    );
  }
}
