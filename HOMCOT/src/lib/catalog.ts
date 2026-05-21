import type { Product } from "@/data/products";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4002/api";

export async function getCatalogProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${API_URL}/products?site_id=homcot`, {
      next: { revalidate: 60 }
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function getCatalogProduct(slug: string): Promise<Product | null> {
  try {
    const res = await fetch(`${API_URL}/products/single?slug=${encodeURIComponent(slug)}`);
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

