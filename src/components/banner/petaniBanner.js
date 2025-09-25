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

 const PetaniBanner = () => {
  return (
     <section id="petani" className="py-20 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Data Petani (Kondisi Tanah)</h2>
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
  )
}

export default PetaniBanner