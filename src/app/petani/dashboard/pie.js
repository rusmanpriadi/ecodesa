"use client";

import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { RefreshCw } from "lucide-react";
import Cookies from "js-cookie";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const RecommendationDashboard = () => {
  const [pieData, setPieData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalRecommendations, setTotalRecommendations] = useState(0);
  const UserId = Cookies.get("id");

  const COLORS = [
    "#10b981",
    "#f59e0b",
    "#3b82f6",
    "#ef4444",
    "#8b5cf6",
    "#ec4899",
  ];

  useEffect(() => {
    if (UserId) {
      fetchStatistics();
    }
  }, [UserId]);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/statistics/${UserId}`);
      const result = await response.json();

      if (result.status && result.data?.length > 0) {
        const chartData = result.data.map((item, index) => ({
          name: item.hasil,
          value: item.percentage,
          count: item.count,
          avg_persen: item.avg_persen,
          color: COLORS[index % COLORS.length],
        }));

        setPieData(chartData);
        setTotalRecommendations(result.total_recommendations);
      } else {
        setError(result.message || "Tidak ada data untuk user ini");
        setPieData([]);
        setTotalRecommendations(0);
      }
    } catch (err) {
      setError("Terjadi kesalahan saat mengambil data");
      console.error("Fetch error:", err);
      setPieData([]);
    } finally {
      setLoading(false);
    }
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload?.length) {
      const data = payload[0].payload;
      return (
        <div
          className="bg-white p-4 rounded-lg shadow-xl border-2"
          style={{ borderColor: data.color }}
        >
          <p className="font-bold text-gray-800 mb-1">{data.name}</p>
          <p className="text-sm text-gray-600">Jumlah: {data.count} kali</p>
          <p className="text-sm text-gray-600">Persentase: {data.value}%</p>
          <p className="text-sm text-gray-600">
            Rata-rata skor: {data.avg_persen}
          </p>
        </div>
      );
    }
    return null;
  };

  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    outerRadius,
    value,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 25;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#374151"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="font-semibold text-sm"
      >
        {`${value}%`}
      </text>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
         {loading ? (
              <div className="flex flex-col justify-center items-center h-96 space-y-4">
                <Skeleton className="h-40 w-40 rounded-full" />
                <Skeleton className="h-4 w-56" />
                <Skeleton className="h-4 w-40" />
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
                <p className="text-red-600 font-semibold text-lg mb-4">{error}</p>
                <Button
                  onClick={fetchStatistics}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" /> Coba Lagi
                </Button>
              </div>
            ) : pieData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={renderCustomLabel}
                      outerRadius={130}
                      dataKey="value"
                      animationBegin={0}
                      animationDuration={800}
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color}
                          stroke="#fff"
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      verticalAlign="bottom"
                      height={60}
                      iconType="circle"
                      formatter={(value, entry) => (
                        <span className="text-sm font-medium">
                          {value} ({entry.payload.count}×)
                        </span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
                  {pieData.map((item, index) => (
                    <div
                      key={index}
                      className="border-l-4 bg-white p-5 rounded-xl shadow-md hover:shadow-xl transition-all"
                      style={{ borderColor: item.color }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-bold text-gray-800 text-lg">
                          {item.name}
                        </h4>
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: item.color }}
                        ></div>
                      </div>
                      <div className="space-y-1">
                        <p
                          className="text-3xl font-bold"
                          style={{ color: item.color }}
                        >
                          {item.value}%
                        </p>
                        <p className="text-sm text-gray-600">
                          📊 Frekuensi: {item.count} kali
                        </p>
                        <p className="text-sm text-gray-600">
                          ⭐ Rata-rata skor: {item.avg_persen}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">📊</div>
                <p className="text-gray-500 text-lg">
                  Tidak ada data rekomendasi untuk user ini
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  Coba user ID yang lain (5, 6, atau 7)
                </p>
              </div>
            )}
      </div>
    </div>
  );
};

export default RecommendationDashboard;
