import { NextRequest, NextResponse } from "next/server";
import { verifyJwtToken } from "./libs/auth";

const AUTH_PAGES = ["/login", "/"];

const isAuthPages = (pathName: string) => {
  return AUTH_PAGES.some((page) => page.startsWith(pathName));
};

export async function middleware(request: NextRequest) {
  const { url, nextUrl, cookies } = request;

  const { value: token } = cookies.get("token") ?? { value: null };

  const hasVerifiedToken = token && (await verifyJwtToken(token));

  const isAuthPageRequested = isAuthPages(nextUrl.pathname);

  if (isAuthPageRequested) {
    if (!hasVerifiedToken) {
      return NextResponse.next();
    }
    const response = NextResponse.redirect(new URL("/todos", url));
    return response;
  }

  if (!hasVerifiedToken) {
    return NextResponse.redirect(new URL("/login", url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/todos", "/login", "/"],
};
