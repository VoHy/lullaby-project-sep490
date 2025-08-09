import { proxyRequest } from '@/lib/proxyRequest';
import { NextResponse } from 'next/server';

export async function GET() {
  const result = await proxyRequest('/api/nursingspecialists/getall', 'GET');
  return NextResponse.json(result.data, { status: result.status });
}

export async function POST(request) {
  const body = await request.json();
  const result = await proxyRequest('/api/nursingspecialists', 'POST', {
    body: JSON.stringify(body)
  });
  return NextResponse.json(result.data, { status: result.status });
}
