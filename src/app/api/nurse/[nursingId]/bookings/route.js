import { NextResponse } from 'next/server';
import { proxyRequest } from '@/lib/proxyRequest';

// Aggregator: trả danh sách booking của nurse (kèm care profile cơ bản)
// Backend calls: 3
// - GET /api/WorkSchedule/GetAllByNursing/{nursingId}
// - GET /api/Booking/GetAll
// - GET /api/CareProfiles/GetAll

export async function GET(request, { params }) {
  try {
    const { nursingId } = params;

    const [wsRes, bookingsRes, cpsRes] = await Promise.all([
      proxyRequest(`/api/WorkSchedule/GetAllByNursing/${nursingId}`, 'GET'),
      proxyRequest('/api/Booking/GetAll', 'GET'),
      proxyRequest('/api/CareProfiles/GetAll', 'GET')
    ]);

    if (!wsRes.ok) return NextResponse.json(wsRes.data, { status: wsRes.status });
    if (!bookingsRes.ok) return NextResponse.json(bookingsRes.data, { status: bookingsRes.status });
    if (!cpsRes.ok) return NextResponse.json(cpsRes.data, { status: cpsRes.status });

    const workSchedules = Array.isArray(wsRes.data) ? wsRes.data : [];
    const bookings = Array.isArray(bookingsRes.data) ? bookingsRes.data : [];
    const careProfiles = Array.isArray(cpsRes.data) ? cpsRes.data : [];

    const bookingIdSet = new Set(
      workSchedules.map(w => w.bookingID || w.BookingID).filter(Boolean)
    );

    const careMap = new Map(
      careProfiles.map(cp => [cp.careProfileID || cp.CareProfileID, cp])
    );

    const mine = bookings
      .filter(b => bookingIdSet.has(b.bookingID || b.BookingID))
      .map(b => ({
        ...b,
        careProfile: careMap.get(b.careProfileID || b.CareProfileID) || null
      }));

    return NextResponse.json(mine, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 });
  }
}


