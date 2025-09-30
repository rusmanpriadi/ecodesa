import { pool } from "@/lib/db";
import { NextResponse } from "next/server";


// GET riwayat user sesuai id_user (ambil dari query param ?id_user=)
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id_user = searchParams.get("id_user");

    if (!id_user) {
      return NextResponse.json({
        status: false,
        message: "id_user wajib dikirim di query param (?id_user=)",
      });
    }

    const [rows] = await pool.query(
      `
  SELECT u.id AS id_user, u.name AS nama,
    i.id AS id_kodeinput, i.kode_input,
    r.id AS id_riwayat, r.hasil, r.persen, r.tanggal
FROM input_kriteria i
JOIN users u ON i.id_user = u.id
JOIN riwayat r ON i.kode_input = r.kode_input
WHERE u.id = 4
GROUP BY i.kode_input

  `,
      [id_user]
    );

    return NextResponse.json({ status: true, data: rows });
  } catch (error) {
    console.error("Error get riwayat:", error);
    return NextResponse.json({ status: false, message: error.message });
  }
}


export async function POST(req) {
    try {
        const {  hasil, persen, kode_input } = await req.json();
        const [rows] = await pool.query("INSERT INTO riwayat ( hasil, persen, kode_input, tanggal) VALUES (?, ?, ?, NOW())", [ hasil, persen, kode_input, NOW()]);
        return NextResponse.json({ status: true, data: { id: rows.insertId,  hasil, persen, kode_input, tanggal } });
    } catch (error) {
        return NextResponse.json({ status: false, message: error.message });
    }
}