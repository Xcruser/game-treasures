'use client';

import { HiOutlineMail } from 'react-icons/hi';
import { BsMessenger, BsClock } from 'react-icons/bs';
import { BiSupport } from 'react-icons/bi';

export default function ContactInfo() {
  const handleEmailClick = () => {
    window.location.href = 'mailto:support@game-treasures.com';
  };

  const handleMessengerClick = () => {
    window.open('https://m.me/gametreasures', '_blank');
  };

  return (
    <div className="space-y-6">
      {/* E-Mail */}
      <div className="glass-effect p-6 rounded-xl">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-[#0095FF]/10 rounded-lg">
            <HiOutlineMail className="w-6 h-6 text-[#0095FF]" />
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">E-Mail</h3>
            <button
              onClick={handleEmailClick}
              className="text-[#0095FF] hover:text-[#0095FF]/80 transition-colors bg-[#0095FF]/10 px-4 py-2 rounded-lg"
            >
              Per E-Mail kontaktieren
            </button>
          </div>
        </div>
      </div>

      {/* Facebook Messenger */}
      <div className="glass-effect p-6 rounded-xl">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-[#0095FF]/10 rounded-lg">
            <BsMessenger className="w-6 h-6 text-[#0095FF]" />
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Facebook Messenger</h3>
            <button
              onClick={handleMessengerClick}
              className="text-[#0095FF] hover:text-[#0095FF]/80 transition-colors bg-[#0095FF]/10 px-4 py-2 rounded-lg"
            >
              Per Messenger kontaktieren
            </button>
          </div>
        </div>
      </div>

      {/* Support */}
      <div className="glass-effect p-6 rounded-xl">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-[#0095FF]/10 rounded-lg">
            <BiSupport className="w-6 h-6 text-[#0095FF]" />
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Support</h3>
            <p className="text-gray-300">
              Wir antworten in der Regel innerhalb von 24 Stunden
            </p>
          </div>
        </div>
      </div>

      {/* Geschäftszeiten */}
      <div className="glass-effect p-6 rounded-xl">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-[#0095FF]/10 rounded-lg">
            <BsClock className="w-6 h-6 text-[#0095FF]" />
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Geschäftszeiten</h3>
            <p className="text-gray-300">
              Montag - Freitag
              <br />
              9:00 - 17:00 Uhr
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
