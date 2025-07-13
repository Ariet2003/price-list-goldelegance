import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const perPage = 50;
    const skip = (page - 1) * perPage;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        skip,
        take: perPage,
        include: {
          category: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.product.count(),
    ]);

    const totalPages = Math.ceil(total / perPage);

    return NextResponse.json({
      products,
      pagination: {
        total,
        pages: totalPages,
        currentPage: page,
        perPage,
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, price, categoryId, inStock, images } = body;

    const product = await prisma.product.create({
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
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
} 