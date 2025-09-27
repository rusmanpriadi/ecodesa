import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const session_id = searchParams.get("session_id");

    let rows;
    if (session_id) {
      [rows] = await pool.query(
        "SELECT * FROM kriteria_judgment WHERE session_id = ?",
        [session_id]
      );
    } else {
      [rows] = await pool.query("SELECT * FROM kriteria_judgment");
    }

    return NextResponse.json({ status: true, data: rows });
  } catch (error) {
    return NextResponse.json({ status: false, message: error.message });
  }
}


export async function POST(req) {
  try {
    const { session_id, id_kriteria_i, id_kriteria_j, value } = await req.json();
   
    const [rows] = await pool.query(
      `INSERT INTO kriteria_judgment (session_id, id_kriteria_i, id_kriteria_j, value)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE value = VALUES(value)`,
      [session_id, id_kriteria_i, id_kriteria_j, value]
    );

    return NextResponse.json({
      status: true,
      code: rows.affectedRows === 1 ? 201 : 200,
      message: rows.affectedRows === 1 
        ? "kriteria_judgment created successfully" 
        : "kriteria_judgment updated successfully",
      data: { session_id, id_kriteria_i, id_kriteria_j, value }
    });
  } catch (error) {
    return NextResponse.json({
      status: false,
      code: 500,
      message: "Session belum ada, silahkan buat session terlebih dahulu",
      error: error.message,
    });
  }
}
