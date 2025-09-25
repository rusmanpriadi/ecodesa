"use client"

import React, { useState } from 'react';
import { 
  MapPin, 
  Users, 
  Leaf, 
  Sprout, 
  Image as ImageIcon, 
  Phone, 
  Mail, 
  Calendar,
  Award,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Menu,
  X
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Header/Navigation */}
      <header className="bg-white/90 backdrop-blur-md shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-2 rounded-xl">
                <Leaf className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">EcoDesa</h1>
                <p className="text-sm text-gray-600">Pupuk Organik Digital</p>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a href="#home" className="text-gray-700 hover:text-green-600 transition-colors font-medium">Beranda</a>
              <a href="#desa" className="text-gray-700 hover:text-green-600 transition-colors font-medium">Info Desa</a>
              <a href="#petani" className="text-gray-700 hover:text-green-600 transition-colors font-medium">Petani</a>
              <a href="#pupuk" className="text-gray-700 hover:text-green-600 transition-colors font-medium">Pupuk</a>
              <a href="#galeri" className="text-gray-700 hover:text-green-600 transition-colors font-medium">Galeri</a>
              <a href="#kontak" className="text-gray-700 hover:text-green-600 transition-colors font-medium">Kontak</a>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <nav className="flex flex-col space-y-3">
                <a href="#home" className="text-gray-700 hover:text-green-600 transition-colors font-medium py-2">Beranda</a>
                <a href="#desa" className="text-gray-700 hover:text-green-600 transition-colors font-medium py-2">Info Desa</a>
                <a href="#petani" className="text-gray-700 hover:text-green-600 transition-colors font-medium py-2">Petani</a>
                <a href="#pupuk" className="text-gray-700 hover:text-green-600 transition-colors font-medium py-2">Pupuk</a>
                <a href="#galeri" className="text-gray-700 hover:text-green-600 transition-colors font-medium py-2">Galeri</a>
                <a href="#kontak" className="text-gray-700 hover:text-green-600 transition-colors font-medium py-2">Kontak</a>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-emerald-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Revolusi <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">Digital</span> Pertanian Organik
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Platform inovatif untuk pemilihan dan distribusi pupuk kompos organik berkualitas tinggi di desa Anda. Mendukung pertanian berkelanjutan dengan teknologi modern.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2">
                  <span>Mulai Sekarang</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
                <button className="border-2 border-green-600 text-green-600 px-8 py-4 rounded-xl font-semibold hover:bg-green-50 transition-all duration-300">
                  Pelajari Lebih Lanjut
                </button>
              </div>

              <div className="grid grid-cols-3 gap-8 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">500+</div>
                  <div className="text-sm text-gray-600">Petani Terdaftar</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">15</div>
                  <div className="text-sm text-gray-600">Jenis Pupuk</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">98%</div>
                  <div className="text-sm text-gray-600">Tingkat Kepuasan</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-green-400 to-emerald-500 rounded-3xl p-8 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="bg-white rounded-2xl p-6 transform -rotate-3">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Sprout className="h-8 w-8 text-green-600" />
                      <div>
                        <div className="font-semibold text-gray-900">Aplikasi EcoDesa</div>
                        <div className="text-sm text-gray-600">Pupuk Organik Digital</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="bg-gray-100 rounded-lg p-3">
                        <div className="text-sm font-medium">Pupuk Kompos Premium</div>
                        <div className="text-xs text-gray-600">Tersedia 50 karung</div>
                      </div>
                      <div className="bg-green-50 rounded-lg p-3">
                        <div className="text-sm font-medium text-green-800">Status: Siap Distribusi</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Info Desa Section */}
      <section id="desa" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Informasi Desa</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Desa Makmur Jaya - Pusat Inovasi Pertanian Organik yang Berkelanjutan
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-green-600 mx-auto mb-3" />
                    <div className="text-2xl font-bold text-gray-900">2,500 Ha</div>
                    <div className="text-sm text-gray-600">Luas Wilayah</div>
                  </div>
                  <div className="text-center">
                    <Users className="h-12 w-12 text-green-600 mx-auto mb-3" />
                    <div className="text-2xl font-bold text-gray-900">1,250</div>
                    <div className="text-sm text-gray-600">Jumlah KK</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-900">Profil Desa</h3>
                <p className="text-gray-600 leading-relaxed">
                  Desa Makmur Jaya merupakan desa percontohan dalam implementasi teknologi digital untuk mendukung pertanian organik. Dengan komitmen terhadap lingkungan dan kesejahteraan petani, desa ini telah mengembangkan sistem manajemen pupuk kompos organik yang inovatif.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-gray-700">Sertifikat Organik</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-gray-700">Teknologi Digital</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-gray-700">Ramah Lingkungan</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-gray-700">Berkelanjutan</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-3xl p-8">
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <h4 className="text-xl font-bold text-gray-900 mb-4">Struktur Organisasi</h4>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <Users className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Kepala Desa</div>
                        <div className="text-sm text-gray-600">Budi Santoso, S.P.</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <Leaf className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Kepala Seksi Pertanian</div>
                        <div className="text-sm text-gray-600">Siti Aminah, S.P.</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <TrendingUp className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Koordinator IT</div>
                        <div className="text-sm text-gray-600">Ahmad Wijaya, S.Kom.</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Petani Section */}
      <section id="petani" className="py-20 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Data Petani</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Komunitas petani organik yang terdaftar dalam sistem aplikasi desa
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-center">
                <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <div className="text-3xl font-bold text-gray-900 mb-2">523</div>
                <div className="text-gray-600">Total Petani</div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-center">
                <Award className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <div className="text-3xl font-bold text-gray-900 mb-2">89</div>
                <div className="text-gray-600">Petani Bersertifikat</div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-center">
                <Sprout className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <div className="text-3xl font-bold text-gray-900 mb-2">1,800</div>
                <div className="text-gray-600">Lahan (Ha)</div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <div className="text-3xl font-bold text-gray-900 mb-2">95%</div>
                <div className="text-gray-600">Produktivitas</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Petani Terdaftar Terbaru</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: "Pak Joko Widodo", area: "2.5 Ha", crop: "Padi Organik", status: "Aktif" },
                { name: "Bu Sari Indah", area: "1.8 Ha", crop: "Sayuran", status: "Aktif" },
                { name: "Pak Budi Santoso", area: "3.2 Ha", crop: "Jagung", status: "Aktif" },
                { name: "Bu Rina Sari", area: "1.5 Ha", crop: "Cabai", status: "Baru" },
                { name: "Pak Ahmad Ali", area: "2.1 Ha", crop: "Tomat", status: "Aktif" },
                { name: "Bu Maya Dewi", area: "1.9 Ha", crop: "Bawang", status: "Baru" }
              ].map((petani, index) => (
                <div key={index} className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <Users className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{petani.name}</div>
                      <div className="text-sm text-gray-600">Luas Lahan: {petani.area}</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Komoditas:</span>
                      <span className="text-sm font-medium text-gray-900">{petani.crop}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Status:</span>
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                        petani.status === 'Aktif' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {petani.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pupuk Section */}
      <section id="pupuk" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Katalog Pupuk Kompos Organik</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Berbagai pilihan pupuk kompos organik berkualitas tinggi untuk kebutuhan pertanian Anda
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Kompos Premium",
                type: "Pupuk Dasar",
                price: "Rp 25,000/karung",
                stock: 150,
                description: "Kompos matang dengan kandungan hara lengkap",
                benefits: ["Meningkatkan kesuburan tanah", "Ramah lingkungan", "Hasil panen berkualitas"]
              },
              {
                name: "Kompos Plus",
                type: "Pupuk Khusus",
                price: "Rp 35,000/karung",
                stock: 80,
                description: "Kompos diperkaya dengan mikroorganisme aktif",
                benefits: ["Memperbaiki struktur tanah", "Meningkatkan daya serap air", "Anti penyakit tanaman"]
              },
              {
                name: "Kompos Cair",
                type: "Pupuk Foliar",
                price: "Rp 15,000/liter",
                stock: 200,
                description: "Pupuk organik cair untuk penyemprotan daun",
                benefits: ["Mudah diserap tanaman", "Pertumbuhan lebih cepat", "Praktis digunakan"]
              },
              {
                name: "Kompos Bokashi",
                type: "Pupuk Fermentasi",
                price: "Rp 30,000/karung",
                stock: 120,
                description: "Kompos fermentasi dengan teknologi Jepang",
                benefits: ["Fermentasi sempurna", "Kandungan probiotik tinggi", "Meningkatkan pH tanah"]
              },
              {
                name: "Kompos Vermicompost",
                type: "Pupuk Cacing",
                price: "Rp 40,000/karung",
                stock: 60,
                description: "Kompos hasil olahan cacing tanah",
                benefits: ["Kaya nutrisi mikro", "Tekstur halus", "Hasil premium"]
              },
              {
                name: "Kompos Hijau",
                type: "Pupuk Dedaunan",
                price: "Rp 20,000/karung",
                stock: 100,
                description: "Kompos dari dedaunan dan sampah hijau",
                benefits: ["Meningkatkan bahan organik", "Memperbaiki aerasi tanah", "Ekonomis"]
              }
            ].map((pupuk, index) => (
              <div key={index} className="bg-gradient-to-br from-white to-green-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-green-100">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Leaf className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{pupuk.name}</h3>
                  <p className="text-sm text-green-600 font-medium">{pupuk.type}</p>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 mb-1">{pupuk.price}</div>
                    <div className="text-sm text-gray-600">Stok tersisa: {pupuk.stock} unit</div>
                  </div>

                  <p className="text-gray-600 text-sm leading-relaxed">{pupuk.description}</p>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900 text-sm">Keunggulan:</h4>
                    <ul className="space-y-1">
                      {pupuk.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="space-y-3">
                  <button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300">
                    Pilih Pupuk
                  </button>
                  <button className="w-full border border-green-600 text-green-600 py-3 rounded-xl font-semibold hover:bg-green-50 transition-all duration-300">
                    Detail Produk
                  </button>
                </div>
              </div>
            ))}
          </div>

          <Alert className="mt-12 border-green-200 bg-green-50">
            <Leaf className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <strong>Info Penting:</strong> Semua pupuk kompos telah tersertifikasi organik dan aman untuk lingkungan. 
              Konsultasikan dengan petugas lapangan untuk rekomendasi pupuk yang sesuai dengan jenis tanaman Anda.
            </AlertDescription>
          </Alert>
        </div>
      </section>

      {/* Galeri Section */}
      <section id="galeri" className="py-20 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Galeri Kegiatan</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Dokumentasi kegiatan pertanian organik dan distribusi pupuk kompos di desa
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Proses Pembuatan Kompos",
                description: "Petani sedang membuat kompos dari limbah organik",
                category: "Produksi"
              },
              {
                title: "Distribusi Pupuk",
                description: "Kegiatan distribusi pupuk kompos ke petani",
                category: "Distribusi"
              },
              {
                title: "Sosialisasi Aplikasi",
                description: "Pelatihan penggunaan aplikasi kepada petani",
                category: "Pelatihan"
              },
              {
                title: "Hasil Panen Organik",
                description: "Panen sayuran organik dengan pupuk kompos",
                category: "Hasil"
              },
              {
                title: "Pengujian Kualitas",
                description: "Tim ahli menguji kualitas pupuk kompos",
                category: "Quality Control"
              },
              {
                title: "Workshop Pertanian",
                description: "Workshop teknik pertanian organik modern",
                category: "Edukasi"
              }
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="relative bg-gradient-to-br from-green-400 to-emerald-500 h-48 flex items-center justify-center">
                  <ImageIcon className="h-16 w-16 text-white/80" />
                  <div className="absolute top-4 right-4">
                    <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
                      {item.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{item.description}</p>
                  <div className="flex items-center text-green-600 text-sm font-medium">
                    <Calendar className="h-4 w-4 mr-2" />
                    Foto terbaru
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300">
              Lihat Semua Galeri
            </button>
          </div>
        </div>
      </section>

      {/* Kontak Section */}
      <section id="kontak" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Hubungi Kami</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tim kami siap membantu Anda dalam mengoptimalkan penggunaan pupuk kompos organik
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Informasi Kontak</h3>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Alamat Kantor Desa</h4>
                      <p className="text-gray-600">Jl. Raya Makmur No. 123, Desa Makmur Jaya, Kecamatan Sejahtera, Kabupaten Hijau, Provinsi Organik 12345</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Nomor Telepon</h4>
                      <p className="text-gray-600">+62 21 1234 5678</p>
                      <p className="text-gray-600">+62 812 3456 7890 (WhatsApp)</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Email</h4>
                      <p className="text-gray-600">info@ecodesa-makmurjaya.id</p>
                      <p className="text-gray-600">pertanian@ecodesa-makmurjaya.id</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Calendar className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Jam Operasional</h4>
                      <p className="text-gray-600">Senin - Jumat: 08:00 - 16:00 WIB</p>
                      <p className="text-gray-600">Sabtu: 08:00 - 12:00 WIB</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl p-8 text-white">
                <h3 className="text-xl font-bold mb-4">Layanan Konsultasi Gratis</h3>
                <p className="text-green-100 mb-6">
                  Dapatkan konsultasi gratis dari ahli pertanian organik kami untuk memilih pupuk kompos yang tepat untuk tanaman Anda.
                </p>
                <button className="bg-white text-green-600 px-6 py-3 rounded-xl font-semibold hover:bg-green-50 transition-all duration-300 w-full sm:w-auto">
                  Jadwalkan Konsultasi
                </button>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-gray-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Kirim Pesan</h3>
              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                      placeholder="Masukkan nama lengkap"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nomor Telepon</label>
                    <input
                      type="tel"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                      placeholder="08xx xxxx xxxx"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                    placeholder="nama@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kategori Pertanyaan</label>
                  <select className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300">
                    <option value="">Pilih kategori</option>
                    <option value="pupuk">Konsultasi Pupuk</option>
                    <option value="aplikasi">Bantuan Aplikasi</option>
                    <option value="distribusi">Distribusi Pupuk</option>
                    <option value="kemitraan">Kemitraan</option>
                    <option value="lainnya">Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pesan</label>
                  <textarea
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                    placeholder="Tulis pesan Anda di sini..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                  Kirim Pesan
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Company Info */}
            <div className="col-span-1 lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-3 rounded-xl">
                  <Leaf className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">EcoDesa</h3>
                  <p className="text-gray-400">Pupuk Organik Digital</p>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed mb-6 max-w-md">
                Platform digital inovatif untuk mendukung pertanian organik berkelanjutan dengan sistem manajemen pupuk kompos yang modern dan efisien.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center hover:bg-green-700 transition-colors cursor-pointer">
                  <span className="text-sm font-bold">f</span>
                </div>
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center hover:bg-green-700 transition-colors cursor-pointer">
                  <span className="text-sm font-bold">@</span>
                </div>
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center hover:bg-green-700 transition-colors cursor-pointer">
                  <span className="text-sm font-bold">in</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Tautan Cepat</h4>
              <ul className="space-y-3">
                <li><a href="#home" className="text-gray-300 hover:text-green-400 transition-colors">Beranda</a></li>
                <li><a href="#desa" className="text-gray-300 hover:text-green-400 transition-colors">Info Desa</a></li>
                <li><a href="#petani" className="text-gray-300 hover:text-green-400 transition-colors">Data Petani</a></li>
                <li><a href="#pupuk" className="text-gray-300 hover:text-green-400 transition-colors">Katalog Pupuk</a></li>
                <li><a href="#galeri" className="text-gray-300 hover:text-green-400 transition-colors">Galeri</a></li>
                <li><a href="#kontak" className="text-gray-300 hover:text-green-400 transition-colors">Kontak</a></li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Layanan</h4>
              <ul className="space-y-3">
                <li><span className="text-gray-300">Konsultasi Pertanian</span></li>
                <li><span className="text-gray-300">Distribusi Pupuk</span></li>
                <li><span className="text-gray-300">Pelatihan Digital</span></li>
                <li><span className="text-gray-300">Monitoring Kualitas</span></li>
                <li><span className="text-gray-300">Sertifikasi Organik</span></li>
                <li><span className="text-gray-300">Dukungan Teknis</span></li>
              </ul>
            </div>
          </div>

          {/* Newsletter */}
          <div className="border-t border-gray-700 pt-12 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h4 className="text-xl font-semibold mb-2">Berlangganan Newsletter</h4>
                <p className="text-gray-400">Dapatkan info terbaru tentang pertanian organik dan inovasi pupuk kompos</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Masukkan email Anda"
                  className="flex-1 px-4 py-3 rounded-xl bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <button className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300">
                  Berlangganan
                </button>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-700 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-gray-400 text-sm">
                © 2024 EcoDesa - Desa Makmur Jaya. Hak Cipta Dilindungi.
              </div>
              <div className="flex space-x-6 text-sm text-gray-400">
                <a href="#" className="hover:text-green-400 transition-colors">Kebijakan Privasi</a>
                <a href="#" className="hover:text-green-400 transition-colors">Syarat & Ketentuan</a>
                <a href="#" className="hover:text-green-400 transition-colors">Bantuan</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;