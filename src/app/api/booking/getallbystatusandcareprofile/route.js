import { proxyRequest } from '@/lib/proxyRequest';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const careProfileId = searchParams.get('careProfileId');
  const endpoint = `/api/Booking/GetAllByStatusAndCareProfile?status=${encodeURIComponent(status || '')}&careProfileId=${encodeURIComponent(careProfileId || '')}`;
  const result = await proxyRequest(endpoint, 'GET');
  return NextResponse.json(result.data, { status: result.status });
} 
