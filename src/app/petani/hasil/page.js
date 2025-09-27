"use client";

import React, { useState } from 'react'
import { Leaf, Calculator, TrendingUp, Home, Plus, FileText, ChevronRight } from 'lucide-react';


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
    
      // Kriteria dan bobot
      const kriteria = [
        { code: 'C01', name: 'Kondisi Tanah', bobot: 0.20, type: 'benefit' },
        { code: 'C02', name: 'Keasaman Tanah (pH)', bobot: 0.10, type: 'benefit' },
        { code: 'C03', name: 'Genangan/Drainase', bobot: 0.20, type: 'benefit' },
        { code: 'C04', name: 'Sumber Air/Irigasi', bobot: 0.10, type: 'benefit' },
        { code: 'C05', name: 'Curah Hujan', bobot: 0.50, type: 'benefit' },
        { code: 'C06', name: 'Salinitas Air', bobot: 0.10, type: 'benefit' },
        { code: 'C07', name: 'Hara Makro (N-P-K)', bobot: 0.05, type: 'benefit' },
        { code: 'C08', name: 'Ukuran Lahan', bobot: 0.05, type: 'benefit' },
        { code: 'C09', name: 'Biaya/Harga', bobot: 0.10, type: 'cost' },
        { code: 'C10', name: 'Kematangan Kompos', bobot: 0.05, type: 'benefit' }
      ];
    
      const alternatives = ['Jerami Padi', 'Kotoran Hewan', 'Limbah Dapur', 'Daun Kering'];
    
      const handleInputChange = (field, value) => {
        setFormData(prev => ({
          ...prev,
          [field]: value
        }));
      };
    
      const calculateSPK = () => {
        // Simulasi perhitungan SPK (dalam implementasi nyata, ini akan menggunakan metode TOPSIS atau SAW)
        const results = [
          { nama: 'Kotoran Hewan', skor: 0.85, rekomendasi: 'Sangat Direkomendasikan' },
          { nama: 'Limbah Dapur', skor: 0.72, rekomendasi: 'Direkomendasikan' },
          { nama: 'Jerami Padi', skor: 0.68, rekomendasi: 'Cukup Direkomendasikan' },
          { nama: 'Daun Kering', skor: 0.55, rekomendasi: 'Kurang Direkomendasikan' }
        ];
        return results;
      };



 const RenderResults = () => {
    const results = calculateSPK();
     const [activeTab, setActiveTab] = useState('dashboard');
      const [formData, setFormData] = useState({
        kondisiTanah: '',
        keasamanTanah: '',
        genangan: '',
        sumberAir: '',
        curahHujan: '',
        salinitas: '',
        haraMakro: '',
        ukuranLahan: '',
        biaya: '',
        kematanganKompos: ''
      });
    
    
    return (
      <div className="max-w-6xl mx-auto space-y-6 p-10">
        {/* Header Results */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Hasil Rekomendasi Pupuk</h2>
          <p className="text-gray-600">Berdasarkan data yang Anda masukkan, berikut adalah rekomendasi pupuk terbaik:</p>
        </div>

        {/* Results Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {results.map((result, index) => (
            <div
              key={index}
              className={`bg-white rounded-xl shadow-lg p-6 border-2 transform transition-all duration-300 hover:scale-105 ${
                index === 0
                  ? 'border-green-500 bg-gradient-to-br from-green-50 to-green-100'
                  : index === 1
                  ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100'
                  : index === 2
                  ? 'border-yellow-500 bg-gradient-to-br from-yellow-50 to-yellow-100'
                  : 'border-red-500 bg-gradient-to-br from-red-50 to-red-100'
              }`}
            >
              <div className="text-center">
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 ${
                    index === 0
                      ? 'bg-green-500 text-white'
                      : index === 1
                      ? 'bg-blue-500 text-white'
                      : index === 2
                      ? 'bg-yellow-500 text-white'
                      : 'bg-red-500 text-white'
                  }`}
                >
                  <span className="font-bold text-lg">{index + 1}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{result.nama}</h3>
                <div className="mb-3">
                  <div
                    className={`text-2xl font-bold ${
                      index === 0
                        ? 'text-green-600'
                        : index === 1
                        ? 'text-blue-600'
                        : index === 2
                        ? 'text-yellow-600'
                        : 'text-red-600'
                    }`}
                  >
                    {(result.skor * 100).toFixed(0)}%
                  </div>
                  <div className="text-sm text-gray-600">Skor Kelayakan</div>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    index === 0
                      ? 'bg-green-200 text-green-800'
                      : index === 1
                      ? 'bg-blue-200 text-blue-800'
                      : index === 2
                      ? 'bg-yellow-200 text-yellow-800'
                      : 'bg-red-200 text-red-800'
                  }`}
                >
                  {result.rekomendasi}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Analysis */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Analisis Detail</h3>
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2">🏆 Rekomendasi Terbaik: Kotoran Hewan</h4>
              <p className="text-green-700 text-sm">
                Kotoran hewan menunjukkan skor tertinggi karena memiliki kandungan nutrisi yang seimbang, mudah diperoleh, dan sesuai dengan kondisi lahan Anda.
              </p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">💡 Tips Penggunaan</h4>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• Pastikan kotoran hewan sudah matang sempurna sebelum digunakan</li>
                <li>• Aplikasikan 2-3 ton per hektar untuk hasil optimal</li>
                <li>• Kombinasikan dengan pupuk mikroorganisme untuk meningkatkan efektivitas</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Criteria Weight Visualization */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Bobot Kriteria</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {kriteria.map((k, index) => (
              <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-lg font-bold text-gray-800">{(k.bobot * 100).toFixed(0)}%</div>
                <div className="text-xs text-gray-600 mt-1">{k.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  export default RenderResults