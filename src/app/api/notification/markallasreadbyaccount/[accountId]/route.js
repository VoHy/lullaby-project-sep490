import { proxyRequest } from '@/lib/proxyRequest';
import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
  const { accountId } = await params;
  const endpoint = `/api/Notification/MarkAllAsReadByAccount/${accountId}`;
  return await proxyRequest(endpoint, 'PUT');
} 