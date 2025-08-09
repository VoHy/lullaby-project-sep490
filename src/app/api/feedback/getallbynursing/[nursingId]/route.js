import { proxyRequest } from '@/lib/proxyRequest';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { nursingId } = await params;
  const endpoint = `/api/Feedback/GetAllByNursing/${nursingId}`;
  return await proxyRequest(endpoint, 'GET');
} 