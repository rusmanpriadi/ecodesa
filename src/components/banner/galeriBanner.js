"use client"

import React, { useState, useEffect } from 'react'
import  Autoplay  from 'embla-carousel-autoplay'
import { 
 
  Image as ImageIcon, 

  Calendar,

} from 'lucide-react';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const GaleriBanner = () => {
  const [galeriItems, setGaleriItems] = useState([]);

    const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  )


  function formatTanggal(tanggal) {
    return new Date(tanggal).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  useEffect(() => {
    // Simulasi pengambilan data galeri dari API atau sumber data lainnya
    const fetchGaleriItems = async () => {
      try {
        // Ganti URL di bawah dengan endpoint API Anda jika ada
        const response = await fetch('/api/galeri');
        const data = await response.json();
        setGaleriItems(data.data || []); // Pastikan data sesuai dengan struktur respons API Anda
      } catch (error) {
        console.error('Error fetching galeri items:', error);
      }
    };

    fetchGaleriItems();
  }, []);
  
  console.log(galeriItems);

  return (
    <section id="galeri" className="py-20 bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Galeri Kegiatan</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Dokumentasi kegiatan pertanian organik dan distribusi pupuk kompos di desa
          </p>
        </div>

        {galeriItems.length > 0 ? (
          <Carousel
          plugins={[plugin.current]}
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {galeriItems.map((item, index) => (
                <CarouselItem key={item.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                  <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group h-full">
                    <div className="relative bg-gradient-to-br from-green-400 to-emerald-500 h-48 overflow-hidden">
                      <Image
                        src={item.images}
                        alt={item.judul}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = `
                            <div class="flex items-center justify-center h-full bg-gradient-to-br from-green-400 to-emerald-500">
                              <div class="text-white text-center">
                                <svg class="h-12 w-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                                </svg>
                                <p class="text-sm">No Image</p>
                              </div>
                            </div>
                          `;
                        }}
                      />
                      {/* Overlay gradient untuk efek hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{item.judul}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">{item.deskripsi}</p>
                      <div className="flex items-center text-green-600 text-sm font-medium">
                        <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                        {formatTanggal(item.tanggal)}
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            {/* Navigation Buttons */}
            <CarouselPrevious className="left-0 -translate-x-12 bg-white/90 hover:bg-white shadow-lg border-green-200 text-green-600 hover:text-green-700" />
            <CarouselNext className="right-0 translate-x-12 bg-white/90 hover:bg-white shadow-lg border-green-200 text-green-600 hover:text-green-700" />
          </Carousel>
        ) : (
          // Loading atau empty state
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((index) => (
              <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-lg animate-pulse">
                <div className="bg-gray-300 h-48"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
                  <div className="flex items-center">
                    <div className="h-4 w-4 bg-gray-300 rounded mr-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-24"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Indicators/Dots */}
        {galeriItems.length > 0 && (
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: Math.ceil(galeriItems.length / 3) }).map((_, index) => (
              <div
                key={index}
                className="w-2 h-2 rounded-full bg-green-300 hover:bg-green-500 cursor-pointer transition-colors duration-200"
              />
            ))}
          </div>
        )}

     
      </div>
    </section>
  )
}

export default GaleriBanner