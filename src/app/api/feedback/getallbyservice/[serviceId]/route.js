import { proxyRequest } from '@/lib/proxyRequest';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { serviceId } = await params;
  const endpoint = `/api/Feedback/GetAllByService/${serviceId}`;
  return await proxyRequest(endpoint, 'GET');
} 