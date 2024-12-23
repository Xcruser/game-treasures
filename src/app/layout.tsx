import { Inter } from 'next/font/google';
import "./globals.css";
import ClientLayout from '@/components/ClientLayout';
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
      <body className={`${inter.className} bg-[#0B1120]`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
