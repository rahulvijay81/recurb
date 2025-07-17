import { NextResponse } from 'next/server';

// This route will handle the OAuth callback
// Implementation will be added in task 2.1
export async function GET(request: Request) {
  return NextResponse.redirect(new URL('/dashboard', request.url));
}