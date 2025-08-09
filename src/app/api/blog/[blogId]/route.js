import { proxyRequest } from '@/lib/proxyRequest';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { blogId } = await params;
  const result = await proxyRequest(`/api/Blog/${blogId}`, 'GET');
  return NextResponse.json(result.data, { status: result.status });
}

export async function DELETE(request, { params }) {
  const { blogId } = await params;
  const result = await proxyRequest(`/api/Blog/${blogId}`, 'DELETE');
  return NextResponse.json(result.data, { status: result.status });
} 