import { proxyRequest } from '@/lib/proxyRequest';
import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
  const { transactionHistoryId } = await params;
  const endpoint = `/api/TransactionHistory/SuccessAddToWallet/${transactionHistoryId}`;
  return await proxyRequest(endpoint, 'PUT');
} 