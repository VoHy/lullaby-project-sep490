import { proxyRequest } from '@/lib/proxyRequest';
import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
  const id = params?.id;
  const body = await request.json();

  const backendData = body;
  const endpoint = `/api/careprofiles/update/${id}`;

  const authorization = request.headers.get('authorization');

  const result = await proxyRequest(endpoint, 'PUT', {
    headers: {
      'Content-Type': 'application/json-patch+json',
      ...(authorization ? { Authorization: authorization } : {})
    },
    body: JSON.stringify(backendData)
  });

  return NextResponse.json(result.data, { status: result.status });
} 