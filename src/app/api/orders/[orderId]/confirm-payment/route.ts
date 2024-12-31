import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function POST(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    // Prüfe ob der Benutzer ein Admin ist
    if (!session?.user?.isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { orderId } = params;

    // Aktualisiere den Zahlungsstatus und setze das Zahlungsdatum
    const updatedOrder = await prisma.order.update({
      where: {
        id: orderId
      },
      data: {
        paymentStatus: 'CONFIRMED',
        paymentDate: new Date(),
        status: 'PAID'
      }
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Error confirming payment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
