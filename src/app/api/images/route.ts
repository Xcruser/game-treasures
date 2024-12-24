import { NextResponse } from 'next/server';
import { readdir, stat } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function GET() {
  try {
    const imagesDir = join(process.cwd(), 'public', 'images');
    console.log('Reading images from directory:', imagesDir);

    // Überprüfe, ob das Verzeichnis existiert
    if (!existsSync(imagesDir)) {
      console.log('Images directory does not exist:', imagesDir);
      return NextResponse.json({ 
        images: [],
        error: 'Images directory not found'
      });
    }
    
    try {
      const files = await readdir(imagesDir);
      console.log('All files in directory:', files);
      
      const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file));
      console.log('Filtered image files:', imageFiles);
      
      if (imageFiles.length === 0) {
        console.log('No image files found in directory');
        return NextResponse.json({ images: [] });
      }
      
      // Sammle detaillierte Informationen für jedes Bild
      const imagesPromises = imageFiles.map(async (file) => {
        const filePath = join(imagesDir, file);
        try {
          const stats = await stat(filePath);
          const imageInfo = {
            url: `/images/${file}`,
            name: file,
            uploadedAt: stats.mtime.toISOString(),
            size: stats.size,
          };
          console.log('Image info:', imageInfo);
          return imageInfo;
        } catch (error) {
          console.error(`Error getting stats for file ${file}:`, error);
          return null;
        }
      });

      const images = (await Promise.all(imagesPromises)).filter(Boolean);
      
      // Sortiere nach Uploaddatum, neueste zuerst
      images.sort((a, b) => 
        new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
      );

      console.log('Returning images:', images);
      return NextResponse.json({ images });
    } catch (error) {
      console.error('Error reading directory:', error);
      return NextResponse.json(
        { 
          error: 'Failed to read images directory',
          details: error instanceof Error ? error.message : 'Unknown error'
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in GET /api/images:', error);
    return NextResponse.json(
      { 
        error: 'Failed to read images',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
