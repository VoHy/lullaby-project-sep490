import { proxyRequest } from '@/lib/proxyRequest';
import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
  const id = params?.id;
  const body = await request.json();
  const endpoint = `/api/accounts/update/${id}`;

  const authorization = request.headers.get('authorization');

  const result = await proxyRequest(endpoint, 'PUT', {
    headers: authorization ? { Authorization: authorization } : {},
    body: JSON.stringify(body)
  });

  return NextResponse.json(result.data, { status: result.status });
}