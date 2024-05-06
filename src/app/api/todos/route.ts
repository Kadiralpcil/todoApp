import { connectMongoDB } from "@/libs/mongoDb";
import Todo from "@/models/todo";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  await connectMongoDB();

  try {
    const newTodo = await Todo.create({
      userId: cookies().get("userId")?.value ?? 0,
      title: body.title,
      completed: false,
      deleted: false,
      flag: body.flag,
      img: body.imageUrl,
      file: body.fileUrl,
    });

    const todoId = newTodo._id;

    return NextResponse.json(
      {
        success: true,
        message: "Todo created successfully",
        todo: {
          _id: todoId,
          userId: newTodo.userId,
          title: newTodo.title,
          completed: newTodo.completed,
          deleted: newTodo.deleted,
          flag: newTodo.flag,
          img: newTodo.img,
          file: newTodo.file,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Hata:", error);
    return NextResponse.json(
      { success: false, message: error },
      { status: 401 },
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
