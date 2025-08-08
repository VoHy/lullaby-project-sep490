import { proxyRequest } from '@/lib/proxyRequest';
import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
  const id = params?.id;
  const body = await request.json();
  const authorization = request.headers.get('authorization');
  const endpoint = `/api/zones/update/${id}`;
  const result = await proxyRequest(endpoint, 'PUT', {
    headers: {
      'Content-Type': 'application/json-patch+json',
      ...(authorization ? { Authorization: authorization } : {})
    },
    body: JSON.stringify(body)
  });
  return NextResponse.json(result.data, { status: result.status });
} 