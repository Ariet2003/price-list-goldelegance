import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const runtime = 'nodejs';

export async function POST() {
  try {
    // Удаляем куки с токеном
    cookies().delete('admin-token');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[LOGOUT_API_ERROR]', error);
    return NextResponse.json(
      { error: 'Ошибка при выходе. Пожалуйста, попробуйте позже.' },
      { status: 500 }
    );
  }
} 