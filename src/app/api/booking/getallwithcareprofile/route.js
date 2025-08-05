import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5294';
    
    // Fetch bookings và careProfiles song song
    const [bookingsResponse, careProfilesResponse] = await Promise.all([
      fetch(`${backendUrl}/api/Booking/GetAll`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }),
      fetch(`${backendUrl}/api/CareProfiles/GetAll`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
    ]);

    if (!bookingsResponse.ok) {
      const errorText = await bookingsResponse.text();
      try {
        const errorData = JSON.parse(errorText);
        return NextResponse.json({ error: errorData.message || 'Không thể lấy danh sách bookings' }, { status: bookingsResponse.status });
      } catch (parseError) {
        console.error('Failed to parse error response as JSON:', parseError);
        return NextResponse.json({ error: `Server error: ${bookingsResponse.status} - ${errorText.substring(0, 100)}` }, { status: bookingsResponse.status });
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

    const [bookingsData, careProfilesData] = await Promise.all([
      bookingsResponse.json(),
      careProfilesResponse.json()
    ]);

    // Tạo map để lookup careProfile nhanh hơn
    const careProfilesMap = new Map();
    careProfilesData.forEach(careProfile => {
      careProfilesMap.set(careProfile.careProfileID, careProfile);
    });

    // Join bookings với careProfile data
    const enrichedBookings = bookingsData.map(booking => {
      const careProfile = careProfilesMap.get(booking.careProfileID);
      return {
        ...booking,
        careProfile: careProfile || null
      };
    });

    return NextResponse.json(enrichedBookings);
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json({ error: `Không thể kết nối đến server: ${error.message}` }, { status: 500 });
  }
} 