import { proxyRequest } from '@/lib/proxyRequest';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const result = await proxyRequest('/api/Booking/GetAll', 'GET');

    const bookings = Array.isArray(result.data) ? result.data : [];
    const careProfiles = Array.isArray(result.data) ? result.data : [];

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


