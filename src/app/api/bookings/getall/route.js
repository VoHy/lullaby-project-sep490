import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5294';
    const response = await fetch(`${backendUrl}/api/bookings`);
    const data = await response.json();
    return Response.json(data, { status: response.status });
  } catch (error) {
    return Response.json({ error: 'Không thể lấy danh sách bookings' }, { status: 500 });
  }
} 