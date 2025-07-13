import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { SignJWT } from 'jose';

export const runtime = 'nodejs';

// Секретный ключ для JWT
const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key'
);

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    
    if (!password) {
      return NextResponse.json(
        { error: 'Пароль обязателен' },
        { status: 400 }
      );
    }

    // Получаем хешированный пароль из базы
    const setting = await prisma.settings.findUnique({
      where: {
        key: 'account'
      }
    });

    if (!setting) {
      console.error('[AUTH_API_ERROR] No account setting found in database');
      return NextResponse.json(
        { error: 'Неверный пароль' },
        { status: 401 }
      );
    }

    // Проверяем пароль
    const isValid = await bcrypt.compare(password, setting.value);

    if (!isValid) {
      console.error('[AUTH_API_ERROR] Invalid password attempt');
      return NextResponse.json(
        { error: 'Неверный пароль' },
        { status: 401 }
      );
    }

    // Создаем JWT токен используя jose
    const token = await new SignJWT({ 
      role: 'admin',
      iat: Math.floor(Date.now() / 1000)
    })
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .setExpirationTime('24h')
      .sign(secret);

    // Устанавливаем куки с токеном
    cookies().set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 // 24 часа
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[AUTH_API_ERROR]', error);
    return NextResponse.json(
      { error: 'Ошибка сервера. Пожалуйста, попробуйте позже.' },
      { status: 500 }
    );
  }
} 