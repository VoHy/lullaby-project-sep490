import { proxyRequest } from '@/lib/proxyRequest';
import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
  const { customizePackageId } = params;
  const body = await request.json();
  const endpoint = `/api/CustomizePackage/UpdateStatus/${customizePackageId}`;
  return await proxyRequest(endpoint, 'PUT', body);
} 