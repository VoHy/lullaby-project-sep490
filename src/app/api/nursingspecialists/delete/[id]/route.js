import { proxyRequest } from '@/lib/proxyRequest';
import { NextResponse } from 'next/server';

export async function DELETE(request, { params }) {
  const { id } = await params;
  const endpoint = `/api/nursingspecialists/delete/${id}`;
  const result = await proxyRequest(endpoint, 'DELETE');
  return NextResponse.json(result.data, { status: result.status });
} 