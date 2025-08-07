import { NextResponse } from 'next/server';
import { proxyRequest } from '@/lib/proxyRequest';

export async function GET() {
  const { ok, status, data } = await proxyRequest('/api/accounts/customers');

  return NextResponse.json(data, { status });
}
