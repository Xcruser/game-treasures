'use client';

import { useState } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    betreff: '',
    bestellnummer: '',
    nachricht: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Hier kommt später die Logik für das Senden des Formulars
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="glass-effect p-6 rounded-xl space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
            Name <span className="text-[#0095FF]">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full bg-[#1A2642]/30 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0095FF]/50"
            placeholder="Ihr Name"
          />
        </div>

        {/* E-Mail */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
            E-Mail <span className="text-[#0095FF]">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full bg-[#1A2642]/30 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0095FF]/50"
            placeholder="ihre@email.de"
          />
        </div>
      </div>

      {/* Betreff */}
      <div>
        <label htmlFor="betreff" className="block text-sm font-medium text-gray-300 mb-2">
          Betreff <span className="text-[#0095FF]">*</span>
        </label>
        <input
          type="text"
          id="betreff"
          name="betreff"
          required
          value={formData.betreff}
          onChange={handleChange}
          className="w-full bg-[#1A2642]/30 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0095FF]/50"
          placeholder="Worum geht es?"
        />
      </div>

      {/* Bestellnummer */}
      <div>
        <label htmlFor="bestellnummer" className="block text-sm font-medium text-gray-300 mb-2">
          Bestellnummer
        </label>
        <input
          type="text"
          id="bestellnummer"
          name="bestellnummer"
          value={formData.bestellnummer}
          onChange={handleChange}
          className="w-full bg-[#1A2642]/30 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0095FF]/50"
          placeholder="Falls vorhanden"
        />
      </div>

      {/* Nachricht */}
      <div>
        <label htmlFor="nachricht" className="block text-sm font-medium text-gray-300 mb-2">
          Nachricht <span className="text-[#0095FF]">*</span>
        </label>
        <textarea
          id="nachricht"
          name="nachricht"
          required
          value={formData.nachricht}
          onChange={handleChange}
          rows={6}
          className="w-full bg-[#1A2642]/30 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0095FF]/50 resize-none"
          placeholder="Ihre Nachricht an uns"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-[#0095FF] to-[#0047AB] text-white font-semibold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[#0095FF]/50"
      >
        Nachricht senden
      </button>
    </form>
  );
}
