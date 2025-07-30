import { NextResponse } from 'next/server';

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5294';
    
    const response = await fetch(`${backendUrl}/api/zones/delete/${id}`, { 
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json({ error: data.message || data.error || 'Xóa zone thất bại' }, { status: response.status });
    }
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error deleting zone:', error);
    return NextResponse.json({ error: error.message || 'Lỗi server' }, { status: 500 });
  }
} 