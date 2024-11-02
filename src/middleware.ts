import { NextResponse } from "next/server";
import { NextRequestWithAuth, withAuth } from "next-auth/middleware";

function middleware(request: NextRequestWithAuth) {
  console.log(
    request.nextauth.token,
    request.nextUrl.pathname.startsWith("/dashboard")
  );
  if (
    request.nextauth.token &&
    !request.nextUrl.pathname.startsWith("/dashboard")
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (
    !request.nextauth.token &&
    request.nextUrl.pathname.startsWith("/dashboard")
  ) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  return NextResponse.next();
}

export default withAuth(middleware, {
  callbacks: {
    authorized: ({ token }) => !!token,
  },
});

export const config = {
  matcher: ["/", "/dashboard", "/dashboard/:path*"],
};
