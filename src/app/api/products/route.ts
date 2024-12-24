import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    console.log('GET /api/products: Fetching items...');
    
    const items = await prisma.item.findMany();
    
    console.log(`GET /api/products: Found ${items.length} items`);
    
    // Validiere die Items
    const validItems = items.filter(item => 
      item && 
      typeof item === 'object' && 
      'game' in item && 
      'category' in item &&
      item.game && 
      item.category
    );

    console.log(`GET /api/products: ${validItems.length} valid items after filtering`);
    
    if (validItems.length === 0) {
      console.warn('GET /api/products: No valid items found');
      return NextResponse.json({
        success: true,
        items: [],
        message: 'Keine Produkte gefunden'
      });
    }

    // Logge die Struktur des ersten Items als Beispiel
    if (validItems.length > 0) {
      console.log('GET /api/products: Example item structure:', 
        JSON.stringify(validItems[0], null, 2)
      );
    }

    return NextResponse.json({
      success: true,
      items: validItems
    });
  } catch (err) {
    console.error('GET /api/products Error:', err);
    return NextResponse.json(
      { 
        success: false,
        message: 'Fehler beim Laden der Items',
        error: err instanceof Error ? err.message : 'Unknown error',
        items: [] 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validiere die erforderlichen Felder
    if (!data.name || !data.game || !data.category || data.price === undefined) {
      return NextResponse.json({
        success: false,
        message: 'Fehlende Pflichtfelder'
      }, { status: 400 });
    }

    const item = await prisma.item.create({ 
      data: {
        ...data,
        price: Number(data.price),
        inStock: data.inStock ? Number(data.inStock) : -1
      } 
    });
    
    return NextResponse.json({
      success: true,
      item: item
    });
  } catch (err) {
    console.error('Error creating item:', err);
    return NextResponse.json(
      { 
        success: false,
        message: 'Fehler beim Erstellen des Items',
        error: err instanceof Error ? err.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const { id, ...updateData } = data;

    if (!id) {
      return NextResponse.json({
        success: false,
        message: 'Item ID wird benötigt'
      }, { status: 400 });
    }

    // Konvertiere numerische Werte
    if (updateData.price !== undefined) {
      updateData.price = Number(updateData.price);
    }
    if (updateData.inStock !== undefined) {
      updateData.inStock = Number(updateData.inStock);
    }

    const item = await prisma.item.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({
      success: true,
      item: item
    });
  } catch (err) {
    console.error('Error updating item:', err);
    return NextResponse.json(
      { 
        success: false,
        message: 'Fehler beim Aktualisieren des Items',
        error: err instanceof Error ? err.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const data = await request.json();
    const { id } = data;

    if (!id) {
      return NextResponse.json({
        success: false,
        message: 'Item ID wird benötigt'
      }, { status: 400 });
    }

    await prisma.item.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Item erfolgreich gelöscht'
    });
  } catch (err) {
    console.error('Error deleting item:', err);
    return NextResponse.json(
      { 
        success: false,
        message: 'Fehler beim Löschen des Items',
        error: err instanceof Error ? err.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
