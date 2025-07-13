import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = 50;
    const skip = (page - 1) * limit;

    // Получаем все категории с количеством товаров
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

    // Сортируем категории по количеству товаров
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
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const category = await prisma.category.create({
      data: {
        name: data.name,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
} 