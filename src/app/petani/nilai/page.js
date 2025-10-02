import React from 'react'
import RenderInputForm from './nilaiPage'
import Head from 'next/head'
import { generatePageMetadata } from '@/lib/metaData'


export const metadata = generatePageMetadata({
  title: 'EcoDesa',
  description: 'Welcome to EcoDesa',
  keywords: ['nilai'],
  url: '/petani/nilai',
  
  
})

 const Nilai = () => {
  return (
    <RenderInputForm />
  )
}


export default Nilai