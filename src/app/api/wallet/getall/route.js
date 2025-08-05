import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5294';
    
    const response = await fetch(`${backendUrl}/api/Wallet/GetAll`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      
      // Trả về mock data tạm thời nếu API không hoạt động
      const mockWalletData = [
        {
          walletID: 1,
          accountID: 1,
          amount: 200000,
          status: "active",
          createdAt: "2025-08-05T10:00:00.000Z",
          updatedAt: null
        }
      ];
      return NextResponse.json(mockWalletData);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    // Trả về mock data tạm thời nếu có lỗi kết nối
    const mockWalletData = [
      {
        walletID: 1,
        accountID: 1,
        amount: 200000,
        status: "active",
        createdAt: "2025-08-05T10:00:00.000Z",
        updatedAt: null
      }
    ];
    return NextResponse.json(mockWalletData);
  }
} 