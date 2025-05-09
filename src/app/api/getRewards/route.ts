// src/app/api/getRewards/route.ts
import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const studentId = searchParams.get("studentId");

  const filePath = path.join(process.cwd(), "public" ,"reward_log.json");
  const data = await readFile(filePath, "utf-8");
  const allRewards = JSON.parse(data);

  const rewards = studentId
    ? allRewards.filter((r: any) => r.studentId === studentId)
    : allRewards;

  return NextResponse.json(rewards);
}
