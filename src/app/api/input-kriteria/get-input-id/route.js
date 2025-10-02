import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const kode_input = searchParams.get("kode_input"); // pakai kode_input sesuai tabel

    let sql = `
      SELECT 
        ik.id,
        ik.kode_input,
        ik.id_user,
        u.name AS nama_user,
        k.nama_kriteria,
        k.kode_kriteria,
        s.subkriteria as nama_subkriteria,
        ik.bobot
      FROM input_kriteria ik
      LEFT JOIN users u ON ik.id_user = u.id
      LEFT JOIN kriteria k ON ik.kode_kriteria = k.kode_kriteria
      LEFT JOIN subkriteria s ON ik.id_subkriteria = s.id
    `;

    let values = [];

    if (kode_input) {
      sql += " WHERE ik.kode_input = ?";
      values.push(kode_input);
    }

    const [rows] = await pool.query(sql, values);

    if (kode_input && rows.length === 0) {
      return NextResponse.json({
        status: false,
        message: `Data dengan kode_input ${kode_input} tidak ditemukan`,
      });
    }

    return NextResponse.json({ status: true, data: kode_input ? rows : rows });
  } catch (error) {
    return NextResponse.json({ status: false, message: error.message });
  }
}
