import { proxyRequest } from '@/lib/proxyRequest';
import { NextResponse } from 'next/server';

export async function DELETE(request, { params }) {
  const { id } = await params;
  const endpoint = `/api/servicetasks/delete/${id}`;
  return await proxyRequest(endpoint, 'DELETE');
} 