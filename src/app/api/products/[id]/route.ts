import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const { id } = params;

    console.log('Received update request for product:', { id, data });

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Konvertiere Werte in die richtigen Typen
    const updatedData = {
      name: String(data.name),
      description: data.description ? String(data.description) : null,
      price: Number(data.price),
      category: String(data.category),
      inStock: Number(data.inStock),
      imageUrl: data.imageUrl ? String(data.imageUrl) : null,
    };

    console.log('Converted data:', updatedData);

    // Validiere die eingehenden Daten
    if (isNaN(updatedData.price) || updatedData.price < 0) {
      console.log('Invalid price:', data.price);
      return NextResponse.json(
        { error: 'Invalid price' },
        { status: 400 }
      );
    }

    if (isNaN(updatedData.inStock) || updatedData.inStock < -1) {
      console.log('Invalid stock value:', data.inStock);
      return NextResponse.json(
        { error: 'Invalid stock value' },
        { status: 400 }
      );
    }

    const product = await prisma.item.update({
      where: { id },
      data: {
        ...updatedData,
        updatedAt: new Date(),
      },
    });

    console.log('Successfully updated product:', product);
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product', details: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    await prisma.item.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
