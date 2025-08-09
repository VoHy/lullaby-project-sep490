import { proxyRequest } from '@/lib/proxyRequest';
import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
  const { invoiceId } = await params;
  const endpoint = `/api/Invoice/UpdateStatus/${invoiceId}`;
  return await proxyRequest(endpoint, 'PUT');
} 