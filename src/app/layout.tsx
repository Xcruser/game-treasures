import { Inter } from 'next/font/google';
import "./globals.css";
import Navbar from '@/components/Navbar';
import { metadata } from './metadata';

const inter = Inter({ subsets: ['latin'] });

export { metadata };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body className={`${inter.className} min-h-screen bg-[#0B1120]`}>
        {/* Navigation */}
        <Navbar />
        
        {/* Basis-Hintergrund */}
        <div className="fixed inset-0 z-0 bg-gradient-to-b from-[#0B1120] via-[#131B2E] to-[#0B1120] opacity-60" />
        
        {/* Haupt-Content */}
        {children}
      </body>
    </html>
  );
}
