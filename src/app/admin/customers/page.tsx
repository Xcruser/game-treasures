'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { FaUser, FaEnvelope, FaCalendar, FaShoppingCart } from 'react-icons/fa';
import { User } from '@prisma/client';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      setCustomers(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching customers:', error);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#111827]">
        <AdminSidebar />
        <main className="lg:ml-64">
          <div className="flex justify-between items-center bg-[#1A2642] border-b border-gray-700 p-4">
            <h1 className="text-2xl font-bold text-white">Kunden</h1>
          </div>

          <div className="p-6">
            <div className="grid gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-[#1A2642] rounded-lg p-6 animate-pulse">
                  <div className="flex items-center space-x-4">
                    <div className="bg-[#243154] p-3 rounded-full">
                      <FaUser className="w-6 h-6 text-[#0095FF]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white bg-gray-700 rounded w-1/2 h-6 mb-2"></h3>
                      <div className="flex items-center space-x-4 text-gray-400 mt-2">
                        <div className="flex items-center">
                          <FaEnvelope className="w-4 h-4 mr-2" />
                          <span className="bg-gray-700 rounded w-1/2 h-6"></span>
                        </div>
                        <div className="flex items-center">
                          <FaCalendar className="w-4 h-4 mr-2" />
                          <span className="bg-gray-700 rounded w-1/2 h-6"></span>
                        </div>
                        <div className="flex items-center">
                          <FaShoppingCart className="w-4 h-4 mr-2" />
                          <span className="bg-gray-700 rounded w-1/2 h-6"></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111827]">
      <AdminSidebar />
      <main className="lg:ml-64">
        <div className="flex justify-between items-center bg-[#1A2642] border-b border-gray-700 p-4">
          <h1 className="text-2xl font-bold text-white">Kunden</h1>
        </div>

        <div className="p-6">
          <div className="grid gap-6">
            {customers.map((customer) => (
              <div key={customer.id} className="bg-[#1A2642] rounded-lg p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-[#243154] p-3 rounded-full">
                    <FaUser className="w-6 h-6 text-[#0095FF]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{customer.name}</h3>
                    <div className="flex items-center space-x-4 text-gray-400 mt-2">
                      <div className="flex items-center">
                        <FaEnvelope className="w-4 h-4 mr-2" />
                        <span>{customer.email}</span>
                      </div>
                      <div className="flex items-center">
                        <FaCalendar className="w-4 h-4 mr-2" />
                        <span>Seit {new Date(customer.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center">
                        <FaShoppingCart className="w-4 h-4 mr-2" />
                        <span>5 Bestellungen</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
