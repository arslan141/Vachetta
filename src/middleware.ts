import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { getDefaultRedirectForRole, isAdminOnlyPath, isCustomerOnlyPath } from '@/libs/rbac';

export async function middleware(request: NextRequest) {
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  });

  const pathname = request.nextUrl.pathname;
  const userRole = token?.role as 'admin' | 'customer' | undefined;

  // RBAC: Role-Based Access Control
  
  // Redirect authenticated users based on their role when accessing login page
  if (pathname === '/login' && token && userRole) {
    console.log('🔍 Authenticated user accessing login page');
    const defaultRedirect = getDefaultRedirectForRole(userRole);
    console.log(`🚀 Redirecting ${userRole} to ${defaultRedirect}`);
    return NextResponse.redirect(new URL(defaultRedirect, request.url));
  }

  // Check admin route access
  if (isAdminOnlyPath(pathname)) {
    console.log('🔍 Admin route accessed:', pathname);
    console.log('🔍 Token exists:', !!token);
    if (token) {
      console.log('🔍 User role:', userRole);
    }

    // If no token or user is not admin, redirect to login
    if (!token || userRole !== 'admin') {
      console.log('🚫 Access denied - redirecting to login');
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', request.url);
      return NextResponse.redirect(loginUrl);
    }

    console.log('✅ Admin access granted');
  }

  // Redirect admin users away from customer-only pages
  if (token && userRole === 'admin' && isCustomerOnlyPath(pathname)) {
    console.log('🚫 Admin accessing customer-only route, redirecting to admin dashboard');
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = { 
  matcher: [
    "/account/:path*", 
    "/create", 
    "/result",
    "/admin/:path*",
    "/login",
    "/cart/:path*",
    "/wishlist/:path*",
    "/orders/:path*"
  ] 
};
