import { proxyRequest } from '@/lib/proxyRequest';
import { NextResponse } from 'next/server';

export async function POST(request, { params }) {
  const { accountId } = params;
  const endpoint = `/api/Wallet/${accountId}`;
  const result = await proxyRequest(endpoint, 'POST', {
    body: JSON.stringify({}),
  });
  return NextResponse.json(result.data, { status: result.status });
}