import { NextResponse } from 'next/server';

export async function GET() {
  // Xử lý lấy dữ liệu ví ở đây
  return NextResponse.json({ wallets: [] });
}
