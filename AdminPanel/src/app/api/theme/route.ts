import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const THEME_FILE = path.resolve(process.cwd(), "..", "theme-config.json");

function readConfig() {
  try {
    const raw = fs.readFileSync(THEME_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return { activePreset: "vibrant-sunshine", customOverrides: {} };
  }
}

function writeConfig(config: Record<string, unknown>) {
  fs.writeFileSync(THEME_FILE, JSON.stringify(config, null, 2), "utf-8");
}

/** GET /api/theme — Read current theme config */
export async function GET() {
  const config = readConfig();
  return NextResponse.json(config);
}

/** PUT /api/theme — Save theme config */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const config = readConfig();

    if (body.activePreset) {
      config.activePreset = body.activePreset;
    }
    if (body.customOverrides !== undefined) {
      config.customOverrides = body.customOverrides;
    }

    writeConfig(config);
    return NextResponse.json({ ok: true, ...config });
  } catch (err) {
    return NextResponse.json({ ok: false, error: "Failed to save" }, { status: 500 });
  }
}
