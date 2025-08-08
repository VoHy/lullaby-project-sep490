import { proxyRequest } from '@/lib/proxyRequest';
import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
  const { notificationId } = await params;
  const endpoint = `/api/Notification/IsRead/${notificationId}`;
  return await proxyRequest(endpoint, 'PUT');
} 