import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(req, context) {
    try{
           const { id } = await context.params; // ambil dari URL

 
  const [rows] = await pool.query("DELETE FROM kriteria WHERE id = ?", [id]);
    return NextResponse.json({ status: true, code: 200, message: "kriteria deleted successfully", data: { id } });
    } catch(error){
        return NextResponse.json({ status: false, code: 500, message: "Error deleting kriteria", error: error.message });
    }
 
}

export async function PUT(req, context) {
    try {
        const { id } = await context.params;
        const { kode_kriteria, nama_kriteria, atribut, bobot, deskripsi } = await req.json();

      
        const [rows] = await pool.query(
            "UPDATE kriteria SET kode_kriteria = ?, nama_kriteria = ?, atribut = ?, bobot = ?, deskripsi = ? WHERE id = ?",
            [kode_kriteria, nama_kriteria, atribut, bobot, deskripsi, id]
        );
        return NextResponse.json({ status: true, code: 200, message: "kriteria updated successfully", data: { id } });
    } catch (error) {
        return NextResponse.json({ status: false, code: 500, message: "Error updating kriteria", error: error.message });
    }
}