import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  // Блокируем доступ к test-страницам в продакшн-окружении
  if (process.env.NODE_ENV === 'production' && req.nextUrl.pathname.startsWith('/test')) {
    return NextResponse.redirect(new URL('/', req.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/|api/|static/|favicon.ico).*)'],
}
