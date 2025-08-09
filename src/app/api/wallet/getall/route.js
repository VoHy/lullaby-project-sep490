import { proxyRequest } from '@/lib/proxyRequest';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const result = await proxyRequest('/api/Wallet/GetAll', 'GET');
    return NextResponse.json(result.data, { status: result.status });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch wallet data' }, { status: 500 });
  }
  
}
