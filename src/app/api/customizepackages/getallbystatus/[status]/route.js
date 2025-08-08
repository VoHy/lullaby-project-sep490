import { proxyRequest } from '@/lib/proxyRequest';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { status } = params;
  const endpoint = `/api/CustomizePackage/GetAllByStatus/${status}`;
  return await proxyRequest(endpoint, 'GET');
} 