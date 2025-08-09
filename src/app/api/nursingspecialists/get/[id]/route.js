import { proxyRequest } from '@/lib/proxyRequest';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const result = await proxyRequest(`/api/nursingspecialists/get/${id}`, 'GET');
    return NextResponse.json(result.data, { status: result.status });
  } catch (error) {
    return NextResponse.json({ error: 'Không thể lấy thông tin nursing specialist' }, { status: 500 });
  }
} 