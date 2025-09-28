import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        const [rows] = await pool.query("SELECT * FROM users");
        return NextResponse.json({ status: true, data: rows });
    } catch (error) {
        return NextResponse.json({ status: false, message: error.message });
    }
}