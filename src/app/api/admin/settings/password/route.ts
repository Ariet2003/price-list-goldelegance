import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import prisma from '@/lib/prisma';

export const POST = async (request: Request) => {
  try {
    const { currentPassword, newPassword } = await request.json();

    // Получаем текущий хэш пароля из БД
    const accountSetting = await prisma.settings.findUnique({
      where: { key: 'account' }
    });

    if (!accountSetting) {
      return NextResponse.json(
        { error: 'Аккаунт не найден' },
        { status: 404 }
      );
    }

    // Проверяем текущий пароль
    const isPasswordValid = await bcrypt.compare(currentPassword, accountSetting.value);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Неверный текущий пароль' },
        { status: 400 }
      );
    }

    // Хэшируем новый пароль
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Обновляем пароль в БД
    await prisma.settings.update({
      where: { key: 'account' },
      data: { value: hashedPassword }
    });

    return NextResponse.json({ message: 'Пароль успешно обновлен' });
  } catch (error) {
    console.error('Error updating password:', error);
    return NextResponse.json(
      { error: 'Ошибка при обновлении пароля' },
      { status: 500 }
    );
  }
}
