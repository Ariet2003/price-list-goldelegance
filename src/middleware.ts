import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Конвертируем секретный ключ в формат для jose
const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key'
);

export async function middleware(request: NextRequest) {
  // Проверяем, является ли путь админским
  if (request.nextUrl.pathname.startsWith('/admin')) {
    console.log('Checking admin route:', request.nextUrl.pathname);

    // Пропускаем страницу логина
    if (request.nextUrl.pathname.endsWith('/login')) {
      console.log('Login page, skipping auth check');
      return NextResponse.next();
    }

    const token = request.cookies.get('admin-token')?.value;
    console.log('Found token:', token ? 'yes' : 'no');

    if (!token) {
      console.log('No token found, redirecting to login');
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    try {
      console.log('Verifying token...');
      // Проверяем JWT токен используя jose
      const { payload } = await jwtVerify(token, secret);
      console.log('Token payload:', payload);
      
      if (payload.role === 'admin') {
        console.log('Valid admin token, proceeding');
        const response = NextResponse.next();
        return response;
      }

      console.log('Token does not have admin role');
    } catch (error) {
      // Если токен недействителен или истек срок действия
      console.error('Token verification failed:', error);
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    console.log('Invalid token, redirecting to login');
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*'
}; 