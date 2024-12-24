'use client';

import { Toaster } from 'react-hot-toast';
import { SessionProvider } from 'next-auth/react';
import AdminSidebar from '@/components/AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 lg:pl-64">
          <Toaster position="top-right" />
          {children}
        </div>
      </div>
    </SessionProvider>
  );
}
