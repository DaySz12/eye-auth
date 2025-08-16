// middleware.js
import { NextResponse } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

export async function middleware(req) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Protected routes that need authentication
  const protectedRoutes = ["/dashboard", "/iris-scan"];
  const isProtectedRoute = protectedRoutes.some(route => 
    req.nextUrl.pathname.startsWith(route)
  );

  // ถ้าไม่มี session และพยายามเข้า protected route → redirect ไป login
  if (!session && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // ถ้ามี session และอยู่ที่หน้า login/register → redirect ไป dashboard
  if (session && (req.nextUrl.pathname === "/login" || req.nextUrl.pathname === "/register")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return res;
}

// กำหนด path ที่ middleware จะทำงาน
export const config = {
  matcher: ["/dashboard/:path*", "/iris-scan/:path*", "/login", "/register"],
};