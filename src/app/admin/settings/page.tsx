'use client';

import { useState } from 'react';
import { FaUser, FaLock, FaStore, FaBell, FaPalette } from 'react-icons/fa';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Einstellungen</h1>
      </div>

      {/* Settings Navigation */}
      <div className="flex space-x-1 mb-8 bg-[#1A2642]/40 backdrop-blur-md rounded-xl p-2">
        <TabButton
          active={activeTab === 'profile'}
          onClick={() => setActiveTab('profile')}
          icon={<FaUser />}
          label="Profil"
        />
        <TabButton
          active={activeTab === 'security'}
          onClick={() => setActiveTab('security')}
          icon={<FaLock />}
          label="Sicherheit"
        />
        <TabButton
          active={activeTab === 'store'}
          onClick={() => setActiveTab('store')}
          icon={<FaStore />}
          label="Shop"
        />
        <TabButton
          active={activeTab === 'notifications'}
          onClick={() => setActiveTab('notifications')}
          icon={<FaBell />}
          label="Benachrichtigungen"
        />
        <TabButton
          active={activeTab === 'appearance'}
          onClick={() => setActiveTab('appearance')}
          icon={<FaPalette />}
          label="Erscheinungsbild"
        />
      </div>

      {/* Settings Content */}
      <div className="bg-[#1A2642]/40 backdrop-blur-md rounded-xl p-6">
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <h2 className="text-lg font-medium text-white mb-4">Profil Einstellungen</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  defaultValue="System Admin"
                  className="w-full bg-[#0B1120] text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-[#0095FF]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  E-Mail
                </label>
                <input
                  type="email"
                  defaultValue="admin@gametreasures.de"
                  className="w-full bg-[#0B1120] text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-[#0095FF]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Telefon
                </label>
                <input
                  type="tel"
                  placeholder="+49 123 456789"
                  className="w-full bg-[#0B1120] text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-[#0095FF]"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-700">
              <button className="bg-[#0095FF] hover:bg-[#0077CC] text-white px-4 py-2 rounded-lg transition-colors">
                Änderungen speichern
              </button>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6">
            <h2 className="text-lg font-medium text-white mb-4">Sicherheit</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Aktuelles Passwort
                </label>
                <input
                  type="password"
                  className="w-full bg-[#0B1120] text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-[#0095FF]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Neues Passwort
                </label>
                <input
                  type="password"
                  className="w-full bg-[#0B1120] text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-[#0095FF]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Passwort bestätigen
                </label>
                <input
                  type="password"
                  className="w-full bg-[#0B1120] text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-[#0095FF]"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-700">
              <button className="bg-[#0095FF] hover:bg-[#0077CC] text-white px-4 py-2 rounded-lg transition-colors">
                Passwort ändern
              </button>
            </div>
          </div>
        )}

        {/* Weitere Tab-Inhalte hier... */}
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
        active
          ? 'bg-[#0095FF] text-white'
          : 'text-gray-400 hover:bg-[#0095FF]/10 hover:text-white'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
