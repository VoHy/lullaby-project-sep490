import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const res = await fetch(`http://localhost:5294/api/careprofiles/update/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return Response.json(data, { status: res.status });
  } catch (error) {
    return Response.json({ error: 'Không thể cập nhật care profile' }, { status: 500 });
  }
} 