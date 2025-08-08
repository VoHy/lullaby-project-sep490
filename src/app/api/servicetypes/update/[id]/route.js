import { proxyRequest } from '@/lib/proxyRequest';
import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
  const { id } = await params;
  const body = await request.json();
  const endpoint = `/api/servicetypes/update/${id}`;
  const result = await proxyRequest(endpoint, 'PUT', body);
  return NextResponse.json(result.data, { status: result.status });
} 