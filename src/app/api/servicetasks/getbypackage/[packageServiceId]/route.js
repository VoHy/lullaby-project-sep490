import { proxyRequest } from '@/lib/proxyRequest';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { packageServiceId } = await params;
  const endpoint = `/api/servicetasks/getbypackage/${packageServiceId}`;
  return await proxyRequest(endpoint, 'GET');
} 