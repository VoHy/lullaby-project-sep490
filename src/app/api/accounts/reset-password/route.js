import { proxyRequest } from '@/lib/proxyRequest';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const body = await request.json();
  const result = await proxyRequest('/api/accounts/reset-password', 'POST', {
    body: JSON.stringify(body)
  });
  return NextResponse.json(result.data, { status: result.status });
} 