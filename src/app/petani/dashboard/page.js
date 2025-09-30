import React from 'react'
import FarmerSPKDashboard from './dashboardPage'
import Head from 'next/head'
import { generatePageMetadata } from '@/lib/metaData'


export const metadata = generatePageMetadata({
  title: 'Dashboard',
  description: 'Welcome to EcoDesa',
  keywords: ['dashboard'],
  url: '/petani/dashboard',
   icons: {
    icon: '/images/icons/eco.ico', // path dari public
    shortcut: '/images/icons/eco.ico',
    apple: '/images/icons/eco.ico',
  },
  
})

 const Dashboard = () => {
  return (
    <FarmerSPKDashboard />
  )
}

export default Dashboard