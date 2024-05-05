import { connectMongoDB } from "@/libs/mongoDb";
import Todo from "@/models/todo";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request, { params }) {
  const { id } = params;
  const body = await request.json();
  const { newTitle, newCompleted, newFlag, newFileUrl, newImageUrl } = body;

  await connectMongoDB();
  try {
    // `findByIdAndUpdate` ile Todo'yu güncelle ve yeni veriyi al
    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      {
        title: newTitle,
        completed: newCompleted,
        flag: newFlag,
        img: newImageUrl,
        file: newFileUrl,
      },
      { new: true }, // `new: true` kullanarak güncellenmiş belgeyi döndür
    );

    if (!updatedTodo) {
      return NextResponse.json({ message: "Todo not found" }, { status: 404 });
    }

    // Güncellenmiş Todo'yu yanıt olarak döndür
    return NextResponse.json(
      { message: "Todo updated successfully", todo: updatedTodo },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
