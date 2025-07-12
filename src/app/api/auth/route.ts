import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { SignJWT } from 'jose';

const prisma = new PrismaClient();

// Секретный ключ для JWT
const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key'
);

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    console.log('Received password attempt');

    // Получаем хешированный пароль из базы
    const setting = await prisma.settings.findUnique({
      where: {
        key: 'account'
      }
    });

    if (!setting) {
      console.log('No account setting found in database');
      return NextResponse.json(
        { error: 'Неверный пароль' },
        { status: 401 }
      );
    }

    console.log('Found account setting, comparing passwords');
    // Проверяем пароль
    const isValid = await bcrypt.compare(password, setting.value);

    if (!isValid) {
      console.log('Password comparison failed');
      return NextResponse.json(
        { error: 'Неверный пароль' },
        { status: 401 }
      );
    }

    console.log('Password is valid, generating token');
    // Создаем JWT токен используя jose
    const token = await new SignJWT({ 
      role: 'admin',
      iat: Math.floor(Date.now() / 1000)
    })
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .setExpirationTime('24h')
      .sign(secret);

    console.log('Token generated, setting cookie');
    // Устанавливаем куки с токеном
    cookies().set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // Изменили на lax для лучшей совместимости
      maxAge: 60 * 60 * 24 // 24 часа
    });

    console.log('Cookie set, returning success response');
    return NextResponse.json({ 
      success: true,
      token // Временно возвращаем токен для отладки
    });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'Ошибка сервера', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 