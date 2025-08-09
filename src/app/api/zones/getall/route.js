import { proxyRequest } from '@/lib/proxyRequest';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const authorization = request.headers.get('authorization');
  const result = await proxyRequest('/api/zones/getall', 'GET', {
    headers: {
      ...(authorization ? { Authorization: authorization } : {})
    }
  });
  return NextResponse.json(result.data, { status: result.status });
}
