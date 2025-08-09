import { proxyRequest } from '@/lib/proxyRequest';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { customizeTaskId } = await params;
  const endpoint = `/api/Feedback/GetByCustomizeTask/${customizeTaskId}`;
  return await proxyRequest(endpoint, 'GET');
} 