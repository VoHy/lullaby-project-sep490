import { proxyRequest } from '@/lib/proxyRequest';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { id } = await params;
  const endpoint = `/api/CustomizeTask/${id}`;
  return await proxyRequest(endpoint, 'GET');
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  const endpoint = `/api/CustomizeTask/${id}`;
  return await proxyRequest(endpoint, 'DELETE');
}
