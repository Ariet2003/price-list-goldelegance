import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import * as bcrypt from 'bcryptjs';

// В реальном приложении эти данные должны храниться в базе данных
const ADMIN_USERNAME = 'admin';
// Захешированный пароль "admin123"
const ADMIN_PASSWORD = '$2a$10$XQk7AvR9JvO0NBR8UDUzB.D.HYXoQS.MqhG3ZdGx0LzI0JZ7e.YHi';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (username !== ADMIN_USERNAME) {
      return NextResponse.json(
        { error: 'Неверные учетные данные' },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, ADMIN_PASSWORD);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Неверные учетные данные' },
        { status: 401 }
      );
    }

    // Создаем JWT или другой токен для сессии (в данном примере используем простой токен)
    const sessionToken = await bcrypt.hash(username + Date.now().toString(), 10);

    // Устанавливаем куки
    cookies().set('admin_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 дней
      path: '/',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
} 