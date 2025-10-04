"use client";

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Leaf, 
  Settings,
  TrendingUp,
  Award,
  FileText,
  ChevronDown,
  Search,
  Bell,
  LogOut,
  Menu,
  X,
  BarChart3,
  Package,
  Calculator,
  CheckCircle,
  AlertCircle,
  Activity,
  Target,
  Layers,
  User,
  User2Icon,
  LeafIcon,
  History,
  ListCheck,
  RefreshCw
} from 'lucide-react';
import axios from 'axios';
import Link from 'next/link';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [notifications, setNotifications] = useState(3);
  const [totalPetani, setTotalPetani] = useState(0);
  const [totalPupuk, setTotalPupuk] = useState(0);
  const [totalKriteria, setTotalKriteria] = useState(0);
  const [totalRiwayat, setTotalRiwayat] = useState(0);
  const [allRiwayat, setAllRiwayat] = useState([]);
  const [recentAnalysis, setRecentAnalysis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const API_URL = process.env.NEXT_PUBLIC_API_URL 

      const [pupukResponse, petaniResponse, kriteriaResponse, riwayatResponse, riwayatUserResponse] = await Promise.all([
        axios.get(`${API_URL}/api/alternatif`),
        axios.get(`${API_URL}/api/users`),
        axios.get(`${API_URL}/api/criteria`),
        axios.get(`${API_URL}/api/riwayat/getAllRiwayat`),
        axios.get(`${API_URL}/api/riwayat/getRiwayatUsers`)
      ]);

      
      
      // Set stats data
      setTotalPetani(petaniResponse.data.data.filter(user => user.level === 'petani').length);
      setTotalPupuk(pupukResponse.data.data.length);
      setTotalKriteria(kriteriaResponse.data.data.length);
      setTotalRiwayat(riwayatResponse.data.data.length);
      setAllRiwayat(riwayatUserResponse.data.data);

      // Transform data for recent analysis table
      const transformedData = riwayatUserResponse.data.data.slice(0, 5).map(item => ({
        id: item.id_riwayat,
        kode_input: item.kode_input,
        farmer: item.nama_user,
        fertilizer: item.hasil,
        score: (item.persen / 100).toFixed(3),
        scorePercent: item.persen.toFixed(2),
        status: item.persen >= 37 ? 'Terbaik' : 'Baik',
        date: new Date(item.tanggal).toLocaleDateString('id-ID', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        })
      }));
      
      setRecentAnalysis(transformedData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Gagal memuat data. Silakan coba lagi.');
      setLoading(false);
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'petani', label: 'Data Petani', icon: Users },
    { id: 'pupuk', label: 'Data Pupuk', icon: Leaf },
    { id: 'kriteria', label: 'Kriteria AHP', icon: Layers },
    { id: 'perhitungan', label: 'Perhitungan AHP', icon: Calculator },
    { id: 'laporan', label: 'Laporan', icon: FileText },
    { id: 'settings', label: 'Pengaturan', icon: Settings }
  ];



  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-green-50">
 

      {/* Main Content */}
      <div className={`transition-all duration-300 `}>
     

        {/* Content Area */}
        <main className="p-4 md:p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Petani */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <User2Icon className="h-7 w-7 text-white" />
                </div>
                {loading && <RefreshCw className="h-5 w-5 text-gray-400 animate-spin" />}
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">Total Petani</h3>
              <p className="text-3xl font-bold text-gray-800">{loading ? '...' : totalPetani}</p>
            </div>

            {/* Jenis Pupuk */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                  <LeafIcon className="h-7 w-7 text-white" />
                </div>
                {loading && <RefreshCw className="h-5 w-5 text-gray-400 animate-spin" />}
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">Jenis Pupuk</h3>
              <p className="text-3xl font-bold text-gray-800">{loading ? '...' : totalPupuk}</p>
            </div>

            {/* Kriteria */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <ListCheck className="h-7 w-7 text-white" />
                </div>
                {loading && <RefreshCw className="h-5 w-5 text-gray-400 animate-spin" />}
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">Jumlah Kriteria</h3>
              <p className="text-3xl font-bold text-gray-800">{loading ? '...' : totalKriteria}</p>
            </div>

            {/* Riwayat */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                  <History className="h-7 w-7 text-white" />
                </div>
                {loading && <RefreshCw className="h-5 w-5 text-gray-400 animate-spin" />}
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">Jumlah Riwayat</h3>
              <p className="text-3xl font-bold text-gray-800">{loading ? '...' : totalRiwayat}</p>
            </div>
          </div>

          {/* Recent Analysis Table */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Analisis Terbaru</h2>
                <p className="text-sm text-gray-500">Hasil perhitungan AHP terkini</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={fetchData}
                  disabled={loading}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors text-sm font-semibold flex items-center gap-2 disabled:opacity-50"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
                <Link href="/admin/riwayat-rekomendasi" className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors text-sm font-semibold">Lihat Semua</Link>
               
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-3">
                  <RefreshCw className="h-8 w-8 text-green-600 animate-spin" />
                  <p className="text-gray-500">Memuat data...</p>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-3">
                  <AlertCircle className="h-8 w-8 text-red-500" />
                  <p className="text-red-500">{error}</p>
                  <button 
                    onClick={fetchData}
                    className="px-4 py-2 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-colors text-sm font-semibold"
                  >
                    Coba Lagi
                  </button>
                </div>
              </div>
            ) : recentAnalysis.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-3">
                  <FileText className="h-8 w-8 text-gray-400" />
                  <p className="text-gray-500">Belum ada data riwayat</p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Kode</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Petani</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Pupuk</th>
                      {/* <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Skor AHP</th> */}
                      {/* <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Persentase</th> */}
                      {/* <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Status</th> */}
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Tanggal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allRiwayat.map(item => (
    <tr key={item.id_riwayat} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <td className="py-3 px-4">
        <p className="font-medium text-gray-800">{item.nama_user}</p>
      </td>
      <td className="py-3 px-4 text-gray-600">{item.hasil}</td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <div className="w-16 bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
              style={{ width: `${item.persen}%` }}
            ></div>
          </div>
          <span className="text-sm font-semibold text-gray-700">{item.persen.toFixed(2)}%</span>
        </div>
      </td>
      {/* <td className="py-3 px-4">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            item.persen === Math.max(...allRiwayat.map(r => r.persen))
              ? "bg-green-100 text-green-700"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          {item.persen === Math.max(...allRiwayat.map(r => r.persen)) ? "Terbaik" : "Proses"}
        </span>
      </td> */}
      <td className="py-3 px-4 text-sm text-gray-500">
        {new Date(item.tanggal).toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </td>
    </tr>
  ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;