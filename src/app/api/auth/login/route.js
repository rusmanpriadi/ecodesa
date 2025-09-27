

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {pool} from "@/lib/db"; // Sesuaikan dengan path database Anda

// Helper function untuk mendapatkan maxAge dari token
function getMaxAge(token) {
  try {
    const decoded = jwt.decode(token);
    if (decoded && decoded.exp) {
      return decoded.exp - Math.floor(Date.now() / 1000);
    }
    return 24 * 60 * 60; // 1 hari default
  } catch (error) {
    return 24 * 60 * 60;
  }
}

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // Validasi input
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email dan password harus diisi" },
        { status: 400 }
      );
    }

    // Cek apakah input adalah email atau NIK
    let query;
    if (email.includes("@")) {
      // Jika berisi @, anggap sebagai email
      query = "SELECT * FROM users WHERE email = ?";
    } 
    const [rows] = await pool.query(query, [email]);

    if (rows.length === 0) {
      return NextResponse.json(
        { message: "User tidak ditemukan" },
        { status: 404 }
      );
    }

    const user = rows[0];
    

    // Verifikasi password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ message: "Password salah" }, { status: 401 });
    }

    // Buat JWT token
    const token = jwt.sign({ id: user.id, level: user.level }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Update token di database
    await pool.query("UPDATE users SET token = ? WHERE id = ?", [
      token,
      user.id,
    ]);
    const res = NextResponse.json({
        status: true,
        code: 200,
        message: "Login berhasil",
        data: {
            token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            level: user.level,
          },
        },
    });

     res.cookies.set("token", token, {
      httpOnly: true,  // ❗ tidak bisa diakses JS
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 hari
    });

    res.cookies.set("level", user.level, {
      path: "/",
      httpOnly: false, // boleh diakses JS
    });

    res.cookies.set("id", user.id, {
      path: "/",
      httpOnly: false,
    });

    return res;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
