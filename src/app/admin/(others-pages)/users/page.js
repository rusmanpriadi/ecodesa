import React from 'react'
import CriteriaPage from './UsersPage'
import { generatePageMetadata } from "@/lib/metaData";

export const metadata = generatePageMetadata({
  title: "EcoDesa",
  description: "Welcome to our amazing website",
  keywords: ["users"],
  url: "/users",
});
 const Blok = () => {
  return (
    <CriteriaPage />
  )
}
export default Blok