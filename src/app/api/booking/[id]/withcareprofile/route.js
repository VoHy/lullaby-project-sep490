import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5294';
    
    // Fetch booking và careProfiles song song
    const [bookingResponse, careProfilesResponse] = await Promise.all([
      fetch(`${backendUrl}/api/Booking/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }),
      fetch(`${backendUrl}/api/CareProfiles/GetAll`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
    ]);

    if (!bookingResponse.ok) {
      const errorText = await bookingResponse.text();
      try {
        const errorData = JSON.parse(errorText);
        return NextResponse.json({ error: errorData.message || 'Không thể lấy thông tin booking' }, { status: bookingResponse.status });
      } catch (parseError) {
        console.error('Failed to parse error response as JSON:', parseError);
        return NextResponse.json({ error: `Server error: ${bookingResponse.status} - ${errorText.substring(0, 100)}` }, { status: bookingResponse.status });
      }
    }

    if (!careProfilesResponse.ok) {
      const errorText = await careProfilesResponse.text();
      try {
        const errorData = JSON.parse(errorText);
        return NextResponse.json({ error: errorData.message || 'Không thể lấy danh sách care profiles' }, { status: careProfilesResponse.status });
      } catch (parseError) {
        console.error('Failed to parse error response as JSON:', parseError);
        return NextResponse.json({ error: `Server error: ${careProfilesResponse.status} - ${errorText.substring(0, 100)}` }, { status: careProfilesResponse.status });
      }
    }

    const [bookingData, careProfilesData] = await Promise.all([
      bookingResponse.json(),
      careProfilesResponse.json()
    ]);

    // Tìm careProfile tương ứng
    const careProfile = careProfilesData.find(cp => cp.careProfileID === bookingData.careProfileID);

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