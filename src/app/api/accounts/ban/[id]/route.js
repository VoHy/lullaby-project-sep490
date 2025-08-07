import { proxyRequest } from '@/lib/proxyRequest';
import { NextResponse } from 'next/server';

export async function POST(_request, { params }) {
  const { id } = params;

  // Lấy thông tin tài khoản hiện tại
  const getResult = await proxyRequest(`/api/accounts/get/${id}`, 'GET');
  if (!getResult.ok) {
    return NextResponse.json(getResult.data, { status: getResult.status });
  }

  const account = getResult.data;
  const newStatus = account.status === 'active' ? 'banned' : 'active';

  // Gửi yêu cầu cập nhật trạng thái mới
  const banResult = await proxyRequest(`/api/accounts/ban/${id}`, 'POST', {
    body: JSON.stringify({ status: newStatus }),
  });

  return NextResponse.json(banResult.data, { status: banResult.status });
}
