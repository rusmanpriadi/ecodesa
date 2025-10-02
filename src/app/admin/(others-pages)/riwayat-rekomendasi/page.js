import React from 'react'
import HasilPage from './hasilPage'
import Head from 'next/head'
import { generatePageMetadata } from '@/lib/metaData'


export const metadata = generatePageMetadata({
  title: 'EcoDesa',
  description: 'Welcome to EcoDesa',
  keywords: ['hasil'],
  url: '/petani/hasil',
  
  
})


 const Hasil = () => {
  return (
    <HasilPage />
  )
}

export default Hasil