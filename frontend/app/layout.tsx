import "./globals.css";
import type { Metadata } from "next";
export const metadata:Metadata={title:"Stockwise | Retail Operations",description:"Retail inventory and sales management"};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
