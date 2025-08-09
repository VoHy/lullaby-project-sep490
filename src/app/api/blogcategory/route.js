import { proxyRequest } from '@/lib/proxyRequest';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const body = await request.json();
  const result = await proxyRequest('/api/BlogCategory', 'POST', {
    headers: { 'Content-Type': 'application/json-patch+json' },
    body: JSON.stringify(body)
  });
  return NextResponse.json(result.data, { status: result.status });
} 