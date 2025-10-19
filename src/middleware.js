import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = req.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.redirect(new URL('/auth', req.url));
  }
  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*"]
}
