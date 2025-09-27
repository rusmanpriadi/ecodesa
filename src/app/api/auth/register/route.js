import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { pool } from "@/lib/db"; // Sesuaikan dengan path database Anda

export async function POST(req) {

  try {
    const { name, password, email } =
      await req.json();

    // Validasi input
    if ((!name || !password, !email)) {
      return NextResponse.json(
        { message: "Semua field harus diisi" },
        { status: 400 }
      )
    }

    // Validasi password minimal 6 karakter
    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password minimal 6 karakter" },
        { status: 400 }
      );
    }

    // Cek apakah NIK sudah terdaftar
    const [existingUsers] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (existingUsers.length > 0) {
      return NextResponse.json(
        { message: "email sudah terdaftar" },
        { status: 409 }
      );
    }
    const level = "petani"; // Default level

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert user baru
    const [result] = await pool.query(
      `INSERT INTO users (name, email, password, level) 
       VALUES (?, ?, ?, 'petani')`,
      [name, email,  hashedPassword, level]
    );

    if (result.affectedRows === 1) {
      return NextResponse.json({
        status: true,
        code: 201,
        message: "Registrasi berhasil",
        data: {
          user: {
            id: result.insertId,
            name,
            email,
          
            level: "petani",
          },
        },
      });
    } else {
      return NextResponse.json(
        { message: "Gagal mendaftarkan user" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Register error:", error);

    // Handle duplicate entry error
    if (error.code === "ER_DUP_ENTRY") {
      return NextResponse.json(
        { message: "Email sudah terdaftar" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
