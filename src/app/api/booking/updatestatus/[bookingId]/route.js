import { proxyRequest } from '@/lib/proxyRequest';
import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
  const { bookingId } = await params;
  const body = await request.json();
  const endpoint = `/api/Booking/UpdateStatus/${bookingId}`;
  const result = await proxyRequest(endpoint, 'PUT', body);
  return NextResponse.json(result.data, { status: result.status });
} 