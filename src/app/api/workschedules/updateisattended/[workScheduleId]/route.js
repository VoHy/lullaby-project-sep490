import { proxyRequest } from '@/lib/proxyRequest';
import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
  const { workScheduleId } = await params;
  const result = await proxyRequest(`/api/WorkSchedule/UpdateIsAttended/${workScheduleId}`, 'PUT');
  return NextResponse.json(result.data, { status: result.status });
}


