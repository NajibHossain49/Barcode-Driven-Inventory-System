/* eslint-disable @typescript-eslint/no-explicit-any */
// This file handles the API routes for categories in a Next.js application.
import { getDb } from "@/app/lib/mongodb";
import { Category } from "@/app/lib/types";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const db = await getDb();
    const categories = await db
      .collection<Category>("categories")
      .find({})
      .toArray();
    return NextResponse.json(categories);
  } catch (error: any) {
    console.error("GET /api/categories error:", error.message, error.stack);
    return NextResponse.json(
      { error: "Failed to fetch categories", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const db = await getDb();
    const { name } = await request.json();

    const result = await db
      .collection<Category>("categories")
      .insertOne({ name });
    return NextResponse.json({ _id: result.insertedId, name });
  } catch (error: any) {
    console.error("POST /api/categories error:", error.message, error.stack);
    return NextResponse.json(
      { error: "Failed to create category", details: error.message },
      { status: 500 }
    );
  }
}
