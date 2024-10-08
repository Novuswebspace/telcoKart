import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME, COOKIE_OPTIONS, verifyToken } from "./util/auth";

export default async function Middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  console.log("pathname", pathname);

  if (pathname.startsWith("/admin")) {
    try {
      console.log(req.nextUrl.href, req.cookies);
      const token = req.cookies.get(COOKIE_NAME)?.value;
      console.log(token);
      if (!token) throw new Error("Token missing!");
      const payload = await verifyToken(token!);
      console.log("payload", payload);
    } catch (error: any) {
      console.log("error", error);
      const response = NextResponse.redirect(
        new URL(`/login?callback=${pathname}`, req.nextUrl)
      );
      response.cookies.set(COOKIE_NAME, "", { ...COOKIE_OPTIONS, maxAge: -1 });
      return response;
    }
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
