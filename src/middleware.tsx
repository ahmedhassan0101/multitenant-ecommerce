import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get("host") || "";
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN;
  if (!rootDomain) {
    return NextResponse.next();
  }
  if (hostname.endsWith(`.${rootDomain}`)) {
    const tenantSlug = hostname.replace(`.${rootDomain}`, "");
    return NextResponse.rewrite(
      new URL(`/tenants/${tenantSlug}${url.pathname}`, request.url)
    );
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    // This pattern applies middleware to all routes
    // except routes that start with
    // api, _next, _static, _vercel, media, or any file containing a dot (such as favicon.ico)
    "/((?!api/|_next/|_static/|_vercel|media/|[\\w-]+\\.\\w+).*)",
  ],
};
