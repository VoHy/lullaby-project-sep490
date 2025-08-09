import { proxyRequest } from '@/lib/proxyRequest';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { notificationId } = await params;
  const endpoint = `/api/Notification/${notificationId}`;
  return await proxyRequest(endpoint, 'GET');
}

export async function DELETE(request, { params }) {
  const { notificationId } = await params;
  const endpoint = `/api/Notification/${notificationId}`;
  return await proxyRequest(endpoint, 'DELETE');
} 