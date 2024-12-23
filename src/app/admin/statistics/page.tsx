'use client';

import { useState } from 'react';
import { FaChartLine, FaChartBar, FaChartPie, FaCalendarAlt } from 'react-icons/fa';

export default function StatisticsPage() {
  const [timeframe, setTimeframe] = useState('7d');

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-white">Statistiken</h1>
        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          className="bg-[#0B1120] text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-[#0095FF]"
        >
          <option value="7d">Letzte 7 Tage</option>
          <option value="30d">Letzte 30 Tage</option>
          <option value="90d">Letzte 90 Tage</option>
          <option value="1y">Letztes Jahr</option>
        </select>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<FaChartLine />}
          title="Umsatz"
          value="€4,850.90"
          trend="+12.5%"
          trendUp={true}
        />
        <StatCard
          icon={<FaChartBar />}
          title="Bestellungen"
          value="23"
          trend="+8.1%"
          trendUp={true}
        />
        <StatCard
          icon={<FaChartPie />}
          title="Durchschn. Bestellwert"
          value="€210.91"
          trend="+5.2%"
          trendUp={true}
        />
        <StatCard
          icon={<FaCalendarAlt />}
          title="Conversion Rate"
          value="3.2%"
          trend="-0.8%"
          trendUp={false}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Chart */}
        <div className="bg-[#1A2642]/40 backdrop-blur-md rounded-xl p-6">
          <h2 className="text-lg font-medium text-white mb-4">Umsatzentwicklung</h2>
          <div className="aspect-[16/9] bg-[#0B1120]/50 rounded-lg flex items-center justify-center">
            <span className="text-gray-400">Umsatz-Chart hier einfügen</span>
          </div>
        </div>

        {/* Orders Chart */}
        <div className="bg-[#1A2642]/40 backdrop-blur-md rounded-xl p-6">
          <h2 className="text-lg font-medium text-white mb-4">Bestellungen pro Tag</h2>
          <div className="aspect-[16/9] bg-[#0B1120]/50 rounded-lg flex items-center justify-center">
            <span className="text-gray-400">Bestellungen-Chart hier einfügen</span>
          </div>
        </div>

        {/* Product Categories */}
        <div className="bg-[#1A2642]/40 backdrop-blur-md rounded-xl p-6">
          <h2 className="text-lg font-medium text-white mb-4">Verkäufe nach Kategorie</h2>
          <div className="aspect-[16/9] bg-[#0B1120]/50 rounded-lg flex items-center justify-center">
            <span className="text-gray-400">Kategorien-Chart hier einfügen</span>
          </div>
        </div>

        {/* Customer Acquisition */}
        <div className="bg-[#1A2642]/40 backdrop-blur-md rounded-xl p-6">
          <h2 className="text-lg font-medium text-white mb-4">Kundengewinnung</h2>
          <div className="aspect-[16/9] bg-[#0B1120]/50 rounded-lg flex items-center justify-center">
            <span className="text-gray-400">Kundengewinnung-Chart hier einfügen</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, trend, trendUp }: {
  icon: React.ReactNode;
  title: string;
  value: string;
  trend: string;
  trendUp: boolean;
}) {
  return (
    <div className="bg-[#1A2642]/40 backdrop-blur-md rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="text-[#0095FF] text-2xl">
          {icon}
        </div>
        <span className={`text-sm ${trendUp ? 'text-green-500' : 'text-red-500'}`}>
          {trend}
        </span>
      </div>
      <h3 className="text-gray-400 text-sm mb-1">{title}</h3>
      <p className="text-white text-2xl font-semibold">{value}</p>
    </div>
  );
}
