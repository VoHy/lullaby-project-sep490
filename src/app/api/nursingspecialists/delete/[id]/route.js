import { NextResponse } from 'next/server';

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const res = await fetch(`http://localhost:5294/api/nursingspecialists/delete/${id}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    return Response.json(data, { status: res.status });
  } catch (error) {
    return Response.json({ error: 'Không thể xóa nursing specialist' }, { status: 500 });
  }
} 