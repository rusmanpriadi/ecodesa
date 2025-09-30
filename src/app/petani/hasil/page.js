"use client";

import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Calculator, TrendingUp, FileText, CheckCircle, Eye, Calendar, User, X } from 'lucide-react';
import Cookies from 'js-cookie';
import axios from 'axios';

const ComprehensiveResultsPage = () => {
  const [selectedCalculation, setSelectedCalculation] = useState(null);
  const [user, setUser] = useState([]);
  const [riwayat, setRiwayat] = useState([]);
  const [expandedSections, setExpandedSections] = useState({
    criteriaComparison: true,
    alternativeComparison: true,
    calculations: true,
    finalResults: true
  });

  const userId = Cookies.get('id');


  useEffect(() => {
    const fetchResponse = async () => {
     try{
      const [userResponse, riwatResponse] = await Promise.all([
         axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}`),
         axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/riwayat/?id_user=${userId}`),
      ])

      setUser(userResponse.data.data);
      setRiwayat(riwatResponse.data.data);
     } catch (error) {
      console.error('Error fetching data:', error);
     }
    }

    fetchResponse();
  }, []);

  const formatTanggal = (tanggal) => {
    return new Date(tanggal).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  console.log(riwayat);
  // Data list perhitungan user
  const calculationHistory = [
    {
      id: 1,
      date: '2025-09-28',
      user: 'Petani Sukamaju',
      location: 'Lahan A - Sawah',
      topResult: 'Kotoran Hewan',
      score: 0.85,
      timestamp: '14:30'
    },
    {
      id: 2,
      date: '2025-09-27',
      user: 'Petani Sukamaju',
      location: 'Lahan B - Kebun',
      topResult: 'Limbah Dapur',
      score: 0.78,
      timestamp: '10:15'
    },
    {
      id: 3,
      date: '2025-09-25',
      user: 'Petani Sukamaju',
      location: 'Lahan C - Perkebunan',
      topResult: 'Jerami Padi',
      score: 0.72,
      timestamp: '16:45'
    }
  ];

  // Data kriteria
  const kriteria = [
    { code: 'K01', name: 'Kondisi Tanah', bobot: 0.20 },
    { code: 'K02', name: 'Keasaman Tanah (pH)', bobot: 0.10 },
    { code: 'K03', name: 'Genangan/Drainase', bobot: 0.20 },
    { code: 'K04', name: 'Sumber Air/Irigasi', bobot: 0.10 },
    { code: 'K05', name: 'Curah Hujan', bobot: 0.50 },
    { code: 'K06', name: 'Salinitas Air', bobot: 0.10 },
    { code: 'K07', name: 'Hara Makro (N-P-K)', bobot: 0.05 },
    { code: 'K08', name: 'Ukuran Lahan', bobot: 0.05 },
    { code: 'K09', name: 'Biaya/Harga', bobot: 0.10 },
    { code: 'K10', name: 'Kematangan Kompos', bobot: 0.05 }
  ];

  const alternatives = ['Jerami Padi', 'Kotoran Hewan', 'Limbah Dapur', 'Daun Kering'];

  // Data matriks perbandingan kriteria
  const criteriaMatrix = [
    [1, 1, 1.25, 1.6667, 2.5, 5, 2.5, 5, 5, 1.6667],
    [1, 1, 1.25, 1.6667, 2.5, 5, 2.5, 5, 5, 1.6667],
    [0.8, 0.8, 1, 1.3333, 2, 4, 2, 4, 4, 1.3333],
    [0.599988, 0.599988, 0.750019, 1, 1.5, 3, 1.5, 3, 3, 1],
    [0.4, 0.4, 0.5, 0.666667, 1, 2, 1, 2, 2, 0.6667],
    [0.2, 0.2, 0.25, 0.333333, 0.5, 1, 0.5, 1, 1, 0.3333],
    [0.4, 0.4, 0.5, 0.666667, 1, 2, 1, 2, 2, 0.6667],
    [0.2, 0.2, 0.25, 0.333333, 0.5, 1, 0.5, 1, 1, 0.3333],
    [0.2, 0.2, 0.25, 0.333333, 0.5, 1, 0.5, 1, 1, 0.3333],
    [0.599988, 0.599988, 0.750019, 1, 1.499925, 3.0003, 1.499925, 3.0003, 3.0003, 1]
  ];

  // Hasil akhir perhitungan
  const finalResults = [
    { nama: 'Kotoran Hewan', skor: 0.85, ranking: 1, rekomendasi: 'Sangat Direkomendasikan' },
    { nama: 'Limbah Dapur', skor: 0.72, ranking: 2, rekomendasi: 'Direkomendasikan' },
    { nama: 'Jerami Padi', skor: 0.68, ranking: 3, rekomendasi: 'Cukup Direkomendasikan' },
    { nama: 'Daun Kering', skor: 0.55, ranking: 4, rekomendasi: 'Kurang Direkomendasikan' }
  ];

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleViewDetail = (calculation) => {
    setSelectedCalculation(calculation);
  };

  const handleCloseDetail = () => {
    setSelectedCalculation(null);
  };

  const SectionHeader = ({ title, icon: Icon, section, color = "blue" }) => (
    <button
      onClick={() => toggleSection(section)}
      className={`w-full flex items-center justify-between p-4 bg-gradient-to-r from-${color}-50 to-${color}-100 rounded-lg border border-${color}-200 hover:from-${color}-100 hover:to-${color}-150 transition-all duration-200`}
    >
      <div className="flex items-center space-x-3">
        <Icon className={`h-6 w-6 text-${color}-600`} />
        <h2 className={`text-xl font-semibold text-${color}-800`}>{title}</h2>
      </div>
      {expandedSections[section] ? 
        <ChevronUp className={`h-5 w-5 text-${color}-600`} /> : 
        <ChevronDown className={`h-5 w-5 text-${color}-600`} />
      }
    </button>
  );

  // Jika belum ada yang dipilih, tampilkan list
  if (!selectedCalculation) {
    return (
      <div className="max-w-7xl mx-auto space-y-6 p-6">
        {/* Page Header */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl p-6 shadow-lg">
          <h1 className="text-3xl font-bold mb-2">Riwayat Perhitungan AHP</h1>
          <p className="text-green-100">Daftar hasil analisis rekomendasi pupuk kompos yang telah dilakukan</p>
        </div>

        {/* Calculation History List */}
        <div className="space-y-4">
          {riwayat.map((calc) => (
            <div
              key={calc.id_riwayat}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Left Section - Info */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">{formatTanggal(calc.tanggal)}</span>
                      {/* <span className="text-sm text-gray-400">{calc.timestamp}</span> */}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <User className="h-4 w-4" />
                      <span className="text-sm">{calc.nama}</span>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">{calc.hasil}</h3>
                    <div className="flex items-center gap-3">
                   
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        Skor: {calc.persen}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Section - Action Button */}
                <div>
                  <button
                    onClick={() => handleViewDetail(calc)}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium"
                  >
                    <Eye className="h-5 w-5" />
                    Lihat Detail
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State (jika tidak ada data) */}
        {calculationHistory.length === 0 && (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <Calculator className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Belum Ada Perhitungan</h3>
            <p className="text-gray-500">Mulai perhitungan pertama Anda untuk melihat riwayat di sini</p>
          </div>
        )}
      </div>
    );
  }

  // Jika ada yang dipilih, tampilkan detail lengkap
  return (
    <div className="max-w-7xl mx-auto space-y-6 p-6">
      {/* Back Button */}
      <button
        onClick={handleCloseDetail}
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
      >
        <X className="h-5 w-5" />
        Kembali ke List
      </button>

      {/* Page Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl p-6 shadow-lg">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Detail Hasil Perhitungan AHP</h1>
            <p className="text-green-100 mb-3">{selectedCalculation.location}</p>
            <div className="flex gap-4 text-sm">
              <span>📅 {selectedCalculation.date} | {selectedCalculation.timestamp}</span>
              <span>👤 {selectedCalculation.user}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section 1: Matriks Perbandingan Kriteria */}
      <div className="space-y-4">
        <SectionHeader 
          title="1. Matriks Perbandingan Berpasangan Kriteria" 
          icon={Calculator}
          section="criteriaComparison"
          color="blue"
        />
        
        {expandedSections.criteriaComparison && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="mb-4">
              <p className="text-gray-600 mb-4">
                Matriks perbandingan berpasangan antar kriteria berdasarkan skala kepentingan Saaty (1-9)
              </p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-2 text-sm font-semibold">Kode</th>
                    {kriteria.map((k, idx) => (
                      <th key={idx} className="border border-gray-300 p-2 text-sm font-semibold">{k.code}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {kriteria.map((row, rowIdx) => (
                    <tr key={rowIdx} className={rowIdx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="border border-gray-300 p-2 font-semibold text-center bg-gray-100">{row.code}</td>
                      {criteriaMatrix[rowIdx].map((value, colIdx) => (
                        <td 
                          key={colIdx} 
                          className={`border border-gray-300 p-2 text-center text-sm ${
                            rowIdx === colIdx 
                              ? 'bg-green-200 font-bold' 
                              : value >= 2 
                                ? 'bg-red-100' 
                                : 'bg-white'
                          }`}
                        >
                          {typeof value === 'number' ? value.toFixed(value < 1 ? 6 : 2) : value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Keterangan:</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-200 border"></div>
                  <span>Diagonal utama (nilai = 1)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-100 border"></div>
                  <span>Nilai kepentingan tinggi (≥ 2)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-white border"></div>
                  <span>Nilai kepentingan rendah (&lt; 2)</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Section 2: Matriks Perbandingan Alternatif */}
      <div className="space-y-4">
        <SectionHeader 
          title="2. Matriks Perbandingan Alternatif untuk Setiap Kriteria" 
          icon={TrendingUp}
          section="alternativeComparison"
          color="green"
        />
        
        {expandedSections.alternativeComparison && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <p className="text-gray-600 mb-6">
              Perbandingan alternatif pupuk untuk setiap kriteria. Setiap kriteria memiliki matriks perbandingan tersendiri.
            </p>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {kriteria.slice(0, 4).map((criterion, idx) => (
                <div key={idx} className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-3">{criterion.code} - {criterion.name}</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300 text-sm">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 p-1">Alt</th>
                          <th className="border border-gray-300 p-1">A1</th>
                          <th className="border border-gray-300 p-1">A2</th>
                          <th className="border border-gray-300 p-1">A3</th>
                          <th className="border border-gray-300 p-1">A4</th>
                        </tr>
                      </thead>
                      <tbody>
                        {alternatives.map((alt, altIdx) => (
                          <tr key={altIdx}>
                            <td className="border border-gray-300 p-1 bg-gray-100 font-semibold">A{altIdx + 1}</td>
                            {[1, 2, 3, 4].map((val, valIdx) => (
                              <td key={valIdx} className={`border border-gray-300 p-1 text-center ${
                                altIdx === valIdx ? 'bg-green-200 font-bold' : 'bg-white'
                              }`}>
                                {altIdx === valIdx ? '1' : (Math.random() * 3 + 0.5).toFixed(2)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
              <p className="text-yellow-800 text-sm">
                📝 <strong>Catatan:</strong> Tampilan di atas menunjukkan contoh 4 kriteria pertama. 
                Dalam implementasi lengkap, semua 10 kriteria akan memiliki matriks perbandingan alternatif masing-masing.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Section 3: Perhitungan dan Konsistensi */}
      <div className="space-y-4">
        <SectionHeader 
          title="3. Perhitungan Bobot dan Uji Konsistensi" 
          icon={FileText}
          section="calculations"
          color="purple"
        />
        
        {expandedSections.calculations && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Bobot Kriteria */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800 text-lg">Bobot Kriteria (Eigenvector)</h4>
                <div className="space-y-2">
                  {kriteria.map((k, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">{k.code} - {k.name}</span>
                      <span className="font-bold text-purple-600">{(k.bobot * 100).toFixed(1)}%</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Uji Konsistensi */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800 text-lg">Uji Konsistensi</h4>
                <div className="space-y-4">
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-600">λ max</div>
                        <div className="text-xl font-bold text-purple-600">10.45</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">CI (Consistency Index)</div>
                        <div className="text-xl font-bold text-purple-600">0.050</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">RI (Random Index)</div>
                        <div className="text-xl font-bold text-purple-600">1.49</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">CR (Consistency Ratio)</div>
                        <div className="text-xl font-bold text-green-600">0.034</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-green-100 rounded-lg border border-green-300">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="font-semibold text-green-800">Matriks KONSISTEN</span>
                    </div>
                    <p className="text-green-700 text-sm mt-1">
                      CR = 0.034 &lt; 0.1, sehingga perbandingan dapat diterima
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Section 4: Hasil Akhir */}
      <div className="space-y-4">
        <SectionHeader 
          title="4. Hasil Akhir dan Ranking" 
          icon={CheckCircle}
          section="finalResults"
          color="green"
        />
        
        {expandedSections.finalResults && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            {/* Ranking Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {finalResults.map((result, index) => (
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
                      <span className="font-bold text-lg">{result.ranking}</span>
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
                      <div className="text-sm text-gray-600">Skor Akhir</div>
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

            {/* Detail Analysis */}
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h4 className="font-semibold text-green-800 mb-3 text-lg">🏆 Rekomendasi Terbaik: Kotoran Hewan</h4>
                <p className="text-green-700 mb-4">
                  Berdasarkan perhitungan AHP, kotoran hewan menunjukkan skor tertinggi dengan nilai 0.85 (85%). 
                  Hal ini dikarenakan keunggulannya dalam beberapa kriteria kunci.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h5 className="font-semibold mb-2">Keunggulan:</h5>
                    <ul className="space-y-1 text-green-600">
                      <li>• Kandungan nutrisi N-P-K seimbang</li>
                      <li>• Mudah diperoleh dan ekonomis</li>
                      <li>• Cocok untuk berbagai kondisi tanah</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold mb-2">Tips Penggunaan:</h5>
                    <ul className="space-y-1 text-green-600">
                      <li>• Pastikan sudah matang sempurna</li>
                      <li>• Aplikasi 2-3 ton per hektar</li>
                      <li>• Kombinasikan dengan mikroorganisme</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <p className="text-gray-600 text-sm">
          Sistem Pendukung Keputusan menggunakan metode AHP (Analytical Hierarchy Process) 
          untuk memberikan rekomendasi pupuk kompos terbaik berdasarkan kondisi lahan Anda.
        </p>
      </div>
    </div>
  );
};

export default ComprehensiveResultsPage;