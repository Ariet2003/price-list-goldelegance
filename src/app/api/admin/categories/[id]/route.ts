import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

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
    // We don't throw here to continue with category deletion even if image deletion fails
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
    const id = parseInt(params.id);

    // Get all products in the category to access their images
    const products = await prisma.product.findMany({
      where: { categoryId: id },
      select: { images: true }
    });

    // Delete all images from ImgBB for all products in the category
    for (const product of products) {
      const images = (product.images as Prisma.JsonValue[]).map(img => {
        const imgData = img as unknown as ImageData;
        return imgData;
      });
      await Promise.all(images.map(image => deleteImageFromImgBB(image.deleteUrl)));
    }

    // Delete all products in this category
    await prisma.product.deleteMany({
      where: { categoryId: id },
    });

    // Then delete the category
    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Category, related products, and images deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    );
  }
} 