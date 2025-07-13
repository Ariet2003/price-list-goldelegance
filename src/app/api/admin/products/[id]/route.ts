import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface ImageData {
  url: string;
  deleteUrl: string;
}

async function deleteImageFromImgBB(deleteUrl: string) {
  try {
    const response = await fetch(deleteUrl);
    if (!response.ok) {
      throw new Error('Failed to delete image');
    }
  } catch (error) {
    console.error('Error deleting image from ImgBB:', error);
    // We don't throw here to continue with product deletion even if image deletion fails
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    // Get the product to access its images
    const product = await prisma.product.findUnique({
      where: { id },
      select: { images: true }
    });

    if (product) {
      // Delete all images from ImgBB
      const images = product.images as ImageData[];
      await Promise.all(images.map(image => deleteImageFromImgBB(image.deleteUrl)));
    }

    // Delete the product from the database
    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Product and associated images deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const { name, description, price, categoryId, inStock, images } = body;

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price,
        categoryId,
        inStock,
        images,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
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
        category: {
          select: {
            name: true
          }
        }
      }
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 