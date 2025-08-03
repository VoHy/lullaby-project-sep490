import { NextResponse } from 'next/server';

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    
    // Proxy request to backend
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5294';
    const response = await fetch(`${backendUrl}/api/servicetasks/delete/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend error:', errorText);
      return NextResponse.json(
        { error: 'Xóa dịch vụ con thất bại' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error deleting service task:', error);
    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi xóa dịch vụ con' },
      { status: 500 }
    );
  }
} 