import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  const [rows] = await pool.query("SELECT * FROM kriteria");
  return NextResponse.json({
    status: true,
    code: 200,
    message: "Data kriteria",
    data: rows,
  });
}

export async function POST(req) {
  try {
    const { kode_kriteria, nama_kriteria, atribut, deskripsi } = await req.json();

    // Validasi input
    if (!kode_kriteria || !nama_kriteria || !atribut === undefined) {
      return NextResponse.json({
        status: false,
        code: 400,
        message: "Kode kriteria, nama kriteria, atribut harus diisi",
      }, { status: 400 });
    }

    // Validasi format kode kriteria
    if (!/^K\d{2}$/.test(kode_kriteria)) {
      return NextResponse.json({
        status: false,
        code: 400,
        message: "Format kode kriteria tidak valid. Gunakan format K01, K02, dst.",
      }, { status: 400 });
    }

   

    // Validasi atribut
    if (!['cost', 'benefit'].includes(atribut.toLowerCase())) {
      return NextResponse.json({
        status: false,
        code: 400,
        message: "Atribut harus 'cost' atau 'benefit'",
      }, { status: 400 });
    }

    // Cek duplikasi kode kriteria
    const [existingCode] = await pool.query(
      "SELECT kode_kriteria FROM kriteria WHERE kode_kriteria = ?",
      [kode_kriteria]
    );

    if (existingCode.length > 0) {
      return NextResponse.json({
        status: false,
        code: 409,
        message: "Kode kriteria sudah ada. Silakan gunakan kode lain.",
      }, { status: 409 });
    }

    // Cek duplikasi nama kriteria
    const [existingName] = await pool.query(
      "SELECT nama_kriteria FROM kriteria WHERE nama_kriteria = ?",
      [nama_kriteria]
    );

    if (existingName.length > 0) {
      return NextResponse.json({
        status: false,
        code: 409,
        message: "Nama kriteria sudah ada. Silakan gunakan nama lain.",
      }, { status: 409 });
    }

    // Insert data
    const [result] = await pool.query(
      "INSERT INTO kriteria (kode_kriteria, nama_kriteria, atribut, deskripsi) VALUES (?, ?, ?, ?)",
      [kode_kriteria, nama_kriteria, atribut.toLowerCase(), deskripsi || ""]
    );

    // Return response dengan data lengkap
    const newKriteria = {
      id: result.insertId,
      kode_kriteria,
      nama_kriteria,
      atribut: atribut.toLowerCase(),
   
      deskripsi: deskripsi || ""
    };

    return NextResponse.json({
      status: true,
      code: 201,
      message: "Kriteria berhasil ditambahkan",
      data: newKriteria,
    }, { status: 201 });

  } catch (error) {
    console.error("Error creating kriteria:", error);
    
    // Handle specific MySQL errors
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({
        status: false,
        code: 409,
        message: "Data kriteria sudah ada",
      }, { status: 409 });
    }
    
    return NextResponse.json({
      status: false,
      code: 500,
      message: "Terjadi kesalahan server saat menambah kriteria",
      error: error.message,
    }, { status: 500 });
  }
}
