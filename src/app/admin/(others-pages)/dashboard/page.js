import React from 'react'

import AdminDashboard from './dashboardPage'

import { generatePageMetadata } from '@/lib/metaData'


export const metadata = generatePageMetadata({
  title: 'EcoDesa',
  description: 'Welcome to EcoDesa',
  keywords: ['dashboard'],
  url: '/admin/dashboard',
  
  
})

 const Dashboard = () => {
  return (
  <AdminDashboard />
  )
}


export default Dashboard