import { proxyRequest } from '@/lib/proxyRequest';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { nursingId } = await params;
  const result = await proxyRequest(`/api/WorkSchedule/GetAllByNursing/${nursingId}`, 'GET');
  return NextResponse.json(result.data, { status: result.status });
}


