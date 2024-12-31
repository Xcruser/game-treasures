import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type RouteContext = {
  params: { id: string }
};

interface UpdateItemData {
  name?: string;
  description?: string | null;
  price?: number;
  game?: string;
  category?: string;
  inStock?: number;
  imageUrl?: string | null;
}

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  const { id } = context.params;
  console.log('GET Request received for item:', { id });

  try {
    const item = await prisma.item.findUnique({
      where: { id }
    });

    console.log('Item found:', item);

    if (!item) {
      console.log('Item not found:', id);
      return NextResponse.json(
        { message: 'Item nicht gefunden' },
        { status: 404 }
      );
    }

    return NextResponse.json(item);
  } catch (err) {
    console.error('Detailed error in GET /api/products/[id]:', {
      error: err,
      id,
      stack: err instanceof Error ? err.stack : undefined
    });
    return NextResponse.json(
      { message: 'Fehler beim Laden des Items' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  const { id } = context.params;
  console.log('PATCH Request received for item:', { id });
  
  try {
    const data: UpdateItemData = await request.json();
    console.log('Processing update request:', { id, originalData: data });

    // Validiere die eingehenden Daten
    if (data.price !== undefined && (typeof data.price !== 'number' || data.price < 0)) {
      console.log('Validation failed: Invalid price:', data.price);
      return NextResponse.json(
        { message: 'Ungültiger Preis' },
        { status: 400 }
      );
    }

    if (data.inStock !== undefined && (typeof data.inStock !== 'number' || data.inStock < -1)) {
      console.log('Validation failed: Invalid stock value:', data.inStock);
      return NextResponse.json(
        { message: 'Ungültiger Lagerbestand' },
        { status: 400 }
      );
    }

    // Bereite die Update-Daten vor
    const updateData: UpdateItemData = {};
    if (data.name) updateData.name = String(data.name);
    if (data.description !== undefined) updateData.description = data.description ? String(data.description) : null;
    if (data.price !== undefined) updateData.price = Number(data.price);
    if (data.game) updateData.game = String(data.game);
    if (data.category) updateData.category = String(data.category);
    if (data.inStock !== undefined) updateData.inStock = Number(data.inStock);
    if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl ? String(data.imageUrl) : null;

    console.log('Validated and converted data:', updateData);

    const item = await prisma.item.update({
      where: { id },
      data: updateData,
    });

    console.log('Item successfully updated:', item);
    return NextResponse.json(item);
  } catch (err) {
    console.error('Detailed error in PATCH /api/products/[id]:', {
      error: err,
      id,
      stack: err instanceof Error ? err.stack : undefined
    });
    return NextResponse.json(
      { message: 'Fehler beim Aktualisieren des Items' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  const { id } = context.params;
  console.log('DELETE Request received for item:', { id });
  
  try {
    if (!id) {
      console.log('Validation failed: Missing item ID');
      return NextResponse.json(
        { message: 'Item ID wird benötigt' },
        { status: 400 }
      );
    }

    const item = await prisma.item.delete({
      where: { id },
    });

    console.log('Item successfully deleted:', id);
    return NextResponse.json(item);
  } catch (err) {
    console.error('Detailed error in DELETE /api/products/[id]:', {
      error: err,
      id,
      stack: err instanceof Error ? err.stack : undefined
    });
    return NextResponse.json(
      { message: 'Fehler beim Löschen des Items' },
      { status: 500 }
    );
  }
}
