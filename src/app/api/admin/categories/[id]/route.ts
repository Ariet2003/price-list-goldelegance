import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Configure route to use Node.js runtime
export const runtime = 'nodejs';

interface ImageData {
  url: string;
  deleteUrl: string;
}

// Helper function to validate image data
function isImageData(obj: any): obj is ImageData {
  return typeof obj === 'object' && obj !== null &&
    typeof obj.url === 'string' && 
    typeof obj.deleteUrl === 'string';
}

async function deleteImageFromImgBB(deleteUrl: string) {
  try {
    const response = await fetch(deleteUrl);
    if (!response.ok) {
      console.error('Failed to delete image from ImgBB:', await response.text());
    }
  } catch (error) {
    console.error('Error deleting image from ImgBB:', error);
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const data = await request.json();

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        name: data.name,
      },
    });

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!params.id || isNaN(parseInt(params.id))) {
    return NextResponse.json(
      { error: 'Invalid category ID' },
      { status: 400 }
    );
  }

  try {
    const categoryId = parseInt(params.id);

    // Get all products in the category
    const products = await prisma.product.findMany({
      where: {
        categoryId: categoryId
      },
      select: {
        id: true,
        images: true
      }
    });

    if (!products || products.length === 0) {
      // If no products found, just delete the category
      await prisma.category.delete({
        where: {
          id: categoryId
        }
      });
      return NextResponse.json({ message: 'Category deleted successfully' });
    }

    // Process and delete images
    const deleteImagePromises: Promise<void>[] = [];
    for (const product of products) {
      const images = product.images.map(img => {
        if (typeof img === 'string') {
          try {
            const parsed = JSON.parse(img);
            return isImageData(parsed) ? parsed : null;
          } catch {
            return null;
          }
        }
        return isImageData(img) ? img : null;
      }).filter((img): img is ImageData => img !== null);

      deleteImagePromises.push(...images.map(image => deleteImageFromImgBB(image.deleteUrl)));
    }

    // Delete images in parallel
    await Promise.all(deleteImagePromises);

    // Delete all products in the category
    await prisma.product.deleteMany({
      where: {
        categoryId: categoryId
      }
    });

    // Delete the category
    await prisma.category.delete({
      where: {
        id: categoryId
      }
    });

    return NextResponse.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE operation:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete category' },
      { status: 500 }
    );
  }
} 