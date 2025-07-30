import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5294';
    const response = await fetch(`${backendUrl}/api/nursingspecialists/get/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Lỗi server' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5294';
    const body = await request.json();
    const response = await fetch(`${backendUrl}/api/nursingspecialists/update/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Lỗi server' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5294';
    const response = await fetch(`${backendUrl}/api/nursingspecialists/delete/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Lỗi server' }, { status: 500 });
  }
} 