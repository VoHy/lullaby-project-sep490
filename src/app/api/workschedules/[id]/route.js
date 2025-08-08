import { proxyRequest } from '@/lib/proxyRequest';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { id } = await params;
  const result = await proxyRequest(`/api/workschedules/${id}`, 'GET');
  return NextResponse.json(result.data, { status: result.status });
}

export async function PUT(request, { params }) {
  const { id } = await params;
  const body = await request.json();
  const result = await proxyRequest(`/api/workschedules/${id}`, 'PUT', {
    body: JSON.stringify(body)
  });
  return NextResponse.json(result.data, { status: result.status });
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  const result = await proxyRequest(`/api/workschedules/${id}`, 'DELETE');
  return NextResponse.json(result.data, { status: result.status });
}