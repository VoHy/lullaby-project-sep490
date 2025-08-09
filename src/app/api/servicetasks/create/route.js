import { proxyRequest } from '@/lib/proxyRequest';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const raw = await request.json();
  const authorization = request.headers.get('authorization');

  // Pass through if already in expected schema
  let payload = raw;
  if (!Array.isArray(raw?.childServiceTasks)) {
    const packageId = Number(raw?.package_ServiceID ?? raw?.packageServiceID);
    const childId = Number(raw?.child_ServiceID ?? raw?.childServiceID);
    const taskOrder = Number(raw?.taskOrder ?? 1);
    const quantity = Number(raw?.quantity ?? 1);

    payload = {
      package_ServiceID: packageId,
      childServiceTasks: [
        { child_ServiceID: childId, taskOrder, quantity }
      ]
    };
  }

  if (!payload.package_ServiceID || !payload.childServiceTasks?.length) {
    return NextResponse.json({ error: 'Thiếu dữ liệu bắt buộc' }, { status: 400 });
  }

  const result = await proxyRequest('/api/servicetasks/create', 'POST', {
    headers: {
      'Content-Type': 'application/json-patch+json',
      ...(authorization ? { Authorization: authorization } : {})
    },
    body: JSON.stringify(payload)
  });
  return NextResponse.json(result.data, { status: result.status });
}
