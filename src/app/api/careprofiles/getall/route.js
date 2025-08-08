import { proxyRequest } from '@/lib/proxyRequest';
import { NextResponse } from 'next/server';

export async function GET() {
  // Không có request param ở Next GET, nên tạo handler nhận request để forward header khi có
  const result = await proxyRequest('/api/careprofiles/getall', 'GET');
  return NextResponse.json(result.data, { status: result.status });
} 