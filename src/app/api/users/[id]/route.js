import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req, context) {
    try {
        const { id } = await context.params;
        const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
        if (rows.length === 0) {
            return NextResponse.json({ message: "User tidak ditemukan" }, { status: 404 });
        }
        const user = rows[0];
        return NextResponse.json({ status: true, code: 200, message: "Data user", data: user });
    } catch (error) {
        return NextResponse.json({ status: false, code: 500, message: "Error getting user", error: error.message });
    }
}