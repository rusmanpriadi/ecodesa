import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ message: "Logout berhasil" });

  // hapus cookie
  res.cookies.set("token", "", { expires: new Date(0), path: "/" });
  res.cookies.set("id", "", { expires: new Date(0), path: "/" });
  res.cookies.set("level", "", { expires: new Date(0), path: "/" });

  return res;
}
