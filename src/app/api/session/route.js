import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
    const [rows] = await pool.query("SELECT * FROM ahp_session");
    return NextResponse.json({
        status: true,
        code: 200,
        message: "Data session",
        data: rows,
    });
}

export async function POST(req) {
    try {
        const { nama } = await req.json();
        const [rows] = await pool.query("INSERT INTO ahp_session (nama) VALUES (?)", [nama]);
        return NextResponse.json({
            status: true,
            code: rows.affectedRows === 1 ? 201 : 200,
            message: rows.affectedRows === 1 ? "session created successfully" : "session updated successfully",
            data: { id: rows.insertId, nama },
        });
    } catch (error) {
        return NextResponse.json({ status: false, code: 500, message: "Error creating session", error: error.message });
    }
}

// PUT update session
export async function PUT(req) {
  try {
    const { id, nama } = await req.json();
    const [rows] = await pool.query(
      "UPDATE ahp_session SET nama = ? WHERE id = ?",
      [nama, id]
    );

    return NextResponse.json({
      status: true,
      code: rows.affectedRows === 1 ? 200 : 404,
      message:
        rows.affectedRows === 1
          ? "Session updated successfully"
          : "Session not found",
      data: { id, nama },
    });
  } catch (error) {
    return NextResponse.json({
      status: false,
      code: 500,
      message: "Error updating session",
      error: error.message,
    });
  }
}

// DELETE hapus session
export async function DELETE(req) {
  try {
    const { id } = await req.json();

    // hapus semua judgment yang terkait
    await pool.query("DELETE FROM kriteria_judgment WHERE session_id = ?", [id]);

    // hapus session
    const [rows] = await pool.query("DELETE FROM ahp_session WHERE id = ?", [id]);

    return NextResponse.json({
      status: true,
      code: rows.affectedRows === 1 ? 200 : 404,
      message:
        rows.affectedRows === 1
          ? "Session deleted successfully beserta kriteria_judgment"
          : "Session not found",
      data: { id },
    });
  } catch (error) {
    return NextResponse.json({
      status: false,
      code: 500,
      message: "Error deleting session",
      error: error.message,
    });
  }
}
