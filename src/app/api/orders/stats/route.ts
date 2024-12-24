import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Hole alle Bestellungen der letzten 12 Monate
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 11);
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);

    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: startDate
        }
      }
    });

    // Gruppiere Bestellungen nach Monat
    const monthlyStats = new Map();

    orders.forEach(order => {
      const monthKey = order.createdAt.toLocaleString('de-DE', { month: 'long', year: 'numeric' });
      
      if (!monthlyStats.has(monthKey)) {
        monthlyStats.set(monthKey, {
          month: monthKey,
          totalOrders: 0,
          totalRevenue: 0,
          confirmedOrders: 0
        });
      }

      const stats = monthlyStats.get(monthKey);
      stats.totalOrders++;
      stats.totalRevenue += order.totalAmount;
      
      if (order.paymentStatus === 'CONFIRMED') {
        stats.confirmedOrders++;
      }
    });

    // Konvertiere Map in Array und sortiere nach Datum
    const sortedStats = Array.from(monthlyStats.values())
      .sort((a, b) => {
        const [aMonth, aYear] = a.month.split(' ');
        const [bMonth, bYear] = b.month.split(' ');
        return new Date(aYear, getMonthNumber(aMonth)).getTime() -
               new Date(bYear, getMonthNumber(bMonth)).getTime();
      });

    return NextResponse.json(sortedStats);
  } catch (error) {
    console.error('Error fetching order stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function getMonthNumber(monthName: string): number {
  const months = [
    'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
  ];
  return months.indexOf(monthName);
}
