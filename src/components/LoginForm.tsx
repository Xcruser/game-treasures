'use client';

import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implementiere hier die Admin-Login-Logik
    console.log('Admin Login Versuch:', formData);
  };

  return (
    <div className="bg-[#1A2642]/40 backdrop-blur-md rounded-xl p-8 shadow-2xl w-full">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
            Admin E-Mail
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full bg-[#1A2642]/30 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#0095FF] focus:ring-1 focus:ring-[#0095FF] transition-colors"
            placeholder="admin@gametreasures.de"
            required
            autoComplete="email"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
            Passwort
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-[#1A2642]/30 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#0095FF] focus:ring-1 focus:ring-[#0095FF] transition-colors"
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 focus:outline-none"
            >
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center text-gray-300">
            <input
              type="checkbox"
              id="remember"
              name="remember"
              className="form-checkbox h-4 w-4 text-[#0095FF] rounded border-gray-600 bg-[#1A2642]/30 focus:ring-[#0095FF]"
              autoComplete="off"
            />
            <span className="ml-2">Angemeldet bleiben</span>
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-[#0095FF] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#0077CC] focus:outline-none focus:ring-2 focus:ring-[#0095FF] focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors"
        >
          Admin Login
        </button>

        <div className="text-center text-sm text-gray-500">
          <a href="#" className="text-[#0095FF] hover:text-[#0077CC]">
            Passwort vergessen?
          </a>
        </div>
      </form>
    </div>
  );
}
