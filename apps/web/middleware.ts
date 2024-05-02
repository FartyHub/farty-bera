import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('ngrok-skip-browser-warning', 'true');

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}
