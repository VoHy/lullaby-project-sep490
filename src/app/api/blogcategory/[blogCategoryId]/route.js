import { proxyRequest } from '@/lib/proxyRequest';
import { NextResponse } from 'next/server';

// Always return a proper JSON response to the client
export async function GET(request, { params }) {
  const { blogCategoryId } = await params;
  const endpoint = `/api/BlogCategory/${blogCategoryId}`;
  const result = await proxyRequest(endpoint, 'GET');
  return NextResponse.json(result.data, { status: result.status });
}

export async function PUT(request, { params }) {
  const { blogCategoryId } = await params;
  const body = await request.json();
  const endpoint = `/api/BlogCategory/${blogCategoryId}`;

  // Backend expects a JSON body; ensure we forward correctly and set the content type
  const result = await proxyRequest(endpoint, 'PUT', {
    headers: { 'Content-Type': 'application/json-patch+json' },
    body: JSON.stringify(body),
  });
  return NextResponse.json(result.data, { status: result.status });
}

export async function DELETE(request, { params }) {
  const { blogCategoryId } = await params;
  const endpoint = `/api/BlogCategory/${blogCategoryId}`;
  const result = await proxyRequest(endpoint, 'DELETE');

  // Some backends return 204 No Content; return a JSON payload to keep the frontend happy
  if (result.status === 204) {
    return NextResponse.json({ success: true }, { status: 200 });
  }
  return NextResponse.json(result.data, { status: result.status });
}