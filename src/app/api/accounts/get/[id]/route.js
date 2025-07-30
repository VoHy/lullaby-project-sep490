import { NextResponse } from 'next/server';

// Lưu trữ dữ liệu tạm thời cho mock
let mockManagerData = {
  1: {
    id: 1,
    accountID: 1,
    fullName: 'Koh',
    email: 'koh@example.com',
    phoneNumber: '0393252054',
    role_id: 3,
    status: 'active',
    zoneID: 1,
    zoneName: 'Quận 2',
    created_at: '2025-07-29T10:38:09.000Z',
    updated_at: null
  }
};

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const res = await fetch(`http://localhost:5294/api/accounts/get/${id}`);
    const data = await res.json();
    return Response.json(data, { status: res.status });
  } catch (error) {
    return Response.json({ error: 'Không thể lấy thông tin tài khoản' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const res = await fetch(`http://localhost:5294/api/accounts/update/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return Response.json(data, { status: res.status });
  } catch (error) {
    return Response.json({ error: 'Không thể cập nhật tài khoản' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const res = await fetch(`http://localhost:5294/api/accounts/delete/${id}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    return Response.json(data, { status: res.status });
  } catch (error) {
    return Response.json({ error: 'Không thể xóa tài khoản' }, { status: 500 });
  }
} 