import { proxyRequest } from '@/lib/proxyRequest';
import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
  const id = params?.id;
  const body = await request.json();
  // Giữ nguyên body để khớp Swagger (application/json-patch+json chấp nhận full object)
  const backendBody = body;
  const endpoint = `/api/accounts/update/${id}`;

  const authorization = request.headers.get('authorization');

  const result = await proxyRequest(endpoint, 'PUT', {
    headers: {
      'Content-Type': 'application/json-patch+json',
      ...(authorization ? { Authorization: authorization } : {})
    },
    body: JSON.stringify(backendBody)
  });

  return NextResponse.json(result.data, { status: result.status });
}