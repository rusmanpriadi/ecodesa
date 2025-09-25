import React from 'react'
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

 const HeroBanner = () => {
  return (
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
  )
}

export default HeroBanner
