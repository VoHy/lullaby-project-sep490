import { proxyRequest } from '@/lib/proxyRequest';
import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
  const { blogId } = await params;
  const endpoint = `/api/Blog/Inactive/${blogId}`;
  return await proxyRequest(endpoint, 'PUT');
} 