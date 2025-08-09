import { proxyRequest } from '@/lib/proxyRequest';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { accountId } = await params;
    const endpoint = `/api/TransactionHistory/GetAllByAccount/${accountId}`;
    const result = await proxyRequest(endpoint, 'GET');
    
    return NextResponse.json(result.data, { 
      status: result.status 
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
} 