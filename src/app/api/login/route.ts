import { getSecretKey } from "@/libs/auth";
import { connectMongoDB } from "@/libs/mongoDb";
import Login from "@/models/login";
import { SignJWT } from "jose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  await connectMongoDB();
  if (body.type === "signUp") {
    try {
      const newUser = await Login.create({
        username: body.username,
        password: body.password,
      });

      const userId = newUser._id;

      return NextResponse.json(
        {
          success: true,
          message: "User created successfully",
          todo: {
            _id: userId,
            userName: newUser.userName,
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
  } else {
    try {
      const existingUser = await Login.findOne({
        username: body.username,
        password: body.password,
      });

      if (!existingUser) {
        return NextResponse.json(
          { success: false, message: "username or password is not valid" },
          { status: 401 },
        );
      }

      const token = await new SignJWT({
        userName: body.name,
      })
        .setProtectedHeader({
          alg: "HS256",
        })
        .setIssuedAt()
        .setExpirationTime("2h")
        .sign(getSecretKey());

      const response = NextResponse.json(
        {
          success: true,
          token,
          username: existingUser.username,
          userId: existingUser._id,
        },
        { status: 200 },
      );
      response.cookies.set({
        name: "token",
        value: token,
        path: "/",
      });
      response.cookies.set({
        name: "userId",
        value: existingUser._id,
        path: "/",
      });
      response.cookies.set({
        name: "username",
        value: existingUser.username,
        path: "/",
      });

      return response;
    } catch (error) {
      console.error("Hata:", error);
      return NextResponse.json(
        { success: false, message: "Sunucu hatası" },
        { status: 500 },
      );
    }
  }
}
