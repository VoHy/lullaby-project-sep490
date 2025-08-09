import { proxyRequest } from '@/lib/proxyRequest';
import { NextResponse } from 'next/server';

export async function DELETE(request, { params }) {
  const id = params?.id;
  const endpoint = `/api/zones/delete/${id}`;
  const authorization = request.headers.get('authorization');
  const result = await proxyRequest(endpoint, 'DELETE', {
    headers: {
      ...(authorization ? { Authorization: authorization } : {})
    }
  });
  return NextResponse.json(result.data, { status: result.status });
} 