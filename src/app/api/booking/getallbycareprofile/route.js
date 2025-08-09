import { proxyRequest } from '@/lib/proxyRequest';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const careProfileId = searchParams.get('careProfileId');
  const endpoint = `/api/Booking/GetAllByCareProfile/${careProfileId}`;
  const result = await proxyRequest(endpoint, 'GET');
  return NextResponse.json(result.data, { status: result.status });
} 
