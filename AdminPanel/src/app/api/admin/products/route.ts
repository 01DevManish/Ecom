import { NextRequest, NextResponse } from "next/server";
import { listAdminProducts } from "@/lib/admin-products";
import { query } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const site_id = searchParams.get("site_id") || "quirkyhome";
    if (id) {
      const product = await query<{ id: string; title: string; slug: string; image_url: string | null }>(
        `select p.id, p.title, p.slug, pi.image_url
         from products p
         left join product_images pi on pi.product_id = p.id and pi.sort_order = 0
         where p.id = $1
         limit 1`,
        [id],
      );
      if (product.rows.length === 0) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
      }
      const galleryRows = await query<{ image_url: string }>(
        `select image_url
         from product_images
         where product_id = $1
         order by sort_order asc nulls last, created_at asc`,
        [id],
      );
      return NextResponse.json({
        ...product.rows[0],
        gallery_images: galleryRows.rows.map((r) => r.image_url).filter(Boolean),
      });
    }

    const products = await listAdminProducts();
    
    return NextResponse.json(products);
  } catch (error) {
    console.error("Failed to fetch products for builder:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const id = typeof body?.id === "string" ? body.id : "";
    const images = Array.isArray(body?.images) ? body.images : [];
    const cleaned = Array.from(
      new Set(images.map((value: unknown) => (typeof value === "string" ? value.trim() : "")).filter(Boolean)),
    ).slice(0, 10);

    if (!id) {
      return NextResponse.json({ error: "Product id is required" }, { status: 400 });
    }
    if (cleaned.length === 0) {
      return NextResponse.json({ error: "At least one image URL is required" }, { status: 400 });
    }

    const productResult = await query<{ id: string }>("select id from products where id = $1 limit 1", [id]);
    if (productResult.rows.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const variantResult = await query<{ id: string }>(
      `select id from product_variants
       where product_id = $1
       order by created_at asc
       limit 1`,
      [id],
    );
    const variantId = variantResult.rows[0]?.id || null;

    await query("delete from product_images where product_id = $1", [id]);
    for (let i = 0; i < cleaned.length; i++) {
      await query(
        `insert into product_images (product_id, variant_id, image_url, alt_text, sort_order)
         values ($1, $2, $3, $4, $5)`,
        [id, variantId, cleaned[i], `Product image ${i + 1}`, i],
      );
    }

    return NextResponse.json({ ok: true, count: cleaned.length });
  } catch (error) {
    console.error("Failed to update product images:", error);
    return NextResponse.json({ error: "Failed to update product images" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const clearAll = searchParams.get("clearAll") === "1";

    if (clearAll) {
      await query("delete from products");
      return NextResponse.json({ ok: true, cleared: true });
    }
    if (!id) {
      return NextResponse.json({ error: "Product id is required" }, { status: 400 });
    }
    await query("delete from products where id = $1", [id]);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to delete product:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
