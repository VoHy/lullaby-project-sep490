import { proxyRequest } from '@/lib/proxyRequest';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const endpoint = `/api/Booking/GetAllByStatus?status=${status}`;
  const result = await proxyRequest(endpoint, 'GET');
  return NextResponse.json(result.data, { status: result.status });
} 
