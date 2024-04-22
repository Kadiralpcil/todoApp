"use server";

import { cookies } from "next/headers";

export default async function Logout() {
  await cookies().delete("token");
  await cookies().delete("userId");
  await cookies().delete("username");
}
