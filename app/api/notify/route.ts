import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const FILE = path.join(process.cwd(), "data", "pending-notifies.json");

export async function POST(req: NextRequest) {
  try {
    const { email, calculator } = await req.json();
    if (!email || !calculator) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    let existing: unknown[] = [];
    try {
      existing = JSON.parse(await fs.readFile(FILE, "utf8"));
    } catch {}

    existing.push({ email, calculator, signedUpAt: new Date().toISOString() });
    await fs.writeFile(FILE, JSON.stringify(existing, null, 2));

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
