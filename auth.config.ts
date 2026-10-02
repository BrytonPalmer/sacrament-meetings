import type { NextAuthConfig } from 'next-auth';

// Only these two route shapes are protected. Route groups like (admin) don't
// appear in the URL, so we match the real paths: /meetings/new and
// /meetings/<id>/edit. The public list (/meetings) and detail pages
// (/meetings/<id>) are intentionally NOT in this list.
const PROTECTED_PATTERNS = [/^\/meetings\/new$/, /^\/meetings\/\d+\/edit$/];

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isProtected = PROTECTED_PATTERNS.some((pattern) =>
        pattern.test(nextUrl.pathname)
      );

      if (isProtected) {
        return isLoggedIn; // false triggers a redirect to /login
      }

      // Already signed in and on the login page? Send them to the
      // meetings list instead, where the edit/delete controls now show.
      if (isLoggedIn && nextUrl.pathname === '/login') {
        return Response.redirect(new URL('/meetings', nextUrl));
      }

      return true;
    },
  },
  providers: [], // added in auth.ts
} satisfies NextAuthConfig;