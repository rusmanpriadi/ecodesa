// File: /api/input-kriteria/route.js (Updated version)
import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        const [rows] = await pool.query("SELECT * FROM input_kriteria");
        return NextResponse.json({ status: true, data: rows });
    } catch (error) {
        return NextResponse.json({ status: false, message: error.message });
    }
}

export async function POST(req) {
    try {
        const { id_user, id_subkriteria, kode_kriteria, bobot, kode_input } = await req.json();
        console.log("POST Body input:", { id_user, id_subkriteria, kode_kriteria, bobot, kode_input });
        
        const [rows] = await pool.query(
            "INSERT INTO input_kriteria (id_user, id_subkriteria, kode_kriteria, bobot, kode_input) VALUES (?, ?, ?, ?, ?)", 
            [id_user, id_subkriteria, kode_kriteria, bobot, kode_input]
        );
        
        return NextResponse.json({ 
            status: true, 
            data: { 
                id: rows.insertId, 
                id_user, 
                id_subkriteria, 
                kode_kriteria, 
                bobot, 
                kode_input,
                message: "Data saved successfully"
            } 
        });
    } catch (error) {
        return NextResponse.json({ 
            status: false, 
            message: error.message,
            error: {
                code: error.code,
                errno: error.errno,
                sqlState: error.sqlState
            }
        });
    }
}


export async function DELETE(req) {
  try {
    const { kode_input } = await req.json();
    console.log("DELETE Body input:", { kode_input });

    if (!kode_input) {
      return NextResponse.json({ status: false, code: 400, message: "kode_input tidak ditemukan" });
    }

    // Cek data di input_kriteria
    const [rows] = await pool.query(
      "SELECT kode_input FROM input_kriteria WHERE kode_input = ?",
      [kode_input]
    );
    console.log("Rows found in input_kriteria:", rows.length);

    if (rows.length === 0) {
      return NextResponse.json({ status: false, code: 404, message: "Data input_kriteria tidak ditemukan" });
    }

    const deletedKodeInput = rows[0].kode_input;

    // Hapus data terkait di tabel_lain
    const [deletedRowsLain] = await pool.query(
      "DELETE FROM riwayat WHERE kode_input = ?",
      [kode_input]
    );
    // Hapus data terkait di tabel_lain
    const [deletedRowsJudgment] = await pool.query(
      "DELETE FROM kriteria_judgment WHERE kode_input = ?",
      [kode_input]
    );
  

    // Hapus data di input_kriteria
    const [deletedRowsKriteria] = await pool.query(
      "DELETE FROM input_kriteria WHERE kode_input = ?",
      [kode_input]
    );
    console.log("Rows deleted in input_kriteria:", deletedRowsKriteria.affectedRows);

    return NextResponse.json({
      status: true,
      code: 200,
      message: "Data deleted successfully",
      data: {
        kode_input,
        deletedKodeInput,
        deletedRowsLain: deletedRowsLain.affectedRows,
        deletedRowsJudgment: deletedRowsJudgment.affectedRows,
        deletedRowsKriteria: deletedRowsKriteria.affectedRows
      },
    });
  } catch (error) {
    console.error("Error deleting data:", error);
    return NextResponse.json({
      status: false,
      code: 500,
      message: "Error deleting data",
      error: error.message,
    });
  }
}
