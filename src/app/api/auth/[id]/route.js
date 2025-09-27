

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {pool} from "@/lib/db"; // Sesuaikan dengan path database Anda


export async function GET(req, context) {
  try {
    const { id } = await context.params;
   
    if (!id) {
      return NextResponse.json({ message: "ID user harus disediakan" }, { status: 400 });
    }

    const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
    if (rows.length === 0) {
      return NextResponse.json({ message: "User tidak ditemukan" }, { status: 404 });
    }

    const user = rows[0];
    return NextResponse.json({ status: true, code: 200, message: "Data user", data: user });
  } catch (error) {
    return NextResponse.json({ status: false, code: 500, message: "Error getting user", error: error.message });
  }
}