import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("token")?.value;
  const level = req.cookies.get("level")?.value;
  const { pathname } = req.nextUrl;

  // 🚫 Belum login → ke halaman login
  if (!token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // 🔒 Admin only
  if (pathname.startsWith("/admin") && level !== "admin") {
    if (level === "petani") {
      return NextResponse.redirect(new URL("/petani/dashboard", req.url));
    }
    return NextResponse.redirect(new URL("/", req.url)); // fallback
  }

  // 🔒 Petani only
  if (pathname.startsWith("/petani") && level !== "petani") {
    if (level === "admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
    return NextResponse.redirect(new URL("/", req.url)); // fallback
  }

  // ✅ Jika sesuai role
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/petani/:path*",
  ],
};
