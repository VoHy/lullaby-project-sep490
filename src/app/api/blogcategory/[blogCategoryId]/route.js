import { proxyRequest } from '@/lib/proxyRequest';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { blogCategoryId } = await params;
  const endpoint = `/api/BlogCategory/${blogCategoryId}`;
  return await proxyRequest(endpoint, 'GET');
}

export async function PUT(request, { params }) {
  const { blogCategoryId } = await params;
  const body = await request.json();
  const endpoint = `/api/BlogCategory/${blogCategoryId}`;
  return await proxyRequest(endpoint, 'PUT', body);
}

export async function DELETE(request, { params }) {
  const { blogCategoryId } = await params;
  const endpoint = `/api/BlogCategory/${blogCategoryId}`;
  return await proxyRequest(endpoint, 'DELETE');
} 