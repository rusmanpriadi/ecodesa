import React from 'react'
import CriteriaPage from './CriteriaPage'
import { generatePageMetadata } from "@/lib/metaData";

export const metadata = generatePageMetadata({
  title: "Criteria Page",
  description: "Welcome to our amazing website",
  keywords: ["criteria"],
  url: "/criteria",
});
 const Blok = () => {
  return (
    <CriteriaPage />
  )
}
export default Blok