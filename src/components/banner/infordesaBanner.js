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

 const InfordesaBanner = () => {
  return (
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
  )
}


export default InfordesaBanner