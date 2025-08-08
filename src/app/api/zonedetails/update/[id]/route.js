import { proxyRequest } from '@/lib/proxyRequest';
import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
  const { id } = await params;
  const body = await request.json();
  const endpoint = `/api/zonedetails/update/${id}`;
  return await proxyRequest(endpoint, 'PUT', body);
} 