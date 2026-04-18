import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  // 1. Recupera il token dai cookie
  const token = request.cookies.get("auth-token")?.value;
  const { pathname } = request.nextUrl;

  /* Redirect sulla HomePage se l'utente già loggato, accedete a login/register */
  if (token && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  /* Se l'utente non è autenticato e va sulla pagina del profilo o sulla dashboard, viene rendirizzato alla pagina login */
  if (!token && (pathname === "/me" || pathname === "/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/register", "/me", "/dashboard"],
};
