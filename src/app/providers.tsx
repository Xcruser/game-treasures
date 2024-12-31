'use client';

import { SessionProvider } from 'next-auth/react';
import { CartProvider } from '@/lib/CartContext';
import { AuthProvider } from '@/lib/AuthContext';
import { Toaster } from 'react-hot-toast';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthProvider>
        <CartProvider>
          <Toaster 
            position="top-right"
            toastOptions={{
              style: {
                background: '#1A2642',
                color: '#fff',
                border: '1px solid #2A3B5E',
              },
              success: {
                duration: 4000,
                iconTheme: {
                  primary: '#0095FF',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#ff4b4b',
                  secondary: '#fff',
                },
              },
            }}
          />
          {children}
        </CartProvider>
      </AuthProvider>
    </SessionProvider>
  );
}
