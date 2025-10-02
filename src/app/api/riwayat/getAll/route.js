import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    // Ambil semua riwayat beserta data user
    const [rows] = await pool.query(
      `
      SELECT 
        r.id AS id_riwayat,
        r.hasil,
        r.persen,
        r.tanggal,
        i.id AS id_kodeinput,
        i.kode_input,
        i.id_user,
        u.name AS nama_user
      FROM riwayat r
      JOIN input_kriteria i ON r.kode_input = i.kode_input
      JOIN users u ON i.id_user = u.id
      GROUP BY i.kode_input
      ORDER BY r.tanggal DESC
      `
    );

    return NextResponse.json({ status: true, data: rows });
  } catch (error) {
    console.error("Error get semua riwayat:", error);
    return NextResponse.json({ status: false, message: error.message });
  }
}
