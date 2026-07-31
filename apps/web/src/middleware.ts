import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token');

  if (!token) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
