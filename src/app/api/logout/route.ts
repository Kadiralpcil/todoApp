"use server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  await cookies().delete("token");
  await cookies().delete("userId");
  await cookies().delete("username");

  return NextResponse.json({ success: true });
}
