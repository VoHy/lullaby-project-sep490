import { proxyRequest } from '@/lib/proxyRequest';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { payOSId } = await params;
  const endpoint = `/api/PayOS/${payOSId}`;
  return await proxyRequest(endpoint, 'GET');
}

export async function DELETE(request, { params }) {
  const { payOSId } = await params;
  const endpoint = `/api/PayOS/${payOSId}`;
  return await proxyRequest(endpoint, 'DELETE');
} 