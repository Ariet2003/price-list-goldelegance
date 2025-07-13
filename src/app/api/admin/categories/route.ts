import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Configure route to use Node.js runtime
export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = 50;
    const skip = (page - 1) * limit;

    // Get all categories with product counts
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            products: true
          }
        },
        products: {
          select: {
            id: true,
          },
        },
      },
    });

    // Sort categories by product count
    const sortedCategories = categories
      .sort((a, b) => b._count.products - a._count.products)
      .slice(skip, skip + limit);

    const total = categories.length;

    return NextResponse.json({
      categories: sortedCategories,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
        perPage: limit,
      },
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { name } = await request.json();

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }

    // Check if category with this name already exists
    const existingCategory = await prisma.category.findUnique({
      where: {
        name: name.trim()
      }
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: 'Category with this name already exists' },
        { status: 400 }
      );
    }

    // Create new category
    const category = await prisma.category.create({
      data: {
        name: name.trim()
      }
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create category' },
      { status: 500 }
    );
  }
} 