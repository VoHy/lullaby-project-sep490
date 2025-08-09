import { proxyRequest } from '@/lib/proxyRequest';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const id = params?.id;
  const authorization = request.headers.get('authorization');
  const result = await proxyRequest(`/api/zones/${id}`, 'GET', {
    headers: {
      ...(authorization ? { Authorization: authorization } : {})
    }
  });
  return NextResponse.json(result.data, { status: result.status });
}

export async function PUT(request, { params }) {
  const id = params?.id;
  const body = await request.json();
  const authorization = request.headers.get('authorization');
  const result = await proxyRequest(`/api/zones/${id}`, 'PUT', {
    headers: {
      ...(authorization ? { Authorization: authorization } : {})
    },
    body: JSON.stringify(body)
  });
  return NextResponse.json(result.data, { status: result.status });
}

export async function DELETE(request, { params }) {
  const id = params?.id;
  const authorization = request.headers.get('authorization');
  const result = await proxyRequest(`/api/zones/${id}`, 'DELETE', {
    headers: {
      ...(authorization ? { Authorization: authorization } : {})
    }
  });
  return NextResponse.json(result.data, { status: result.status });
}