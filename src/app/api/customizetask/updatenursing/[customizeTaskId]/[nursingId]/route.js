import { proxyRequest } from '@/lib/proxyRequest';
import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
  const { customizeTaskId, nursingId } = await params;
  const endpoint = `/api/CustomizeTask/UpdateNursing/${customizeTaskId}/${nursingId}`;
  const result = await proxyRequest(endpoint, 'PUT');
  return NextResponse.json(result.data, { status: result.status });
}
