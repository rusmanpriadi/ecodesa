"use client";

import React, { useState, useEffect } from 'react'
import { 
  Leaf, 
  CheckCircle,
  AlertCircle,
  Loader2,
  ShoppingCart,
  Info
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import axios from 'axios';

const PupukBanner = () => {
  const [pupukData, setPupukData] = useState([]);
 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPupuk, setSelectedPupuk] = useState(null);

  useEffect(() => {
    fetchPupukData();
  }, []);

  const fetchPupukData = async () => {
    try {
      setLoading(true);
      // Replace with your actual API endpoint
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/alternatif`);
      const result = await response.json();
     
      if (result.status && result.data) {
        setPupukData(result.data);
      } else {
        setError('Gagal memuat data');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat memuat data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    if (!price) return 'Hubungi Kami';
    return `Rp ${price.toLocaleString('id-ID')}`;
  };

  const truncateText = (text, maxLength = 150) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };



  if (loading) {
    return (
      <section id="pupuk" className="py-20 bg-gradient-to-b from-green-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <Loader2 className="h-12 w-12 text-green-600 animate-spin mb-4" />
            <p className="text-gray-600 text-lg">Memuat data pupuk...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="pupuk" className="py-20 bg-gradient-to-b from-green-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        </div>
      </section>
    );
  }

  return (
    <section id="pupuk" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-green-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Katalog Pupuk Kompos Organik</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Berbagai pilihan pupuk kompos organik berkualitas tinggi untuk kebutuhan pertanian Anda
            </p>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {pupukData.map((pupuk) => (
            <div 
              key={pupuk.id} 
              className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-green-300 flex flex-col"
            >
              {/* Image Container */}
              <div className="relative h-48 sm:h-56 bg-gradient-to-br from-green-100 to-emerald-100 overflow-hidden">
                {pupuk.images ? (
                  <img 
                    src={`${pupuk.images}`}
                    alt={pupuk.pupuk}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div 
                  className={`w-full h-full ${pupuk.images ? 'hidden' : 'flex'} items-center justify-center`}
                  style={{ display: pupuk.images ? 'none' : 'flex' }}
                >
                  <Leaf className="h-20 w-20 text-green-600 opacity-30" />
                </div>
                
                {/* Badge */}
                <div className="absolute top-4 right-4">
                  <span className="bg-white/90 backdrop-blur-sm text-green-700 px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                    {pupuk.kode_alternatif}
                  </span>
                </div>

              
              </div>

              {/* Content */}
              <div className="p-6 flex-grow flex flex-col">
                <div className="flex-grow">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                    {pupuk.pupuk}
                  </h3>
                  
                  {pupuk.jenis && (
                    <p className="text-sm text-green-600 font-medium mb-3 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      {pupuk.jenis}
                    </p>
                  )}
                    {/* Price Tag */}
                {pupuk.harga && (
                  <div className=" bottom-4 left-4">
                    <div className="text-lg font-bold text-gray-900 mb-1">
                      {formatPrice(pupuk.harga)}/Karung
                    </div>
                  </div>
                )}

                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {truncateText(pupuk.deskripsi)}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 mt-4">
                  <button 
                    onClick={() => setSelectedPupuk(pupuk)}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Info className="h-5 w-5" />
                    Lihat Detail
                  </button>
                  {/* <button className="w-full border-2 border-green-600 text-green-600 py-3 rounded-xl font-semibold hover:bg-green-50 transition-all duration-300 flex items-center justify-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    Pesan Sekarang
                  </button> */}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Info Alert */}
        <Alert className="mt-12 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
          <Leaf className="h-5 w-5 text-green-600" />
          <AlertDescription className="text-green-800 text-sm sm:text-base">
            <strong className="font-bold">ℹ️ Informasi Penting:</strong> Semua pupuk kompos telah tersertifikasi organik dan aman untuk lingkungan. 
            Konsultasikan dengan tim kami untuk rekomendasi pupuk yang sesuai dengan jenis tanaman Anda.
          </AlertDescription>
        </Alert>

        {/* Modal Detail */}
        {selectedPupuk && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedPupuk(null)}
          >
            <div 
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <h3 className="text-2xl font-bold text-gray-900">{selectedPupuk.pupuk}</h3>
                <button 
                  onClick={() => setSelectedPupuk(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>
              
              <div className="p-6">
                {selectedPupuk.images && (
                  <img 
                    src={`${selectedPupuk.images}`}
                    alt={selectedPupuk.pupuk}
                    className="w-full h-64 object-cover rounded-xl mb-6"
                  />
                )}
                
                <div className="space-y-4">
                  <div>
                    <span className="text-sm text-gray-500 font-medium">Kode Produk</span>
                    <p className="text-lg font-semibold text-gray-900">{selectedPupuk.kode_alternatif}</p>
                  </div>
                  
                  {selectedPupuk.jenis && (
                    <div>
                      <span className="text-sm text-gray-500 font-medium">Jenis</span>
                      <p className="text-lg font-semibold text-green-600">{selectedPupuk.jenis}</p>
                    </div>
                  )}
                  
                  {selectedPupuk.harga && (
                    <div>
                      <span className="text-sm text-gray-500 font-medium">Harga</span>
                      <p className="text-2xl font-bold text-green-600">{formatPrice(selectedPupuk.harga)}</p>
                    </div>
                  )}
                  
                  <div>
                    <span className="text-sm text-gray-500 font-medium mb-2 block">Deskripsi Lengkap</span>
                    <p className="text-gray-700 leading-relaxed">{selectedPupuk.deskripsi}</p>
                  </div>
                </div>
                
                <button 
                  className="w-full mt-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-bold hover:shadow-lg transition-all duration-300"
                  onClick={() => setSelectedPupuk(null)}
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default PupukBanner;