import { proxyRequest } from '@/lib/proxyRequest';
import { NextResponse } from 'next/server';

export async function GET() {
  const result = await proxyRequest('/api/servicetypes/getall', 'GET');
  return NextResponse.json(result.data, { status: result.status });
}

export async function POST(request) {
  const body = await request.json();
  const endpoint = `/api/servicetypes`;
  const result = await proxyRequest(endpoint, 'POST', body);
  return NextResponse.json(result.data, { status: result.status });
} 
