import { NextResponse } from 'next/server';
import prisma from '../../../../prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Gesamtumsatz
    const orders = await prisma.order.findMany();
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

    // Anzahl der Bestellungen
    const totalOrders = orders.length;

    // Anzahl der Items (Produkte)
    const totalProducts = await prisma.item.count();

    // Anzahl der Benutzer (ohne Admins)
    const totalCustomers = await prisma.user.count({
      where: {
        role: 'USER'
      }
    });

    // Anzahl der verschiedenen Spiele (basierend auf den einzigartigen Spielen in Items)
    const games = await prisma.item.findMany({
      select: {
        game: true
      },
      distinct: ['game']
    });
    const totalGames = games.length;

    // Anzahl der Newsletter-Abonnenten
    const newsletterSubscribers = await prisma.newsletterSubscriber.count({
      where: {
        isActive: true
      }
    });

    // Die letzten 5 Bestellungen
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Verkaufsdaten der letzten 30 Tage
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const salesData = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: thirtyDaysAgo
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    // Gruppiere Verkaufsdaten nach Datum
    const salesByDate = salesData.reduce((acc, order) => {
      const date = order.createdAt.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = {
          revenue: 0,
          orders: 0
        };
      }
      acc[date].revenue += order.totalAmount;
      acc[date].orders += 1;
      return acc;
    }, {});

    // Konvertiere in Array-Format für das Chart
    const chartData = Object.entries(salesByDate).map(([date, data]) => ({
      date,
      revenue: data.revenue,
      orders: data.orders
    }));

    return NextResponse.json({
      totalRevenue,
      totalOrders,
      totalProducts,
      totalCustomers,
      totalGames,
      newsletterSubscribers,
      recentOrders: recentOrders.map(order => ({
        id: order.id,
        customerName: order.customerName,
        total: order.totalAmount,
        status: order.status,
        createdAt: order.createdAt
      })),
      salesData: chartData
    });

  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
