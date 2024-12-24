'use client';

import { useState, useEffect } from 'react';
import { FaUsers, FaEnvelope, FaChartLine, FaTrash } from 'react-icons/fa';
import toast from 'react-hot-toast';
import AdminSidebar from '@/components/AdminSidebar';

interface Subscriber {
  id: string;
  email: string;
  createdAt: string;
  active: boolean;
  lastEmailDate: string;
}

export default function NewsletterManagement() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [showNewsletter, setShowNewsletter] = useState(false);
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');

  const activeSubscribers = subscribers.filter(sub => sub.active).length;
  const inactiveSubscribers = subscribers.filter(sub => !sub.active).length;
  const totalEmails = subscribers.reduce((acc, sub) => acc + (sub.lastEmailDate ? 1 : 0), 0);

  const fetchSubscribers = async () => {
    try {
      const response = await fetch('/api/newsletter/subscribers');
      if (!response.ok) throw new Error('Fehler beim Laden der Abonnenten');
      const data = await response.json();
      setSubscribers(data.subscribers || []);
    } catch (error) {
      console.error('Error fetching subscribers:', error);
      toast.error('Abonnenten konnten nicht geladen werden');
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/newsletter/stats');
      if (!response.ok) throw new Error('Fehler beim Laden der Statistiken');
      const data = await response.json();
      setSubscriberCount(data.stats.subscriberCount);
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Statistiken konnten nicht geladen werden');
    }
  };

  useEffect(() => {
    fetchSubscribers();
    fetchStats();

    const interval = setInterval(() => {
      fetchSubscribers();
      fetchStats();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleUnsubscribe = async (email: string) => {
    if (!confirm('Möchten Sie diesen Abonnenten wirklich entfernen?')) return;

    try {
      const response = await fetch('/api/newsletter/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) throw new Error('Fehler beim Abmelden');
      
      toast.success('Abonnent wurde erfolgreich entfernt');
      fetchSubscribers();
      fetchStats();
    } catch (error) {
      console.error('Error unsubscribing:', error);
      toast.error('Fehler beim Entfernen des Abonnenten');
    }
  };

  const toggleSubscriberStatus = async (id: string) => {
    try {
      const response = await fetch(`/api/newsletter/subscribers/${id}/toggle-status`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Fehler beim Ändern des Status');

      fetchSubscribers();
    } catch (error) {
      console.error('Error toggling subscriber status:', error);
      toast.error('Fehler beim Ändern des Status');
    }
  };

  const handleSendNewsletter = async () => {
    try {
      const response = await fetch('/api/newsletter/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, content }),
      });

      if (!response.ok) throw new Error('Fehler beim Senden des Newsletters');

      toast.success('Newsletter wurde erfolgreich gesendet');
      setShowNewsletter(false);
    } catch (error) {
      console.error('Error sending newsletter:', error);
      toast.error('Fehler beim Senden des Newsletters');
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A]">
      <AdminSidebar />
      <main>
        <div className="flex justify-between items-center border-b border-gray-800 px-6 py-4">
          <h1 className="text-2xl font-bold text-white">Newsletter</h1>
          <button
            onClick={() => setShowNewsletter(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Newsletter erstellen
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
          <div className="bg-[#1E293B] rounded-xl p-6 border border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Aktive Abonnenten</h3>
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <FaUsers className="text-blue-400 w-6 h-6" />
              </div>
            </div>
            <p className="text-3xl font-bold text-white">{activeSubscribers}</p>
            <p className="text-gray-400 mt-2">Aktive Newsletter-Abonnenten</p>
          </div>

          <div className="bg-[#1E293B] rounded-xl p-6 border border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Inaktive Abonnenten</h3>
              <div className="p-3 bg-red-500/10 rounded-lg">
                <FaUsers className="text-red-400 w-6 h-6" />
              </div>
            </div>
            <p className="text-3xl font-bold text-white">{inactiveSubscribers}</p>
            <p className="text-gray-400 mt-2">Inaktive Newsletter-Abonnenten</p>
          </div>

          <div className="bg-[#1E293B] rounded-xl p-6 border border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Gesendete E-Mails</h3>
              <div className="p-3 bg-purple-500/10 rounded-lg">
                <FaEnvelope className="text-purple-400 w-6 h-6" />
              </div>
            </div>
            <p className="text-3xl font-bold text-white">{totalEmails}</p>
            <p className="text-gray-400 mt-2">Insgesamt versendete Newsletter</p>
          </div>
        </div>

        <div className="p-6">
          <div className="bg-[#1E293B] rounded-xl border border-gray-800">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Abonnenten</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">E-Mail</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Angemeldet am</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Letzte E-Mail</th>
                      <th className="text-right py-3 px-4 text-gray-400 font-medium">Aktionen</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscribers.map((subscriber) => (
                      <tr key={subscriber.id} className="border-b border-gray-800 last:border-b-0">
                        <td className="py-4 px-4 text-white">{subscriber.email}</td>
                        <td className="py-4 px-4">
                          <span 
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              subscriber.active 
                                ? 'bg-green-500/10 text-green-400'
                                : 'bg-red-500/10 text-red-400'
                            }`}
                          >
                            {subscriber.active ? 'Aktiv' : 'Inaktiv'}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-white">
                          {new Date(subscriber.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4 text-white">
                          {subscriber.lastEmailDate 
                            ? new Date(subscriber.lastEmailDate).toLocaleDateString()
                            : 'Noch keine'}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-end gap-3">
                            <button
                              onClick={() => toggleSubscriberStatus(subscriber.id)}
                              className={`p-2 rounded-lg transition-colors ${
                                subscriber.active
                                  ? 'hover:bg-red-500/10 text-red-400 hover:text-red-300'
                                  : 'hover:bg-green-500/10 text-green-400 hover:text-green-300'
                              }`}
                            >
                              {subscriber.active ? 'Deaktivieren' : 'Aktivieren'}
                            </button>
                            <button
                              onClick={() => handleUnsubscribe(subscriber.email)}
                              className="text-red-400 hover:text-red-300 transition-colors"
                              title="Abonnent entfernen"
                            >
                              <FaTrash className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {subscribers.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-gray-400">
                          Keine Abonnenten vorhanden
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Modal */}
        {showNewsletter && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-[#1E293B] rounded-xl border border-gray-800 w-full max-w-2xl mx-4">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-white mb-6">Newsletter erstellen</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-400 mb-2">Betreff</label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full bg-[#0F172A] border border-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Newsletter Betreff"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-2">Inhalt</label>
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="w-full h-64 bg-[#0F172A] border border-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Newsletter Inhalt"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-4 mt-6">
                  <button
                    onClick={() => setShowNewsletter(false)}
                    className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                  >
                    Abbrechen
                  </button>
                  <button
                    onClick={handleSendNewsletter}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    Newsletter senden
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
