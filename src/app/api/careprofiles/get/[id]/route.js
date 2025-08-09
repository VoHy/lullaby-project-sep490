import { proxyRequest } from '@/lib/proxyRequest';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { id } = params;
  const endpoint = `/api/careprofiles/get/${id}`;
  return await proxyRequest(endpoint, 'GET');
} 