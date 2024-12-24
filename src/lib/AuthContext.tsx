'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { verifyToken, TokenPayload } from './jwt';

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isAdmin: false,
  login: async () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const processToken = (token: string): TokenPayload | null => {
    try {
      const payload = verifyToken(token);
      if (payload) {
        setIsAuthenticated(true);
        setIsAdmin(payload.role === 'ADMIN');
        return payload;
      }
      return null;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('auth_token='))
      ?.split('=')[1];

    if (token) {
      processToken(token);
    }
  }, []);

  const login = async (token: string): Promise<void> => {
    if (!token) {
      throw new Error('Token ist erforderlich');
    }

    const payload = processToken(token);
    if (!payload) {
      throw new Error('Ungültiger Token');
    }

    // Setze das Cookie
    document.cookie = `auth_token=${token}; path=/; max-age=${60 * 60 * 24}; SameSite=Strict${
      process.env.NODE_ENV === 'production' ? '; Secure' : ''
    }`;
  };

  const logout = () => {
    document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    setIsAuthenticated(false);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
