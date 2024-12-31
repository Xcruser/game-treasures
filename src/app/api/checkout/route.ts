import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { items, totalAmount, customerName, orderId } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No items in cart' },
        { status: 400 }
      );
    }

    if (!customerName || customerName.trim() === '') {
      return NextResponse.json(
        { error: 'Customer name is required' },
        { status: 400 }
      );
    }

    // Erstelle die Bestellung in der Datenbank mit der generierten ID
    const order = await prisma.order.create({
      data: {
        id: orderId,
        totalAmount,
        customerName,
        items: {
          create: items.map((item: any) => ({
            itemId: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
        },
      },
    });

    return NextResponse.json({ 
      orderId: order.id,
      message: 'Order created successfully' 
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
