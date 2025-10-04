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
     {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-12 lg:py-16 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-64 h-64 bg-green-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 mb-8">
            {/* Contact Info Card - Spans 3 columns on large screens */}
            <div className="lg:col-span-3 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl lg:rounded-3xl p-6 sm:p-8 text-white shadow-2xl transform hover:scale-[1.02] transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold">Informasi Kontak</h3>
              </div>
              
              <div className="space-y-5">
                {/* Address */}
                <div className="flex items-start space-x-4 group">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-white/30 transition-all">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1 text-sm sm:text-base">Alamat Kantor Desa</h4>
                    <p className="text-white/90 text-sm leading-relaxed">Jl. Pramuka No. 67, Desa Sukamaju, Kec. Sukamaju, Kab. Luwu Utara, Sulawesi Selatan 92963</p>
                  </div>
                </div>

                {/* Website */}
                <div className="flex items-start space-x-4 group">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-white/30 transition-all">
                    <Earth className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1 text-sm sm:text-base">Website</h4>
                    <Link href="https://spk-pupuk.site/" target="_blank" rel="noopener noreferrer" 
                      className='text-white/90 hover:text-white underline underline-offset-4 text-sm transition-colors'>
                      EcoDesa Makmur Jaya
                    </Link>
                  </div>
                </div>

                {/* Social Media */}
                <div className="pt-2">
                  <h4 className="font-semibold mb-4 text-sm sm:text-base flex items-center gap-2">
                    <span>Ikuti Kami</span>
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    <a href="#" className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/30 hover:scale-110 transition-all duration-300 group">
                      <Earth className="h-6 w-6 text-white group-hover:rotate-12 transition-transform" />
                    </a>
                    <a href="#" className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/30 hover:scale-110 transition-all duration-300 group">
                      <FaFacebook className="h-6 w-6 text-white group-hover:rotate-12 transition-transform" />
                    </a>
                    <a href="#" className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/30 hover:scale-110 transition-all duration-300 group">
                      <FaInstagram className="h-6 w-6 text-white group-hover:rotate-12 transition-transform" />
                    </a>
                    <a href="#" className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/30 hover:scale-110 transition-all duration-300 group">
                      <FaYoutube className="h-6 w-6 text-white group-hover:rotate-12 transition-transform" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Info Card - Spans 2 columns on large screens */}
            <div className="lg:col-span-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl lg:rounded-3xl p-6 sm:p-8 text-white shadow-2xl transform hover:scale-[1.02] transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Phone className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold">Hubungi Kami</h3>
              </div>
              
              <div className="space-y-5">
                {/* Phone */}
                <div className="flex items-start space-x-4 group">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-white/30 transition-all">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1 text-sm sm:text-base">Nomor Telepon</h4>
                    <p className="text-white/90 text-sm">+62 XXX XXXX XXXX</p>
                    <p className="text-white/75 text-xs mt-1">(WhatsApp)</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start space-x-4 group">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-white/30 transition-all">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1 text-sm sm:text-base">Email</h4>
                    <p className="text-white/90 text-sm break-all">sukamaju-lutra@yahoo.co.id</p>
                  </div>
                </div>

                {/* Operating Hours */}
                <div className="flex items-start space-x-4 group">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-white/30 transition-all">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1 text-sm sm:text-base">Jam Operasional</h4>
                    <p className="text-white/90 text-sm">Senin - Jumat</p>
                    <p className="text-white/75 text-xs mt-1">08:00 - 16:00 WIB</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/10 pt-6 mt-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Leaf className="h-4 w-4 text-green-400" />
                <span>© 2025 EcoDesa Makmur Jaya</span>
              </div>
              <div className="text-center sm:text-right">
                <span>Desa Sukamaju, Luwu Utara</span>
              </div>
            </div>
          </div>
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