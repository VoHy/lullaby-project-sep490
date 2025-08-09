import { proxyRequest } from '@/lib/proxyRequest';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { walletId } = params;
  const endpoint = `/api/Wallet/${walletId}`;
  const result = await proxyRequest(endpoint, 'GET');
  return NextResponse.json(result.data, { status: result.status });
}

export async function DELETE(request, { params }) {
  const { walletId } = params;
  const endpoint = `/api/Wallet/${walletId}`;
  const result = await proxyRequest(endpoint, 'DELETE');
  return NextResponse.json(result.data, { status: result.status });
} 