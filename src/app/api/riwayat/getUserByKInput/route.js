import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const kode_input = searchParams.get("kode_input");

    if (!kode_input) {
      return NextResponse.json({
        status: false,
        message: "kode_input wajib dikirim di query param (?kode_input=)",
      });
    }

    const [rows] = await pool.query(
      `
      SELECT 
        u.id AS id_user,
        u.name AS nama_user,
        i.id AS id_kodeinput,
        i.kode_input,
        r.tanggal
        
        
      FROM input_kriteria i
      JOIN users u ON i.id_user = u.id
      JOIN riwayat r ON i.kode_input = r.kode_input
      WHERE i.kode_input = ?
      GROUP BY i.kode_input, u.name
      `,
      [kode_input]
    );

    if (rows.length === 0) {
      return NextResponse.json({
        status: false,
        message: `User dengan kode_input ${kode_input} tidak ditemukan`,
      });
    }

    return NextResponse.json({ status: true, data: rows });
  } catch (error) {
    console.error("Error get user by kode_input:", error);
    return NextResponse.json({ status: false, message: error.message });
  }
}
