import { proxyRequest } from '@/lib/proxyRequest';
import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
  const { blogId } = await params;
  const body = await request.json();
  const endpoint = `/api/Blog/Update/${blogId}`;
  return await proxyRequest(endpoint, 'PUT', body);
} 