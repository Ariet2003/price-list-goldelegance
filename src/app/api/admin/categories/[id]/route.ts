import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

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
    }).catch(error => {
      console.error('Error fetching products:', error);
      throw new Error('Failed to fetch products');
    });

    // Delete all images from ImgBB for all products in the category
    for (const product of products) {
      const images = product.images.map(img => {
        // If the image is a string, try to parse it
        if (typeof img === 'string') {
          try {
            const parsed = JSON.parse(img);
            return isImageData(parsed) ? parsed : null;
          } catch {
            return null;
          }
        }
        // If it's already an object, validate it
        return isImageData(img) ? img : null;
      }).filter((img): img is ImageData => img !== null);

      await Promise.all(images.map(image => deleteImageFromImgBB(image.deleteUrl)));
    }

    // Delete all products in the category
    await prisma.product.deleteMany({
      where: {
        categoryId: categoryId
      }
    }).catch(error => {
      console.error('Error deleting products:', error);
      throw new Error('Failed to delete products');
    });

    // Delete the category
    await prisma.category.delete({
      where: {
        id: categoryId
      }
    }).catch(error => {
      console.error('Error deleting category:', error);
      throw new Error('Failed to delete category');
    });

    return NextResponse.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE operation:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete category' },
      { status: 500 }
    );
  } finally {
    // Disconnect Prisma client after operation
    await prisma.$disconnect();
  }
} 