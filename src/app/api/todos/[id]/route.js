import { connectMongoDB } from "@/libs/mongoDb";
import Todo from "@/models/todo";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request, { params }) {
  const { id } = params;
  const body = await request.json();

  await connectMongoDB();
  try {
    await Todo.findByIdAndUpdate(id, {
      title: body.newTitle,
      completed: body.newCompleted,
      flag: body.newFlag,
    });

    return NextResponse.json({ message: "updated" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
