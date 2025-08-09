import { proxyRequest } from '@/lib/proxyRequest';
import { NextResponse } from 'next/server';

export async function DELETE(request, { params }) {
  const { id } = await params;
  const result = await proxyRequest(`/api/accounts/delete/${id}`, 'DELETE');
  return NextResponse.json(result.data, { status: result.status });
} 