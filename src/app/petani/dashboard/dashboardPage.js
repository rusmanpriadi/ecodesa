"use client";

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Leaf, Calculator, TrendingUp, Home, Plus, FileText, ChevronRight } from 'lucide-react';
import axios from 'axios';
import RecommendationDashboard from './pie';

const FarmerSPKDashboard = () => {

  const [alternatif, setAlternatif] = useState([]);
  const [kriteria, setKriteria] = useState([]);

  useEffect(()=> {
    const fetchData = async () => {
      try {
        const [alternatifRes, kriteriaRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/alternatif`),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/criteria`)
        ]);
        setAlternatif(alternatifRes.data.data);
        setKriteria(kriteriaRes.data.data);
        
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  const jumlahPupuk = alternatif.length;
  const jumlahKriteria = kriteria.length;

  // Data untuk grafik dashboard
  const pupukData = [
    { name: 'Jerami Padi', nitrogen: 0.5, fosfor: 0.15, kalium: 1.2, organik: 85 },
    { name: 'Kotoran Hewan', nitrogen: 2.0, fosfor: 1.5, kalium: 2.5, organik: 75 },
    { name: 'Limbah Dapur', nitrogen: 1.2, fosfor: 0.8, kalium: 1.8, organik: 65 },
    { name: 'Daun Kering', nitrogen: 0.8, fosfor: 0.3, kalium: 0.9, organik: 80 }
  ];

  const pieData = [
    { name: 'Jerami Padi', value: 25, color: '#22c55e' },
    { name: 'Kotoran Hewan', value: 35, color: '#3b82f6' },
    { name: 'Limbah Dapur', value: 20, color: '#f59e0b' },
    { name: 'Daun Kering', value: 20, color: '#ef4444' }
  ];


return (

    <div className="space-y-6 p-10">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Alternatif/Pupuk</p>
              <p className="text-2xl font-bold text-gray-800">{jumlahPupuk}</p>
            </div>
            <Leaf className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Kriteria</p>
              <p className="text-2xl font-bold text-gray-800">{jumlahKriteria}</p>
            </div>
            <Calculator className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        {/* <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Bobot Tertinggi</p>
              <p className="text-2xl font-bold text-gray-800">50%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-yellow-500" />
          </div>
        </div> */}
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Metode SPK</p>
              <p className="text-lg font-bold text-gray-800">AHP</p>
            </div>
            <FileText className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        {/* Bar Chart */}
        {/* <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Kandungan Nutrisi Pupuk Organik</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={pupukData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="nitrogen" fill="#22c55e" name="Nitrogen (%)" />
              <Bar dataKey="fosfor" fill="#3b82f6" name="Fosfor (%)" />
              <Bar dataKey="kalium" fill="#f59e0b" name="Kalium (%)" />
            </BarChart>
          </ResponsiveContainer>
        </div> */}

        {/* Pie Chart */}
        <div className="bg-white rounded-xl shadow-md ">
          <h3 className="text-lg font-semibold text-gray-800 p-6 mb-4">Persentasi Hasil Rekomendasi</h3>
          {/* <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer> */}
          <RecommendationDashboard />
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <h3 className="text-lg font-semibold text-green-800 mb-3">Tentang Sistem SPK</h3>
          <p className="text-green-700 text-sm leading-relaxed">
            Sistem Pendukung Keputusan ini membantu petani memilih pupuk organik terbaik berdasarkan 10 kriteria penting seperti kondisi tanah, pH, drainase, dan faktor ekonomis.
          </p>
        </div>
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">Cara Penggunaan</h3>
          <p className="text-blue-700 text-sm leading-relaxed">
            Masukkan data kondisi lahan Anda pada halaman Input Data, lalu sistem akan memberikan rekomendasi pupuk terbaik dengan perhitungan metode AHP.
          </p>
        </div>
      </div>
    </div>
  

            )

 
  
}
export default FarmerSPKDashboard;