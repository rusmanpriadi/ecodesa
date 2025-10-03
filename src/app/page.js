import React from 'react'
import LandingPage from '../components/banner/index'
import { generatePageMetadata } from '@/lib/metaData'
import Favicon from './favicon.ico'


export const metadata = generatePageMetadata({
  title: 'EcoDesa',
  description: 'Welcome to EcoDesa',
  keywords: ['Halaman Utama'],
  url: '/',
  image: {Favicon},
})

 const HalamanUtama = () => {
  return (
    <LandingPage />
  )
}

export default HalamanUtama