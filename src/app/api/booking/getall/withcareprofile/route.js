import { proxyRequest } from '@/lib/proxyRequest';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Gọi song song 2 endpoint backend
    const [bookingsRes, careProfilesRes] = await Promise.all([
      proxyRequest('/api/Booking/GetAll', 'GET'),
      proxyRequest('/api/CareProfiles/GetAll', 'GET')
    ]);

    if (!bookingsRes.ok) {
      return NextResponse.json(bookingsRes.data, { status: bookingsRes.status });
    }
    if (!careProfilesRes.ok) {
      return NextResponse.json(careProfilesRes.data, { status: careProfilesRes.status });
    }

    const bookings = Array.isArray(bookingsRes.data) ? bookingsRes.data : [];
    const careProfiles = Array.isArray(careProfilesRes.data) ? careProfilesRes.data : [];

    // Tạo map careProfile theo ID để join nhanh
    const cpMap = new Map(
      careProfiles.map(cp => [cp.careProfileID || cp.CareProfileID, cp])
    );

    const enriched = bookings.map(b => ({
      ...b,
      careProfile: cpMap.get(b.careProfileID || b.CareProfileID) || null,
    }));

    return NextResponse.json(enriched);
  } catch (error) {
    console.error('Error in /api/booking/getall/withcareprofile:', error);
    return NextResponse.json({ error: `Không thể lấy danh sách bookings: ${error.message}` }, { status: 500 });
  }
}


