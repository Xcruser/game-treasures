import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true });
  
  // Lösche den auth_token Cookie
  response.cookies.delete('auth_token');
  
  return response;
}
