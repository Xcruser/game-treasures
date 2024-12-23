import { NextResponse } from 'next/server';
import { readdir, stat } from 'fs/promises';
import { join } from 'path';

export async function GET() {
  try {
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    
    try {
      const files = await readdir(uploadsDir);
      const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file));
      
      // Sammle detaillierte Informationen für jedes Bild
      const imagesPromises = imageFiles.map(async (file) => {
        const filePath = join(uploadsDir, file);
        const stats = await stat(filePath);
        
        return {
          url: `/uploads/${file}`,
          name: file,
          uploadedAt: stats.mtime.toISOString(),
          size: stats.size,
        };
      });

      const images = await Promise.all(imagesPromises);
      
      // Sortiere nach Uploaddatum, neueste zuerst
      images.sort((a, b) => 
        new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
      );

      return NextResponse.json({ images });
    } catch (error) {
      // Falls das Verzeichnis nicht existiert, erstelle es
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return NextResponse.json({ images: [] });
      }
      throw error;
    }
  } catch (error) {
    console.error('Error reading images directory:', error);
    return NextResponse.json(
      { error: 'Failed to read images' },
      { status: 500 }
    );
  }
}
