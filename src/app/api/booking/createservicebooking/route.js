import { proxyRequest } from '@/lib/proxyRequest';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5294';
    
    
    const response = await fetch(`${backendUrl}/api/Booking/CreateServiceBooking`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    });

    // Kiểm tra xem booking có được tạo thành công không
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend Error Response:', errorText);
      
      // Thử kiểm tra xem booking có được tạo thành công không
      try {
        const getAllResponse = await fetch(`${backendUrl}/api/Booking/GetAll`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (getAllResponse.ok) {
          const allBookings = await getAllResponse.json();
          
          // Tìm booking mới nhất với cùng careProfileID và workdate
          const matchingBooking = allBookings.find(booking => 
            booking.careProfileID === body.careProfileID && 
            booking.workdate === body.workdate &&
            booking.amount === body.amount
          );
          
          if (matchingBooking) {
            return NextResponse.json(matchingBooking, { status: 201 });
          }
        }
      } catch (checkError) {
        console.error('Error checking for created booking:', checkError);
      }
      
      // Nếu không tìm thấy booking, trả về lỗi
      try {
        const errorData = JSON.parse(errorText);
        return NextResponse.json(
          { error: errorData.message || `Tạo service booking thất bại` },
          { status: response.status }
        );
      } catch (parseError) {
        console.error('Failed to parse error response as JSON:', parseError);
        return NextResponse.json(
          { error: `Server error: ${response.status} - ${errorText.substring(0, 100)}` },
          { status: response.status }
        );
      }
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: `Không thể kết nối đến server: ${error.message}` },
      { status: 500 }
    );
  }
} 
