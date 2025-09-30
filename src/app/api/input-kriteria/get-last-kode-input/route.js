import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

// Ambil last kode_input (tanpa increment)
export async function GET() {
  try {
    const [rows] = await pool.query(
      "SELECT MAX(CAST(kode_input AS UNSIGNED)) as last_kode FROM input_kriteria"
    );

    const lastKode = rows[0]?.last_kode || 0;

    return NextResponse.json({
      status: true,
      last_kode: lastKode,
    });
  } catch (error) {
    console.error("Error getting last kode_input:", error);
    return NextResponse.json({
      status: false,
      message: error.message,
      last_kode: 0,
    });
  }
}

