import { pool } from "../../../lib/db";
import { NextResponse } from "next/server";

// GET method untuk mengambil daftar subkriteria
export async function GET(req) {
  const [rows] = await pool.query(`
    SELECT 
        k.id,
        k.kode_kriteria,
        k.nama_kriteria,
        JSON_ARRAYAGG(
            JSON_OBJECT(
                'id', s.id,
                'subkriteria', s.subkriteria,
                'bobot', s.bobot
            ) ORDER BY s.bobot ASC
        ) AS subkriteria_array
    FROM subkriteria s
    JOIN kriteria k 
        ON s.kode_kriteria = k.kode_kriteria
    GROUP BY k.kode_kriteria, k.nama_kriteria
    ORDER BY k.kode_kriteria;
  `);

  // Parse kolom JSON sebelum dikirim ke client
  const data = rows.map((row) => ({
    ...row,
    subkriteria_array: JSON.parse(row.subkriteria_array),
  }));

  return NextResponse.json({
    status: true,
    code: 200,
    message: "Data subkriteria",
    data,
  });
}
