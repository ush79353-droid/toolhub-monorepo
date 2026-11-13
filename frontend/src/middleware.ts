import { NextResponse, type NextRequest } from 'next/server';

export const ADMIN_SESSION_COOKIE = 'admin_session';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const sessionToken = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;

  const isAuthRoute =
    pathname === '/admin/login' ||
    pathname === '/admin/forgot-password' ||
    pathname === '/admin/reset-password';

  const isAuditRoute = pathname === '/tools-audit' || pathname.startsWith('/tools-audit/');
  const isAdminDashboardRoute = (pathname.startsWith('/admin') && !isAuthRoute) || isAuditRoute;

  // Case 1: Unauthenticated visitor accessing protected admin dashboard -> redirect to login
  if (isAdminDashboardRoute && !sessionToken) {
    const loginUrl = new URL('/admin/login', request.url);
    if (pathname !== '/admin') {
      loginUrl.searchParams.set('redirect', pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  // Case 2: Authenticated admin visiting login/forgot/reset -> redirect to dashboard
  if (isAuthRoute && sessionToken) {
    const dashboardUrl = new URL('/admin', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // Set security and cache-control headers for admin routes and the source audit
  if (pathname.startsWith('/admin') || isAuditRoute) {
    const response = NextResponse.next();
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/tools-audit', '/tools-audit/:path*'],
};
