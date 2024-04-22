import { connectMongoDB } from "@/libs/mongoDb";
import Todo from "@/models/todo";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  await connectMongoDB();

  try {
    await Todo.create({
      userId: cookies().get("userId")?.value ?? 0,
      title: body.title,
      completed: false,
      deleted: false,
      flag: null,
    });

    return NextResponse.json(
      { success: true, message: "Todo created successfully" },
      { status: 201 },
    );
  } catch (error) {
    console.error("Hata:", error);
    return NextResponse.json(
      { success: false, message: error },
      { status: 500 },
    );
  }
}

export async function GET() {
  await connectMongoDB();
  const todos = await Todo.find({ userId: cookies().get("userId")?.value });
  return NextResponse.json({ todos });
}

export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  await connectMongoDB();
  await Todo.findByIdAndDelete(id);
  return NextResponse.json(
    {
      success: true,
      messege: "deleted",
    },
    {
      status: 200,
    },
  );
}
