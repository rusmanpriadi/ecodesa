import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req, context) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({
        status: false,
        code: 400,
        message: "User ID tidak ditemukan",
      });
    }

    const [rows] = await pool.query(
      `SELECT 
        r.id,
        r.hasil,
        r.persen,
        r.kode_input,
        r.tanggal,
        pi.kode_input as input_kode,
        pi.id_user,
        pi.id_subkriteria,
        pi.kode_kriteria,
        pi.bobot
      FROM riwayat r
      LEFT JOIN input_kriteria pi ON r.kode_input = pi.kode_input
      WHERE r.id_user = ?
      ORDER BY r.tanggal DESC`,
      [id]
    );

    return NextResponse.json({
      status: true,
      code: 200,
      message: "Riwayat user ditemukan",
      total: rows.length,
      data: rows,
    });
  } catch (error) {
    console.error('Error fetching history:', error);
    return NextResponse.json({
      status: false,
      code: 500,
      message: "Gagal mengambil data riwayat",
      error: error.message,
    });
  }
}