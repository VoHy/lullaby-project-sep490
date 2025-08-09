import { proxyRequest } from '@/lib/proxyRequest';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { id } = await params;
  const endpoint = `/api/Booking/${id}`;
  const result = await proxyRequest(endpoint, 'GET');
  return NextResponse.json(result.data, { status: result.status });
}

export async function PUT(request, { params }) {
  const { id } = await params;
  const body = await request.json();
  const endpoint = `/api/Booking/${id}`;
  const result = await proxyRequest(endpoint, 'PUT', body);
  return NextResponse.json(result.data, { status: result.status });
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  const endpoint = `/api/Booking/${id}`;
  const result = await proxyRequest(endpoint, 'DELETE');
  return NextResponse.json(result.data, { status: result.status });
}