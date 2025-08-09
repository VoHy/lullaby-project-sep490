import { proxyRequest } from '@/lib/proxyRequest';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { accountId } = await params;
  const endpoint = `/api/Notification/GetUnReadByAccount/${accountId}`;
  return await proxyRequest(endpoint, 'GET');
} 