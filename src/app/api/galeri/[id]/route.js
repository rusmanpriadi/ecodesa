import { pool } from "@/lib/db";
import { NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";

export async function DELETE(req, context) {
    try{
           const { id } = await context.params; // ambil dari URL

 
  const [rows] = await pool.query("DELETE FROM galeri WHERE id = ?", [id]);
    return NextResponse.json({ status: true, code: 200, message: "galeri deleted successfully", data: { id } });
    } catch(error){
        return NextResponse.json({ status: false, code: 500, message: "Error deleting galeri", error: error.message });
    }
 
}

export async function PUT(req, context) {
  try {
    const { id } = await context.params;
    const contentType = req.headers.get('content-type');

    let judul, tanggal, deskripsi, images;

    // Handle both JSON and FormData
    if (contentType?.includes('multipart/form-data')) {
      const formData = await req.formData();
      judul = formData.get('judul');
      tanggal = formData.get('tanggal');
      deskripsi = formData.get('deskripsi');
      const file = formData.get('file');

      // Handle file upload
      if (file) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const uniqueFilename = `${Date.now()}-${file.name}`;
        const uploadPath = path.join(process.cwd(), 'public', 'uploads', uniqueFilename);
        await writeFile(uploadPath, buffer);
        images = `/uploads/${uniqueFilename}`;
      } else {
        // Keep existing image if no new file
        const [existingData] = await pool.query("SELECT images FROM galeri WHERE id = ?", [id]);
        images = existingData[0]?.images;
      }
    } else {
      // Handle JSON data
      const body = await req.json();
      ({ judul, tanggal, deskripsi, images } = body);
    }

    // Validasi input
    if (!judul || !judul.trim()) {
      return NextResponse.json({ 
        status: false, 
        code: 400, 
        message: "Judul tidak boleh kosong" 
      });
    }

    // Format tanggal jika diperlukan
    const formattedTanggal = tanggal ? new Date(tanggal).toISOString().split('T')[0] : null;
    
    // Update query untuk tabel galeri
    const [result] = await pool.query(
      "UPDATE galeri SET judul = ?, tanggal = ?, deskripsi = ?, images = ? WHERE id = ?",
      [judul, formattedTanggal, deskripsi, images, id]
    );

    // Cek apakah data berhasil diupdate
    if (result.affectedRows === 0) {
      return NextResponse.json({ 
        status: false, 
        code: 404, 
        message: "Data galeri tidak ditemukan" 
      });
    }

    // Ambil data yang sudah diupdate untuk dikembalikan
    const [updatedData] = await pool.query("SELECT * FROM galeri WHERE id = ?", [id]);

    return NextResponse.json({ 
      status: true, 
      code: 200, 
      message: "Galeri berhasil diupdate", 
      data: updatedData[0] 
    });
  } catch (error) {
    console.error("Error updating galeri:", error);
    return NextResponse.json({ 
      status: false, 
      code: 500, 
      message: "Error updating galeri", 
      error: error.message 
    });
  }
}