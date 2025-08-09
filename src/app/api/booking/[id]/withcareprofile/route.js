import { proxyRequest } from '@/lib/proxyRequest';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    // Fetch booking và careProfiles song song sử dụng proxyRequest
    const [bookingResponse, careProfilesResponse] = await Promise.all([
      proxyRequest(`/api/Booking/${id}`, 'GET'),
      proxyRequest(`/api/careprofiles/getall`, 'GET')
    ]);

    // Kiểm tra lỗi từ proxyRequest
    if (!bookingResponse.ok) {
      return NextResponse.json(bookingResponse.data, { status: bookingResponse.status });
    }

    if (!careProfilesResponse.ok) {
      return NextResponse.json(careProfilesResponse.data, { status: careProfilesResponse.status });
    }

    const bookingData = bookingResponse.data;
    const careProfilesData = careProfilesResponse.data;

    // Tìm careProfile tương ứng
    const careProfile = (careProfilesData || []).find(cp => (cp.careProfileID || cp.CareProfileID) === (bookingData.careProfileID || bookingData.CareProfileID));

    // Join booking với careProfile data
    const enrichedBooking = {
      ...bookingData,
      careProfile: careProfile || null
    };

    return NextResponse.json(enrichedBooking);
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json({ error: `Không thể kết nối đến server: ${error.message}` }, { status: 500 });
  }
} 