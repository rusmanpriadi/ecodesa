import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

// DELETE hapus session
export async function DELETE(req) {
  try {
    const { id } = await req.json();
    const [rows] = await pool.query("DELETE FROM subkriteria WHERE id = ?", [
      id,
    ]);

    return NextResponse.json({
      status: true,
      code: rows.affectedRows === 1 ? 200 : 404,
      message: "subkriteria deleted successfully",
      data: { id },
    });
  } catch (error) {
    return NextResponse.json({
      status: false,
      code: 500,
      message: "Error deleting subkriteria",
      error: error.message,
    });
  }
}
