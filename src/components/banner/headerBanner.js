"use client"

import React from 'react';
import { 
  Leaf, 
  Menu,
  X
} from 'lucide-react';
import { Button } from '../ui/button';

const HeaderBanner = ({ toggleMenu, isMenuOpen, setIsLoginOpen }) => {
  
  return (
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
          <nav className="hidden md:flex space-x-8 flex-row items-center">
            <a href="#home" className="text-gray-700 hover:text-green-600 transition-colors font-medium">Beranda</a>
            <a href="#desa" className="text-gray-700 hover:text-green-600 transition-colors font-medium">Info Desa</a>
            {/* <a href="#petani" className="text-gray-700 hover:text-green-600 transition-colors font-medium">Petani</a> */}
            <a href="#pupuk" className="text-gray-700 hover:text-green-600 transition-colors font-medium">Pupuk</a>
            <a href="#galeri" className="text-gray-700 hover:text-green-600 transition-colors font-medium">Galeri</a>
            {/* <a href="#kontak" className="text-gray-700 hover:text-green-600 transition-colors font-medium">Kontak</a> */}
            <Button
              onClick={() => setIsLoginOpen(true)}
              variant={"green"}
            >
              Login
            </Button>
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
          <div className="md:hidden py-4 border-t border-gray-200 flex-row items-center">
            <nav className="flex flex-col space-y-3">
              <a href="#home" className="text-gray-700 hover:text-green-600 transition-colors font-medium py-2">Beranda</a>
              <a href="#desa" className="text-gray-700 hover:text-green-600 transition-colors font-medium py-2">Info Desa</a>
              <a href="#petani" className="text-gray-700 hover:text-green-600 transition-colors font-medium py-2">Petani</a>
              <a href="#pupuk" className="text-gray-700 hover:text-green-600 transition-colors font-medium py-2">Pupuk</a>
              <a href="#galeri" className="text-gray-700 hover:text-green-600 transition-colors font-medium py-2">Galeri</a>
              <a href="#kontak" className="text-gray-700 hover:text-green-600 transition-colors font-medium py-2">Kontak</a>
              <Button
                onClick={() => setIsLoginOpen(true)}
                variant={"green"}
                className="mt-2 w-fit"
              >
                Login
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default HeaderBanner