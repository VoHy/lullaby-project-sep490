import { proxyRequest } from '@/lib/proxyRequest';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { bookingId, status } = params;
  const endpoint = `/api/CustomizePackage/GetAllByStatusAndBooking/${bookingId}/${status}`;
  return await proxyRequest(endpoint, 'GET');
} 