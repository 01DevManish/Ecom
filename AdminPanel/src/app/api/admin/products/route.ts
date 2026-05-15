import { NextRequest, NextResponse } from "next/server";
import { listAdminProducts } from "@/lib/admin-products";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const site_id = searchParams.get("site_id") || "quirkyhome";
    
    // In a multi-tenant setup, listAdminProducts should ideally filter by site_id.
    // For now, we fetch what's available in the DB.
    const products = await listAdminProducts();
    
    return NextResponse.json(products);
  } catch (error) {
    console.error("Failed to fetch products for builder:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
