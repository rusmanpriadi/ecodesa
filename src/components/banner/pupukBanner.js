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
import { Alert, AlertDescription } from '@/components/ui/alert';

 const PupukBanner = () => {
  return (
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
  )
}

export default PupukBanner