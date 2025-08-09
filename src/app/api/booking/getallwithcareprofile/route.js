import { proxyRequest } from '@/lib/proxyRequest';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Thử gọi endpoint gộp từ backend nếu có
    const result = await proxyRequest('/api/Booking/GetAllWithCareProfile', 'GET');
    if (result.ok) {
      return NextResponse.json(result.data, { status: result.status });
    }

    // Fallback: tự gộp dữ liệu booking và care profile
    const [bookingsRes, careProfilesRes] = await Promise.all([
      proxyRequest('/api/Booking/GetAll', 'GET'),
      proxyRequest('/api/careprofiles/getall', 'GET')
    ]);

    if (!bookingsRes.ok) {
      return NextResponse.json(bookingsRes.data, { status: bookingsRes.status });
    }
    if (!careProfilesRes.ok) {
      return NextResponse.json(careProfilesRes.data, { status: careProfilesRes.status });
    }

    const bookings = Array.isArray(bookingsRes.data) ? bookingsRes.data : [];
    const careProfiles = Array.isArray(careProfilesRes.data) ? careProfilesRes.data : [];

    const cpMap = new Map(
      careProfiles.map(cp => [cp.careProfileID || cp.CareProfileID, cp])
    );

    const enriched = bookings.map(b => ({
      ...b,
      careProfile: cpMap.get(b.careProfileID || b.CareProfileID) || null,
    }));

    return NextResponse.json(enriched, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: `Không thể kết nối đến server: ${error.message}` },
      { status: 500 }
    );
  }
}
