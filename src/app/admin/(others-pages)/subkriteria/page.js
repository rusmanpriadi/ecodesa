import React from 'react'
import SubKriteriaPage from './SubKriteriaPage'
import { generatePageMetadata } from "@/lib/metaData";

export const metadata = generatePageMetadata({
  title: "Criteria Page",
  description: "Welcome to our amazing website",
  keywords: ["criteria"],
  url: "/criteria",
});
 const Blok = () => {
  return (
    <SubKriteriaPage />
  )
}
export default Blok