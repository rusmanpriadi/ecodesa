import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  const [rows] = await pool.query("SELECT * FROM alternatif");
  return NextResponse.json({
    status: true,
    code: 200,
    message: "Data alternatif",
    data: rows,
  });
}

export async function POST(req) {
  try {
    const { kode_alternatif, pupuk, deskripsi } = await req.json();

    console.log(kode_alternatif, pupuk, deskripsi);
    // Validasi input
    if (!kode_alternatif || !pupuk) {
      return NextResponse.json({
        status: false,
        code: 400,
        message: "Kode alternatif dan nama alternatif harus diisi",
      }, { status: 400 });
    }

    // Validasi format kode alternatif
    if (!/^A\d{2}$/.test(kode_alternatif)) {
      return NextResponse.json({
        status: false,
        code: 400,
        message: "Format kode alternatif tidak valid. Gunakan format A01, A02, dst.",
      }, { status: 400 });
    }

    const [rows] = await pool.query(
        "INSERT INTO alternatif (kode_alternatif, pupuk, deskripsi) VALUES (?, ?, ?)",
        [kode_alternatif, pupuk, deskripsi]
    );
    return NextResponse.json({ status: true, code: 201, message: "alternatif created successfully", data: { id: rows.insertId, kode_alternatif, pupuk, deskripsi } });
  } catch (error) {
    return NextResponse.json(
        { status: false, code: 500, message: "Error creating alternatif", error: error.message },
        { status: 500 }
    )
  }
}
