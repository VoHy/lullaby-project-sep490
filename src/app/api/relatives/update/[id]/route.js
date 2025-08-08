import { proxyRequest } from '@/lib/proxyRequest';
import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
  const { id } = await params;
  const body = await request.json();
  const endpoint = `/api/relatives/update/${id}`;
  const authorization = request.headers.get('authorization');
  const result = await proxyRequest(endpoint, 'PUT', {
    headers: {
      'Content-Type': 'application/json-patch+json',
      ...(authorization ? { Authorization: authorization } : {})
    },
    body: JSON.stringify(body)
  });
  return NextResponse.json(result.data, { status: result.status });
} 