import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req,context) {
 
      const { id } = await context.params; // ambil dari URL
 

  if (!id) {
    return NextResponse.json({
      status: false,
      code: 400,
      message: "User ID tidak ditemukan",
    });
  }

  try {
    const [rows] = await pool.query(
      `SELECT * FROM riwayat WHERE id = ? ORDER BY tanggal DESC`,
      [id]
    );

    return NextResponse.json({
      status: true,
      code: 200,
      message: "Riwayat user ditemukan",
      data: rows,
    });
  } catch (error) {
    return NextResponse.json({
      status: false,
      code: 500,
      message: "Gagal mengambil data riwayat",
      error: error.message,
    });
  }
}
