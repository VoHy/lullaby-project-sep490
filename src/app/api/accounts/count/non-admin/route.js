import { proxyRequest } from '@/lib/proxyRequest';
import { NextResponse } from 'next/server';

export async function GET() {
  const result = await proxyRequest('/api/accounts/count/non-admin', 'GET');
  return NextResponse.json(result.data, { status: result.status });
} 