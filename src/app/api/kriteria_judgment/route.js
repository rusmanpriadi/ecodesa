// File: /api/kriteria-judgment/route.js
import { pool } from "@/lib/db";
import { NextResponse } from "next/server";



export async function GET(req) {
    try {
        const [rows] = await pool.query(`SELECT * FROM kriteria_judgment`);
        return NextResponse.json({ status: true, data: rows });
    } catch (error) {
        return NextResponse.json({ status: false, message: error.message });
    }
}

export async function POST(req) {

  const body = await req.json();
console.log("POST Body:", body);

  try {
        const { kode_input, id_kriteria_i, id_kriteria_j, value } = body
    
        
        // Pastikan id_kriteria_i selalu lebih kecil dari id_kriteria_j untuk menghindari constraint
        const minId = Math.min(id_kriteria_i, id_kriteria_j);
        const maxId = Math.max(id_kriteria_i, id_kriteria_j);
        let finalValue = value;
        
        // Jika urutan ID berubah, balik nilai
        if (id_kriteria_i > id_kriteria_j) {
            finalValue = 1 / value;
        }
        
        const [rows] = await pool.query(
            "INSERT INTO kriteria_judgment (kode_input, id_kriteria_i, id_kriteria_j, value) VALUES (?, ?, ?, ?)", 
            [kode_input, minId, maxId, Math.round(finalValue * 10000) / 10000]
        );
        
        return NextResponse.json({ 
            status: true, 
            data: { 
                id: rows.insertId, 
                kode_input, 
                id_kriteria_i: minId, 
                id_kriteria_j: maxId, 
                value: finalValue 
            } 
        });
    } catch (error) {
        return NextResponse.json({ 
            status: false, 
            message: error.message,
            details: {
                code: error.code,
                errno: error.errno,
                sqlState: error.sqlState
            }
        });
    }
}