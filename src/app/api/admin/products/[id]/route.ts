import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Configure route to use Edge Runtime
export const runtime = 'edge';

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
  if (!params.id || isNaN(parseInt(params.id))) {
    return NextResponse.json(
      { error: 'Invalid product ID' },
      { status: 400 }
    );
  }

  try {
    const product = await prisma.product.findUnique({
      where: {
        id: parseInt(params.id)
      },
      include: {
        category: true
      }
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
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!params.id || isNaN(parseInt(params.id))) {
    return NextResponse.json(
      { error: 'Invalid product ID' },
      { status: 400 }
    );
  }

  try {
    const product = await prisma.product.findUnique({
      where: {
        id: parseInt(params.id)
      }
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Process and delete images
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

    // Delete images in parallel
    await Promise.all(images.map(image => deleteImageFromImgBB(image.deleteUrl)));

    // Delete the product from the database
    await prisma.product.delete({
      where: {
        id: parseInt(params.id)
      }
    });

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE operation:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete product' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!params.id || isNaN(parseInt(params.id))) {
    return NextResponse.json(
      { error: 'Invalid product ID' },
      { status: 400 }
    );
  }

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
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error in PATCH operation:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update product' },
      { status: 500 }
    );
  }
} 