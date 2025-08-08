import { proxyRequest } from '@/lib/proxyRequest';
import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
  const { customizeTaskId, nursingId } = await params;
  const { searchParams } = new URL(request.url);
  const bookingId = searchParams.get('bookingId');
  const allowSameBooking = searchParams.get('allowSameBooking');

  const endpoint = `/api/CustomizeTask/UpdateNursing/${customizeTaskId}/${nursingId}` +
    (bookingId || allowSameBooking ? `?${new URLSearchParams({ ...(bookingId ? { bookingId } : {}), ...(allowSameBooking ? { allowSameBooking } : {}) }).toString()}` : '');

  const result = await proxyRequest(endpoint, 'PUT');
  return NextResponse.json(result.data, { status: result.status });
}
