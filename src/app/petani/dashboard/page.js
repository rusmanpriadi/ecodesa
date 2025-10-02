import React from 'react'
import FarmerSPKDashboard from './dashboardPage'
import Head from 'next/head'
import { generatePageMetadata } from '@/lib/metaData'


export const metadata = generatePageMetadata({
  title: 'EcoDesa',
  description: 'Welcome to EcoDesa',
  keywords: ['dashboard'],
  url: '/petani/dashboard',
  
  
})

 const Dashboard = () => {
  return (
    <FarmerSPKDashboard />
  )
}

export default Dashboard