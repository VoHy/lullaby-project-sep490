import { proxyRequest } from '@/lib/proxyRequest';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { packageServiceId } = await params;
  const endpoint = `/api/servicetasks/getbypackage/${packageServiceId}`;
  const authorization = request.headers.get('authorization');
  const result = await proxyRequest(endpoint, 'GET', {
    headers: {
      ...(authorization ? { Authorization: authorization } : {})
    }
  });
  return NextResponse.json(result.data, { status: result.status });
} 