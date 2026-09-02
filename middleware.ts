import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("vianest_session")?.value;
  const { pathname } = req.nextUrl;

  // 1. Define routes that don't need authentication
  const publicRoutes = ["/login", "/api/auth/send-otp", "/api/auth/verify-otp"];

  if (publicRoutes.includes(pathname)) {
    // Prevent logged-in users from seeing the login page
    if (token && pathname === "/login") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  // 2. If no token exists, kick them to login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    // 3. Verify the JWT Token using jose (Edge-compatible)
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    const role = payload.role as string;
    const status = payload.status as string;

    // --- VIANEST ROUTING RULES ---

    // Rule A: Gatekeeper for newly registered agents
    // If they just signed up, they can't book flights yet.
    if (status === "PENDING_VERIFICATION" && pathname !== "/pending") {
      return NextResponse.redirect(new URL("/pending", req.url));
    }

    // Rule B: Super Admins get their own portal
    if (role === "SUPER_ADMIN" && pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    // Rule C: Agents cannot access the admin portal
    if (role === "AGENT" && pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  } catch (error) {
    // If the token is fake, expired, or tampered with, kick them out
    req.cookies.delete("vianest_session");
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

// Ensure the middleware doesn't block Next.js background files (images, css, etc.)
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};