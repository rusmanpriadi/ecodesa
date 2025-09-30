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