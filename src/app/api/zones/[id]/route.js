import { proxyRequest } from '@/lib/proxyRequest';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { id } = params;
  const result = await proxyRequest(`/api/zones/${id}`, 'GET');
  return NextResponse.json(result.data, { status: result.status });
}

export async function PUT(request, { params }) {
  const { id } = params;
  const body = await request.json();
  const result = await proxyRequest(`/api/zones/${id}`, 'PUT', {
    body: JSON.stringify(body)
  });
  return NextResponse.json(result.data, { status: result.status });
}

export async function DELETE(request, { params }) {
  const { id } = params;
  const result = await proxyRequest(`/api/zones/${id}`, 'DELETE');
  return NextResponse.json(result.data, { status: result.status });
}