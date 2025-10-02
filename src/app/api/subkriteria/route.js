import { pool } from "@/lib/db";
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

// POST method untuk menambah subkriteria
export async function POST(req) {
  try {
    const body = await req.json();
    const { kode_kriteria, subkriteriaList } = body;

    // Validasi input
    if (!kode_kriteria) {
      return NextResponse.json(
        {
          status: false,
          code: 400,
          message: "Kode kriteria harus diisi",
        },
        { status: 400 }
      );
    }

    if (!Array.isArray(subkriteriaList) || subkriteriaList.length === 0) {
      return NextResponse.json(
        {
          status: false,
          code: 400,
          message: "Minimal harus ada 1 subkriteria",
        },
        { status: 400 }
      );
    }

    // Validasi setiap subkriteria
    for (const item of subkriteriaList) {
      if (!item.subkriteria || item.subkriteria.trim() === "") {
        return NextResponse.json(
          {
            status: false,
            code: 400,
            message: "Nama subkriteria tidak boleh kosong",
          },
          { status: 400 }
        );
      }

      if (!item.bobot || item.bobot <= 0) {
        return NextResponse.json(
          {
            status: false,
            code: 400,
            message: "Bobot harus lebih dari 0",
          },
          { status: 400 }
        );
      }
    }

    // Cek apakah kode_kriteria ada di database
    const [kriteriaCheck] = await pool.query(
      "SELECT kode_kriteria FROM kriteria WHERE kode_kriteria = ?",
      [kode_kriteria]
    );

    if (kriteriaCheck.length === 0) {
      return NextResponse.json(
        {
          status: false,
          code: 404,
          message: "Kriteria tidak ditemukan",
        },
        { status: 404 }
      );
    }

    // Insert multiple subkriteria
    const insertPromises = subkriteriaList.map((item) => {
      return pool.query(
        "INSERT INTO subkriteria (kode_kriteria, subkriteria, bobot) VALUES (?, ?, ?)",
        [kode_kriteria, item.subkriteria.trim(), item.bobot]
      );
    });

    await Promise.all(insertPromises);

    // Ambil data subkriteria yang baru ditambahkan
    const [newSubkriteria] = await pool.query(
      `SELECT id, kode_kriteria, subkriteria, bobot 
       FROM subkriteria 
       WHERE kode_kriteria = ? 
       ORDER BY id DESC 
       LIMIT ?`,
      [kode_kriteria, subkriteriaList.length]
    );

    return NextResponse.json(
      {
        status: true,
        code: 201,
        message: "Subkriteria berhasil ditambahkan",
        data: newSubkriteria,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding subkriteria:", error);

    // Handle duplicate entry error
    if (error.code === "ER_DUP_ENTRY") {
      return NextResponse.json(
        {
          status: false,
          code: 409,
          message: "Subkriteria sudah ada",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        status: false,
        code: 500,
        message: "Gagal menambahkan subkriteria",
        error: error.message,
      },
      { status: 500 }
    );
  }
}