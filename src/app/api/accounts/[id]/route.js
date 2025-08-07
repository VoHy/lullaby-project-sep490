import { NextResponse } from 'next/server';
import { proxyRequest } from '@/lib/proxyRequest';

export async function GET(_request, { params }) {
  const { id } = params;
  const { ok, status, data } = await proxyRequest(`/api/accounts/${id}`, 'GET');

  const res = NextResponse.json(data, { status });

  // Cache header cho GET (SWR benefit)
  if (ok) {
    res.headers.set('Cache-Control', 's-maxage=30, stale-while-revalidate');
  }

  return res;
}

export async function PUT(request, { params }) {
  const { id } = params;
  const body = await request.json();

  const { status, data } = await proxyRequest(`/api/accounts/${id}`, 'PUT', {
    body: JSON.stringify(body),
  });

  return NextResponse.json(data, { status });
}

export async function DELETE(_request, { params }) {
  const { id } = params;
  const { status, data } = await proxyRequest(`/api/accounts/delete/${id}`, 'DELETE');

  return NextResponse.json(data, { status });
}
