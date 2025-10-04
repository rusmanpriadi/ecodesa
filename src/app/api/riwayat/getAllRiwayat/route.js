import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
    const [rows] = await pool.query("SELECT * FROM riwayat");
    return NextResponse.json({
        status: true,
        code: 200,
        message: "Data riwayat",
        data: rows,
    });
}