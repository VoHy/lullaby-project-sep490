import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const res = await fetch(`http://localhost:5294/api/zonedetails/get/${id}`);
    const data = await res.json();
    return Response.json(data, { status: res.status });
  } catch (error) {
    return Response.json({ error: 'Không thể lấy thông tin zone detail' }, { status: 500 });
  }
} 