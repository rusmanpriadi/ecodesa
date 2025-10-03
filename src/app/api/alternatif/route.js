import { pool } from "@/lib/db";
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";

export async function GET(req) {
  try {
    const [rows] = await pool.query("SELECT * FROM alternatif ORDER BY kode_alternatif ASC");
    return NextResponse.json({
      status: true,
      code: 200,
      message: "Data alternatif berhasil diambil",
      data: rows,
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: false,
        code: 500,
        message: "Error mengambil data alternatif",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const formData = await req.formData();
    
    const kode_alternatif = formData.get("kode_alternatif");
    const pupuk = formData.get("pupuk");
    const deskripsi = formData.get("deskripsi") || "";
    const jenis = formData.get("jenis") || "";
    const harga = formData.get("harga") || 0;
    const imageFile = formData.get("images");

    // Validasi input wajib
    if (!kode_alternatif || !pupuk) {
      return NextResponse.json(
        {
          status: false,
          code: 400,
          message: "Kode alternatif dan nama pupuk harus diisi",
        },
        { status: 400 }
      );
    }

    

    // Cek duplikasi kode alternatif
    const [existing] = await pool.query(
      "SELECT kode_alternatif FROM alternatif WHERE kode_alternatif = ?",
      [kode_alternatif]
    );

    if (existing.length > 0) {
      return NextResponse.json(
        {
          status: false,
          code: 409,
          message: `Kode alternatif ${kode_alternatif} sudah digunakan`,
        },
        { status: 409 }
      );
    }

    // Handle upload gambar
    let imagePath = null;
    if (imageFile && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Generate unique filename
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const fileExtension = path.extname(imageFile.name);
      const fileName = `${kode_alternatif}-${uniqueSuffix}${fileExtension}`;
      
      // Path untuk menyimpan file
      const uploadDir = path.join(process.cwd(), "public", "uploads", "alternatif");
      const filePath = path.join(uploadDir, fileName);

      // Simpan file
      await writeFile(filePath, buffer);
      imagePath = `/uploads/alternatif/${fileName}`;
    }

    // Insert ke database
    const [rows] = await pool.query(
      "INSERT INTO alternatif (kode_alternatif, pupuk, deskripsi, jenis, harga, images) VALUES (?, ?, ?, ?, ?, ?)",
      [kode_alternatif, pupuk, deskripsi, jenis, harga, imagePath]
    );

    return NextResponse.json({
      status: true,
      code: 201,
      message: "Alternatif berhasil ditambahkan",
      data: {
        id: rows.insertId,
        kode_alternatif,
        pupuk,
        deskripsi,
        jenis,
        harga,
        images: imagePath,
      },
    });
  } catch (error) {
    console.error("Error creating alternatif:", error);
    return NextResponse.json(
      {
        status: false,
        code: 500,
        message: "Error menambahkan alternatif",
        error: error.message,
      },
      { status: 500 }
    );
  }
}