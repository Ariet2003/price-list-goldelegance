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

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: parseInt(params.id)
      },
      include: {
        category: true
      }
    }).catch(error => {
      console.error('Error fetching product:', error);
      throw new Error('Failed to fetch product');
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error in GET operation:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch product' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: parseInt(params.id)
      }
    }).catch(error => {
      console.error('Error fetching product:', error);
      throw new Error('Failed to fetch product');
    });

    if (product) {
      // Delete all images from ImgBB
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

      // Delete the product from the database
      await prisma.product.delete({
        where: {
          id: parseInt(params.id)
        }
      }).catch(error => {
        console.error('Error deleting product:', error);
        throw new Error('Failed to delete product');
      });

      return NextResponse.json({ message: 'Product deleted successfully' });
    }

    return NextResponse.json(
      { error: 'Product not found' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Error in DELETE operation:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete product' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, description, price, categoryId, inStock, images } = body;

    const product = await prisma.product.update({
      where: {
        id: parseInt(params.id)
      },
      data: {
        name,
        description,
        price,
        categoryId,
        inStock,
        images,
      }
    }).catch(error => {
      console.error('Error updating product:', error);
      throw new Error('Failed to update product');
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error in PATCH operation:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update product' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 