import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const session_id = searchParams.get('session_id');
    const id_kriteria = searchParams.get('id_kriteria');

    let query = "SELECT * FROM alternatif_judgment";
    let queryParams = [];

    // Build WHERE clause based on provided parameters
    const conditions = [];
    
    if (session_id) {
      conditions.push("session_id = ?");
      queryParams.push(session_id);
    }
    
    if (id_kriteria) {
      conditions.push("id_kriteria = ?");
      queryParams.push(id_kriteria);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    // Add ordering for consistent results
    query += " ORDER BY session_id, id_kriteria, id_alternatif_i, id_alternatif_j";

    const [rows] = await pool.query(query, queryParams);

    return NextResponse.json({
      status: true,
      code: 200,
      message: "Data alternatif judgment",
      data: rows,
      filters: {
        session_id: session_id,
        id_kriteria: id_kriteria
      }
    });

  } catch (error) {
    console.error('Error fetching alternatif judgment:', error);
    return NextResponse.json({
      status: false,
      code: 500,
      message: "Error fetching data",
      error: error.message
    });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { session_id, id_kriteria, id_alternatif_i, id_alternatif_j, value } = body;

    // Validate required fields
    if (!session_id || !id_kriteria || !id_alternatif_i || !id_alternatif_j || !value) {
      return NextResponse.json({
        status: false,
        code: 400,
        message: "Missing required fields: session_id, id_kriteria, id_alternatif_i, id_alternatif_j, value"
      });
    }

    // Validate that alternatives are different
    if (id_alternatif_i === id_alternatif_j) {
      return NextResponse.json({
        status: false,
        code: 400,
        message: "Cannot compare alternative with itself"
      });
    }

    // Validate value range (AHP scale 1-9)
    const numValue = parseFloat(value);
    if (numValue < 1 || numValue > 9) {
      return NextResponse.json({
        status: false,
        code: 400,
        message: "Value must be between 1 and 9"
      });
    }

    // Check if judgment already exists
    const [existingRows] = await pool.query(
      `SELECT id FROM alternatif_judgment 
       WHERE session_id = ? AND id_kriteria = ? AND id_alternatif_i = ? AND id_alternatif_j = ?`,
      [session_id, id_kriteria, id_alternatif_i, id_alternatif_j]
    );

    if (existingRows.length > 0) {
      // Update existing judgment
      await pool.query(
        `UPDATE alternatif_judgment 
         SET value = ?
         WHERE session_id = ? AND id_kriteria = ? AND id_alternatif_i = ? AND id_alternatif_j = ?`,
        [value, session_id, id_kriteria, id_alternatif_i, id_alternatif_j]
      );

      return NextResponse.json({
        status: true,
        code: 200,
        message: "Alternatif judgment updated successfully",
        data: {
          session_id,
          id_kriteria,
          id_alternatif_i,
          id_alternatif_j,
          value,
          action: "updated"
        }
      });
    } else {
      // Insert new judgment
      const [result] = await pool.query(
        `INSERT INTO alternatif_judgment (session_id, id_kriteria, id_alternatif_i, id_alternatif_j, value) 
         VALUES (?, ?, ?, ?, ?)`,
        [session_id, id_kriteria, id_alternatif_i, id_alternatif_j, value]
      );

      return NextResponse.json({
        status: true,
        code: 201,
        message: "Alternatif judgment created successfully",
        data: {
          id: result.insertId,
          session_id,
          id_kriteria,
          id_alternatif_i,
          id_alternatif_j,
          value,
          action: "created"
        }
      });
    }

  } catch (error) {
    console.error('Error saving alternatif judgment:', error);
    return NextResponse.json({
      status: false,
      code: 500,
      message: "Error saving data",
      error: error.message
    });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const session_id = searchParams.get('session_id');
    const id_kriteria = searchParams.get('id_kriteria');

    if (id) {
      // Delete specific judgment by ID
      const [result] = await pool.query(
        "DELETE FROM alternatif_judgment WHERE id = ?",
        [id]
      );

      if (result.affectedRows === 0) {
        return NextResponse.json({
          status: false,
          code: 404,
          message: "Judgment not found"
        });
      }

      return NextResponse.json({
        status: true,
        code: 200,
        message: "Judgment deleted successfully"
      });

    } else if (session_id && id_kriteria) {
      // Delete all judgments for specific session and criteria
      const [result] = await pool.query(
        "DELETE FROM alternatif_judgment WHERE session_id = ? AND id_kriteria = ?",
        [session_id, id_kriteria]
      );

      return NextResponse.json({
        status: true,
        code: 200,
        message: `${result.affectedRows} judgments deleted successfully`
      });

    } else if (session_id) {
      // Delete all judgments for specific session
      const [result] = await pool.query(
        "DELETE FROM alternatif_judgment WHERE session_id = ?",
        [session_id]
      );

      return NextResponse.json({
        status: true,
        code: 200,
        message: `${result.affectedRows} judgments deleted successfully`
      });

    } else {
      return NextResponse.json({
        status: false,
        code: 400,
        message: "Please provide id, or session_id (with optional id_kriteria)"
      });
    }

  } catch (error) {
    console.error('Error deleting alternatif judgment:', error);
    return NextResponse.json({
      status: false,
      code: 500,
      message: "Error deleting data",
      error: error.message
    });
  }
}