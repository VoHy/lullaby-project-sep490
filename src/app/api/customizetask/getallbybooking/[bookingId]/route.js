import { proxyRequest } from '@/lib/proxyRequest';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { bookingId } = await params;
  const endpoint = `/api/CustomizeTask/GetAllByBooking/${bookingId}`;
  return await proxyRequest(endpoint, 'GET');
}
