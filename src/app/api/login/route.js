import { proxyRequest } from '@/lib/proxyRequest';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const raw = await request.json();
  // Chuẩn hóa field theo BE: ưu tiên emailOrPhoneNumber, fallback email/phone/username
  const normalized = {
    emailOrPhoneNumber: raw.emailOrPhoneNumber ?? raw.email ?? raw.phoneNumber ?? raw.username ?? '',
    password: raw.password ?? ''
  };

  const authorization = request.headers.get('authorization');
  const result = await proxyRequest('/api/accounts/login', 'POST', {
    headers: {
      'Content-Type': 'application/json-patch+json',
      ...(authorization ? { Authorization: authorization } : {})
    },
    body: JSON.stringify(normalized)
  });
  return NextResponse.json(result.data, { status: result.status });
} 