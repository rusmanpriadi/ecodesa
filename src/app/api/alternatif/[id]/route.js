import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(req, context) {
    try{
           const { id } = await context.params; // ambil dari URL

 
  const [rows] = await pool.query("DELETE FROM alternatif WHERE id = ?", [id]);
    return NextResponse.json({ status: true, code: 200, message: "alternatif deleted successfully", data: { id } });
    } catch(error){
        return NextResponse.json({ status: false, code: 500, message: "Error deleting alternatif", error: error.message });
    }
 
}

export async function PUT(req, context) {
    try {
        const { id } = await context.params;
        const { kode_alternatif, pupuk,  deskripsi } = await req.json();

      
        const [rows] = await pool.query(
            "UPDATE alternatif SET kode_alternatif = ?, pupuk = ?, deskripsi = ? WHERE id = ?",
            [kode_alternatif, pupuk,  deskripsi, id]
        );
        return NextResponse.json({ status: true, code: 200, message: "alternatif updated successfully", data: { id } });
    } catch (error) {
        return NextResponse.json({ status: false, code: 500, message: "Error updating alternatif", error: error.message });
    }
}