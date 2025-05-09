import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  const data = await req.json();
  console.log("🎯 Reward Earned:", data);

  const filePath = path.join(process.cwd(),"public" ,"reward_log.json");

  try {
    const existing = fs.existsSync(filePath)
      ? JSON.parse(fs.readFileSync(filePath, "utf8"))
      : [];

    existing.push(data);

    fs.writeFileSync(filePath, JSON.stringify(existing, null, 2));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ Error saving reward log:", err);
    return NextResponse.json({ success: false, error: err }, { status: 500 });
  }
}
