import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const { id, inStock } = data;

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: { inStock }
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Error updating stock:', error);
    return NextResponse.json(
      { error: 'Failed to update stock' },
      { status: 500 }
    );
  }
}
