// ========================================
// File: app/api/statistics/[userId]/route.js
// Get recommendation statistics for PIE CHART
// ========================================
import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req, context) {
  try {
    const { userId } = await context.params;

    if (!userId) {
      return NextResponse.json({
        status: false,
        code: 400,
        message: "User ID tidak ditemukan",
      });
    }

    console.log('Fetching statistics for user ID:', userId);

    // Query statistics dengan nama tabel yang benar
    const [stats] = await pool.query(
      `SELECT 
        r.hasil,
        COUNT(DISTINCT r.id) as count,
        ROUND(AVG(r.persen), 2) as avg_persen,
        MAX(r.tanggal) as last_recommendation
      FROM riwayat r
      INNER JOIN input_kriteria ik ON r.kode_input = ik.kode_input
      WHERE ik.id_user = ?
      GROUP BY r.hasil
      ORDER BY count DESC`,
      [userId]
    );

    console.log('Statistics found:', stats);

    if (stats.length === 0) {
      return NextResponse.json({
        status: false,
        code: 404,
        message: "Tidak ada data statistik untuk user ini",
        total_recommendations: 0,
        data: []
      });
    }

    // Calculate total
    const total = stats.reduce((sum, item) => sum + parseInt(item.count), 0);

    // Add percentage to each result
    const data = stats.map(item => ({
      hasil: item.hasil,
      count: parseInt(item.count),
      avg_persen: parseFloat(item.avg_persen),
      last_recommendation: item.last_recommendation,
      percentage: parseFloat(((parseInt(item.count) / total) * 100).toFixed(1))
    }));

    return NextResponse.json({
      status: true,
      code: 200,
      message: "Statistik rekomendasi ditemukan",
      total_recommendations: total,
      data: data,
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return NextResponse.json({
      status: false,
      code: 500,
      message: "Gagal mengambil statistik",
      error: error.message,
    });
  }
}