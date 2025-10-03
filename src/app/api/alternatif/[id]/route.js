import { pool } from "@/lib/db";
import { NextResponse } from "next/server";
import { writeFile, unlink } from "fs/promises";
import path from "path";

export async function DELETE(req, context) {
    try {
        const { id } = await context.params;

        // Get image path before deleting
        const [existing] = await pool.query(
            "SELECT images FROM alternatif WHERE id = ?",
            [id]
        );

        // Delete from database
        const [rows] = await pool.query(
            "DELETE FROM alternatif WHERE id = ?",
            [id]
        );

        // Delete image file if exists
        if (existing[0]?.images) {
            try {
                const imagePath = path.join(process.cwd(), "public", existing[0].images);
                await unlink(imagePath);
            } catch (err) {
                console.log("Error deleting image:", err);
            }
        }

        return NextResponse.json({
            status: true,
            code: 200,
            message: "Alternatif deleted successfully",
            data: { id }
        });
    } catch (error) {
        console.error("Delete error:", error);
        return NextResponse.json({
            status: false,
            code: 500,
            message: "Error deleting alternatif",
            error: error.message
        });
    }
}

export async function PUT(req, context) {
    try {
        const { id } = await context.params;
        const formData = await req.formData();

        // Extract form data
        const kode_alternatif = formData.get("kode_alternatif");
        const pupuk = formData.get("pupuk");
        const deskripsi = formData.get("deskripsi") || "";
        const jenis = formData.get("jenis") || "";
        const harga = formData.get("harga") || 0;
        const imageFile = formData.get("images");

        // Validation
        if (!kode_alternatif || !pupuk) {
            return NextResponse.json({
                status: false,
                code: 400,
                message: "Kode alternatif dan nama pupuk harus diisi"
            });
        }

        // Check if kode_alternatif already exists (excluding current record)
        const [existing] = await pool.query(
            "SELECT id FROM alternatif WHERE kode_alternatif = ? AND id != ?",
            [kode_alternatif, id]
        );

        if (existing.length > 0) {
            return NextResponse.json({
                status: false,
                code: 400,
                message: "Kode alternatif sudah digunakan"
            });
        }

        let imagePath = null;

        // Handle image upload if provided
        if (imageFile && imageFile.size > 0) {
            // Get old image to delete
            const [oldData] = await pool.query(
                "SELECT images FROM alternatif WHERE id = ?",
                [id]
            );

            // Validate file type
            const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
            if (!allowedTypes.includes(imageFile.type)) {
                return NextResponse.json({
                    status: false,
                    code: 400,
                    message: "Format file harus JPEG, JPG, PNG, atau WebP"
                });
            }

            // Validate file size (max 5MB)
            // if (imageFile.size > 5 * 1024 * 1024) {
            //     return NextResponse.json({
            //         status: false,
            //         code: 400,
            //         message: "Ukuran file maksimal 5MB"
            //     });
            // }

            const bytes = await imageFile.arrayBuffer();
            const buffer = Buffer.from(bytes);

            // Create unique filename
            const ext = path.extname(imageFile.name);
            const filename = `${kode_alternatif}-${Date.now()}-${Math.random().toString(36).substring(7)}${ext}`;
            const uploadDir = path.join(process.cwd(), "public", "uploads", "alternatif");
            const filePath = path.join(uploadDir, filename);

            // Create directory if not exists
            const fs = require("fs");
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            // Save new file
            await writeFile(filePath, buffer);
            imagePath = `/uploads/alternatif/${filename}`;

            // Delete old image if exists
            if (oldData[0]?.images) {
                try {
                    const oldImagePath = path.join(process.cwd(), "public", oldData[0].images);
                    await unlink(oldImagePath);
                } catch (err) {
                    console.log("Error deleting old image:", err);
                }
            }
        }

        // Update query based on whether image is uploaded
        let query, params;
        if (imagePath) {
            query = `UPDATE alternatif 
                     SET kode_alternatif = ?, pupuk = ?, deskripsi = ?, jenis = ?, harga = ?, images = ? 
                     WHERE id = ?`;
            params = [kode_alternatif, pupuk, deskripsi, jenis, harga, imagePath, id];
        } else {
            query = `UPDATE alternatif 
                     SET kode_alternatif = ?, pupuk = ?, deskripsi = ?, jenis = ?, harga = ? 
                     WHERE id = ?`;
            params = [kode_alternatif, pupuk, deskripsi, jenis, harga, id];
        }

        const [result] = await pool.query(query, params);

        if (result.affectedRows === 0) {
            return NextResponse.json({
                status: false,
                code: 404,
                message: "Alternatif tidak ditemukan"
            });
        }

        // Get updated data
        const [updatedData] = await pool.query(
            "SELECT * FROM alternatif WHERE id = ?",
            [id]
        );

        return NextResponse.json({
            status: true,
            code: 200,
            message: "Alternatif berhasil diperbarui",
            data: updatedData[0]
        });
    } catch (error) {
        console.error("Update error:", error);
        return NextResponse.json({
            status: false,
            code: 500,
            message: "Error updating alternatif",
            error: error.message
        });
    }
}