import { proxyRequest } from '@/lib/proxyRequest';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { customizePackageId } = await params;
  const endpoint = `/api/CustomizeTask/GetAllByCustomizePackage/${customizePackageId}`;
  return await proxyRequest(endpoint, 'GET');
}
