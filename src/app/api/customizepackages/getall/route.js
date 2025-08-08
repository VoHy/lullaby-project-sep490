import { proxyRequest } from '@/lib/proxyRequest';
import { NextResponse } from 'next/server';

export async function GET() {
  const result = await proxyRequest('/api/CustomizePackage/GetAll', 'GET');
  return NextResponse.json(result.data, { status: result.status });
}

