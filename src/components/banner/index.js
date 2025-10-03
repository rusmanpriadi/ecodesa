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
  X,
  EarIcon,
  Earth,
  Facebook
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

import GaleriBanner from '@/components/banner/galeriBanner';
import KontakBanner from '@/components/banner/kontakBanner';
import InfordesaBanner from '@/components/banner/infordesaBanner';
import PupukBanner from '@/components/banner/pupukBanner';
import PetaniBanner from '@/components/banner/petaniBanner';
import HeroBanner from '@/components/banner/heroBanner';
import HeaderBanner from '@/components/banner/headerBanner';
import LoginButton from '@/components/banner/loginButton'; // Import LoginButton di sini
import Link from 'next/link';
import { MdWebStories } from 'react-icons/md';
import { FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa';

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Pindahkan state login ke sini
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Header/Navigation */}
      <HeaderBanner 
        toggleMenu={toggleMenu} 
        isMenuOpen={isMenuOpen}
        // Pass function untuk open modal
        setIsLoginOpen={setIsLoginOpen}
      />

      {/* Hero Section */}
      <HeroBanner />

      {/* Info Desa Section */}
      <InfordesaBanner />

      {/* Petani Section */}
      {/* <PetaniBanner /> */}

      {/* Pupuk Section */}
      <PupukBanner />

      {/* Galeri Section */}
      <GaleriBanner />

      {/* Kontak Section */}
      {/* <KontakBanner /> */}

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className=" gap-8">
            {/* Company Info */}
               <div className="grid grid-cols-5 gap-8">
  {/* Kontak Utama */}
  <div className="col-span-3 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl p-8 text-white">
    <h3 className="text-2xl font-bold mb-6">Informasi Kontak</h3>
    <div className="space-y-6">
      {/* Alamat */}
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
          <MapPin className="h-6 w-6 text-green-600" />
        </div>
        <div>
          <h4 className="font-semibold mb-1">Alamat Kantor Desa</h4>
          <p>Jl. Pramuka No. 67, Desa Sukamaju, Kec. Sukamaju, Kab. Luwu Utara, Sulawesi Selatan 92963</p>
        </div>
      </div>
      {/* Alamat */}
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
          <Earth className="h-6 w-6 text-green-600" />
        </div>
        <div>
          <h4 className="font-semibold mb-1">Website</h4>
          <Link href="https://spk-pupuk.site/" target="_blank" rel="noopener noreferrer" className='underline'>EcoDesa Makmur Jaya</Link>
        </div>
      </div>
      {/* Sosial Media */}
      <div className="flex items-start space-x-4">
        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
          <Earth className="h-6 w-6 text-green-600" />
        </div>
        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
          <FaFacebook className="h-6 w-6 text-green-600" />
        </div>
        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
          <FaInstagram className="h-6 w-6 text-green-600" />
        </div>
        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
          <FaYoutube className="h-6 w-6 text-green-600" />
        </div>

       
      </div>

   
    </div>
  </div>

  {/* Kontak Tambahan / Info Lain */}
  <div className="col-span-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-8 text-white">
    <h3 className="text-2xl font-bold mb-6">Informasi Lainnya</h3>
    <div className="space-y-6">
      {/* Bisa diisi konten tambahan */}
      {/* <p>Kontak tambahan atau info layanan bisa ditempatkan di sini.</p> */}
         {/* Telepon */}
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
          <Phone className="h-6 w-6 text-green-600" />
        </div>
        <div>
          <h4 className="font-semibold mb-1">Nomor Telepon</h4>
          {/* <p>+62 21 1234 5678</p> */}
          <p>+62 XXX XXXX XXXX(WhatsApp)</p>
        </div>
      </div>

      {/* Email */}
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
          <Mail className="h-6 w-6 text-green-600" />
        </div>
        <div>
          <h4 className="font-semibold mb-1">Email</h4>
          {/* <p>info@ecodesa-makmurjaya.id</p> */}
          <p>sukamaju-lutra@yahoo.co.id</p>
        </div>
      </div>

      {/* Jam Operasinal */}
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
          <Calendar className="h-6 w-6 text-green-600" />
        </div>
        <div>
          <h4 className="font-semibold mb-1">Jam Operasional</h4>
          <p>Senin - Jumat: 08:00 - 16:00 WIB</p>
          {/* <p>Sabtu: 08:00 - 12:00 WIB</p> */}
        </div>
      </div>
    </div>
  </div>
</div>


            {/* Quick Links */}
            {/* <div>
              <h4 className="text-lg font-semibold mb-6">Tautan Cepat</h4>
              <ul className="space-y-3">
                <li><a href="#home" className="text-gray-300 hover:text-green-400 transition-colors">Beranda</a></li>
                <li><a href="#desa" className="text-gray-300 hover:text-green-400 transition-colors">Info Desa</a></li>
                <li><a href="#petani" className="text-gray-300 hover:text-green-400 transition-colors">Data Petani</a></li>
                <li><a href="#pupuk" className="text-gray-300 hover:text-green-400 transition-colors">Katalog Pupuk</a></li>
                <li><a href="#galeri" className="text-gray-300 hover:text-green-400 transition-colors">Galeri</a></li>
                <li><a href="#kontak" className="text-gray-300 hover:text-green-400 transition-colors">Kontak</a></li>
              </ul>
            </div> */}

            {/* Services */}
            {/* <div>
              <h4 className="text-lg font-semibold mb-6">Layanan</h4>
              <ul className="space-y-3">
                <li><span className="text-gray-300">Konsultasi Pertanian</span></li>
                <li><span className="text-gray-300">Distribusi Pupuk</span></li>
                <li><span className="text-gray-300">Pelatihan Digital</span></li>
                <li><span className="text-gray-300">Monitoring Kualitas</span></li>
                <li><span className="text-gray-300">Sertifikasi Organik</span></li>
                <li><span className="text-gray-300">Dukungan Teknis</span></li>
              </ul>
            </div> */}
          </div>

          {/* Newsletter */}
          {/* <div className="border-t border-gray-700 pt-12 mb-8">
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
          </div> */}

          {/* Copyright */}
          {/* <div className="border-t border-gray-700 pt-8">
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
          </div> */}
        </div>
      </footer>

      {/* Login Modal - Pindah ke sini agar benar-benar fixed */}
      <LoginButton   
        isLoginOpen={isLoginOpen}
        setIsLoginOpen={setIsLoginOpen}
        isRegisterOpen={isRegisterOpen}
        setIsRegisterOpen={setIsRegisterOpen}
      />
    </div>
  );
};

export default LandingPage;