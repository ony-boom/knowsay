import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// These routes don't require authentication
const publicRoutes = [
  '/',
  '/auth/login',
  '/auth/sign-up',
  '/auth/error',
  '/api/auth'
];

// Check if the route is public
const isPublicRoute = (path: string) => {
  // Add specific check for static assets and API routes
  if (
    path.startsWith('/_next/') || 
    path.includes('/favicon.ico') ||
    path.includes('.png') ||
    path.includes('.jpg') ||
    path.includes('.svg') ||
    path.includes('.ico')
  ) {
    return true;
  }
  
  return publicRoutes.some(route => 
    path === route || path.startsWith(`${route}/`)
  );
};

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  
  try {
    // Allow public routes
    if (isPublicRoute(path)) {
      return NextResponse.next();
    }
    
    // Check for token in secure cookie
    const token = await getToken({ 
      req,
      secret: process.env.NEXTAUTH_SECRET 
    });
    
    // If no token and trying to access a protected route, redirect to login
    if (!token && !path.startsWith('/auth/')) {
      const loginUrl = new URL('/auth/login', req.url);
      loginUrl.searchParams.set('callbackUrl', encodeURIComponent(req.url));
      return NextResponse.redirect(loginUrl);
    }
    
    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    
    // Fallback behavior - allow the request to proceed
    // to prevent blocking the application completely
    return NextResponse.next();
  }
}

// Update the matcher to be more precise and exclude all static files and api routes we don't need to protect
export const config = {
  matcher: [
    /*
     * Match all paths except static files and images
     */
    '/((?!_next/static|_next/image|images|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
