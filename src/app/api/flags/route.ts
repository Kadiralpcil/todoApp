import { connectMongoDB } from "@/libs/mongoDb";
import flagType from "@/models/flag";
import { NextResponse } from "next/server";

export async function GET() {
  await connectMongoDB();
  const flags = await flagType.find();
  return NextResponse.json({ flags });
}
