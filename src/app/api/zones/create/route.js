import { proxyRequest } from '@/lib/proxyRequest';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const body = await request.json();
  const authorization = request.headers.get('authorization');
  const result = await proxyRequest('/api/zones/create', 'POST', {
    headers: {
      ...(authorization ? { Authorization: authorization } : {})
    },
    body: JSON.stringify(body)
  });
  return NextResponse.json(result.data, { status: result.status });
}
