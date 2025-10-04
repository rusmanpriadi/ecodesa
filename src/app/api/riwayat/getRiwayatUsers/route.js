import { pool } from "@/lib/db";
import { NextResponse } from "next/server";


export async function GET(req) {
  const [rows] = await pool.query(`
     SELECT DISTINCT
      r.id AS id_riwayat,
      r.hasil,
      r.persen,
      r.tanggal,
      i.kode_input,
      i.id_user,
      u.name AS nama_user
    FROM riwayat r
    JOIN input_kriteria i ON r.kode_input = i.kode_input
    JOIN users u ON i.id_user = u.id
    INNER JOIN (
      SELECT i2.id_user, MAX(r2.tanggal) AS latest_date
      FROM riwayat r2
      JOIN input_kriteria i2 ON r2.kode_input = i2.kode_input
      GROUP BY i2.id_user
    ) latest 
      ON latest.id_user = u.id 
      AND latest.latest_date = r.tanggal
    ORDER BY r.tanggal DESC
  `);

  return NextResponse.json({
    status: true,
    code: 200,
    message: "Riwayat terakhir setiap user",
    data: rows,
  });
}
