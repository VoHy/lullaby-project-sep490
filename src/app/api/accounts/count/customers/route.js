import { proxyRequest } from '@/lib/proxyRequest';
import { NextResponse } from 'next/server';

export async function GET() {
  const result = await proxyRequest('/api/accounts/count/customers', 'GET');
  return NextResponse.json(result.data, { status: result.status });
} 