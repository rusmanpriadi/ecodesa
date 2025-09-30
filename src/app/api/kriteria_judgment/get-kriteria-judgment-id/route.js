// File: /api/kriteria-judgment/route.js
import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    // ambil query param kode_input
    const { searchParams } = new URL(req.url);
    const kode_input = searchParams.get("kode_input");

    if (!kode_input) {
      return NextResponse.json({
        status: false,
        message: "kode_input diperlukan",
      });
    }

    const [rows] = await pool.query(
      `SELECT * FROM kriteria_judgment WHERE kode_input = ?`,
      [kode_input]
    );

    return NextResponse.json({ status: true, data: rows });
  } catch (error) {
    return NextResponse.json({ status: false, message: error.message });
  }
}