import { proxyRequest } from '@/lib/proxyRequest';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const endpoint = `/api/Booking/GetAllByStatusAndCareProfile?status=${status}&careProfileId=${careProfileId}`;
  const result = await proxyRequest(endpoint, 'GET');
  return NextResponse.json(result.data, { status: result.status });
} 
