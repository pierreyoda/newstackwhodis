import { NextRequest, NextResponse } from "next/server";

export const middleware = (request: NextRequest) => {
  const headers = new Headers(request.headers);
  headers.set("x-pathname", request.nextUrl.pathname);
  return NextResponse.next({
    request: {
      headers,
    },
  });
};
