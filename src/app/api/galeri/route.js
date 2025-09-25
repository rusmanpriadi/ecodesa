import { pool } from "../../../lib/db";
import { NextResponse } from "next/server";
import path from "path";
import { writeFile, mkdir } from "fs/promises";

// GET method untuk mengambil daftar galeri
export async function GET(req) {
    const [rows] = await pool.query("SELECT * FROM galeri");
    return NextResponse.json({
        status: true,
        code: 200,
        message: "Data galeri",
        data: rows,
    });
}

export async function POST(req) {
  try {
    // Parse FormData
    const formData = await req.formData();
    const judul = formData.get("judul");
    const deskripsi = formData.get("deskripsi");
    const tanggal = formData.get("tanggal");
    const images = formData.get("images");

    // Validasi input
    if (!judul || judul.trim() === "") {
      return NextResponse.json(
        {
          status: false,
          code: 400,
          message: "Judul galeri harus diisi",
        },
        { status: 400 }
      );
    }

    let fotoFileName = null;

    // Handle file upload if photo exists
    if (images && images.size > 0) {
      // Validate file type
      if (!images.type.startsWith("image/")) {
        return NextResponse.json(
          {
            status: false,
            code: 400,
            message: "File harus berupa gambar",
          },
          { status: 400 }
        );
      }

      // Validate file size (5MB limit)
      if (images.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          {
            status: false,
            code: 400,
            message: "Ukuran file maksimal 5MB",
          },
          { status: 400 }
        );
      }

      // Generate unique filename
      const timestamp = Date.now();
      const originalName = images.name;
      const extension = originalName.split(".").pop();
      fotoFileName = `galeri_${timestamp}_${Math.random()
        .toString(36)
        .substring(7)}.${extension}`;

      // Create upload directory if it doesn't exist
      const uploadDir = path.join(process.cwd(), "public", "uploads", "galeri");
      try {
        await mkdir(uploadDir, { recursive: true });
      } catch (error) {
        // Directory might already exist
      }

      // Save file
      const bytes = await images.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filePath = path.join(uploadDir, fotoFileName);

      await writeFile(filePath, buffer);

      // Store relative path for database
      fotoFileName = `/uploads/galeri/${fotoFileName}`;
    } else {
      return NextResponse.json(
        {
          status: false,
          code: 400,
          message: "Foto galeri harus diupload",
        },
        { status: 400 }
      );
    }

    // Insert into database
    const [result] = await pool.query(
      `INSERT INTO galeri 
       (judul, deskripsi, tanggal, images) 
       VALUES (?, ?, ?, ?)`,
      [judul.trim(), deskripsi || null, tanggal || null, fotoFileName]
    );

    return NextResponse.json({
      status: true,
      code: 201,
      message: "Galeri berhasil ditambahkan",
      data: {
        id_galeri: result.insertId,
        judul: judul.trim(),
        deskripsi: deskripsi || null,
        tanggal: tanggal || null,
        images: fotoFileName,
    
      },
    });
  } catch (error) {
    console.error("Error creating galeri:", error);

    return NextResponse.json(
      {
        status: false,
        code: 500,
        message: "Internal server error",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
