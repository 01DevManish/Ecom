import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { schema, site_id = "quirkyhome" } = body;

    if (!schema) {
      return NextResponse.json({ error: "Missing schema" }, { status: 400 });
    }

    // Save the schema to the database
    await query(
      `INSERT INTO builder_pages (id, site_id, schema_json, updated_at)
       VALUES ('main', $1, $2, now())
       ON CONFLICT (id, site_id)
       DO UPDATE SET schema_json = EXCLUDED.schema_json, updated_at = now()`,
      [site_id, JSON.stringify(schema)]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to save builder schema:", error);
    return NextResponse.json({ error: "Failed to save schema" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const site_id = searchParams.get("site_id") || "quirkyhome";

    const result = await query(
      "SELECT schema_json FROM builder_pages WHERE id = 'main' AND site_id = $1 LIMIT 1",
      [site_id]
    );

    if (result.rows.length > 0 && result.rows[0].schema_json) {
      return NextResponse.json({ schema: result.rows[0].schema_json });
    }

    return NextResponse.json({ schema: null });
  } catch (error) {
    console.error("Failed to fetch builder schema:", error);
    return NextResponse.json({ error: "Failed to fetch schema" }, { status: 500 });
  }
}
