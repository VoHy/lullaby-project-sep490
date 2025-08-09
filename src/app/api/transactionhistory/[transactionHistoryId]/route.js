import { proxyRequest } from '@/lib/proxyRequest';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { transactionHistoryId } = await params;
  const endpoint = `/api/TransactionHistory/${transactionHistoryId}`;
  return await proxyRequest(endpoint, 'GET');
}

export async function DELETE(request, { params }) {
  const { transactionHistoryId } = await params;
  const endpoint = `/api/TransactionHistory/${transactionHistoryId}`;
  return await proxyRequest(endpoint, 'DELETE');
} 