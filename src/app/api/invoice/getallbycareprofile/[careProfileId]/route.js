import { proxyRequest } from '@/lib/proxyRequest';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { careProfileId } = await params;
  const endpoint = `/api/Invoice/GetAllByCareProfile/${careProfileId}`;
  return await proxyRequest(endpoint, 'GET');
} 