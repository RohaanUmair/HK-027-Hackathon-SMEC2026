import { NextResponse } from 'next/server';

export function middleware(request) {
    const path = request.nextUrl.pathname;

    const isPublicPath = path === '/auth' || path === '/login' || path === '/signup';

    const userRole = request.cookies.get('user_role')?.value;

    if (!userRole && !isPublicPath) {
        return NextResponse.redirect(new URL('/auth', request.url));
    }

    if (userRole && isPublicPath) {
        if (userRole === 'admin') {
            return NextResponse.redirect(new URL('/admin', request.url));
        }
        return NextResponse.redirect(new URL('/resources', request.url));
    }

    if (path.startsWith('/admin') && userRole !== 'admin') {
        return NextResponse.redirect(new URL('/resources', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.svg).*)',
    ],
};
