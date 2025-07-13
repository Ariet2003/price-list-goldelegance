import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Get total counts
    const totalProducts = await prisma.product.count();
    const totalCategories = await prisma.category.count();

    // Get products by stock status
    const activeProducts = await prisma.product.count({
      where: {
        inStock: true
      }
    });

    const inactiveProducts = await prisma.product.count({
      where: {
        inStock: false
      }
    });

    // Get products by category
    const productsByCategory = await prisma.category.findMany({
      select: {
        name: true,
        _count: {
          select: {
            products: true
          }
        }
      }
    });

    // Format data for charts
    const categoryData = productsByCategory.map(category => ({
      name: category.name,
      value: category._count.products
    }));

    const stockStatusData = [
      { name: 'В наличии', value: activeProducts },
      { name: 'Нет в наличии', value: inactiveProducts }
    ];

    return NextResponse.json({
      totalProducts,
      totalCategories,
      activeProducts,
      inactiveProducts,
      categoryData,
      stockStatusData
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
} 