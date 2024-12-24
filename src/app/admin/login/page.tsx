'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams?.get('from') || '/admin/dashboard';
  const { login, isLoading, error, user } = useAuth();

  useEffect(() => {
    // Wenn der Benutzer bereits eingeloggt ist, leite ihn weiter
    if (user) {
      router.push(from);
    }
  }, [user, router, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const success = await login(email, password);
      
      if (success) {
        toast.success('Erfolgreich eingeloggt');
        router.push(from);
      } else if (error) {
        toast.error(error);
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Ein Fehler ist aufgetreten');
    }
  };

  // Wenn noch geprüft wird, ob der Benutzer eingeloggt ist
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F172A]">
        <div className="text-white">Laden...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F172A]">
      <div className="bg-[#1E293B] p-8 rounded-lg shadow-xl w-full max-w-md">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">Admin Login</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Passwort
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Anmeldung...' : 'Anmelden'}
          </button>
        </form>
      </div>
    </div>
  );
}
