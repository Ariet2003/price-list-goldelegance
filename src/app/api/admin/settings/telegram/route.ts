import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const POST = async (request: Request) => {
  try {
    const { botToken, adminUserId } = await request.json();

    // Обновляем или создаем токен бота
    await prisma.settings.upsert({
      where: { key: 'telegram_bot_token' },
      update: { value: botToken },
      create: {
        key: 'telegram_bot_token',
        value: botToken
      }
    });

    // Обновляем или создаем ID администратора
    await prisma.settings.upsert({
      where: { key: 'telegram_admin_id' },
      update: { value: adminUserId },
      create: {
        key: 'telegram_admin_id',
        value: adminUserId
      }
    });

    return NextResponse.json({ message: 'Настройки Telegram успешно обновлены' });
  } catch (error) {
    console.error('Error updating Telegram settings:', error);
    return NextResponse.json(
      { error: 'Ошибка при обновлении настроек Telegram' },
      { status: 500 }
    );
  }
};

export const GET = async () => {
  try {
    const [botToken, adminUserId] = await Promise.all([
      prisma.settings.findUnique({
        where: { key: 'telegram_bot_token' }
      }),
      prisma.settings.findUnique({
        where: { key: 'telegram_admin_id' }
      })
    ]);

    return NextResponse.json({
      botToken: botToken?.value || '',
      adminUserId: adminUserId?.value || ''
    });
  } catch (error) {
    console.error('Error fetching Telegram settings:', error);
    return NextResponse.json(
      { error: 'Ошибка при получении настроек Telegram' },
      { status: 500 }
    );
  }
}; 