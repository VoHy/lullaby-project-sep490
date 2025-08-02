import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    console.log('Getting account with ID:', id);

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5294';
    const response = await fetch(`${backendUrl}/api/accounts/get/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    console.log('Backend response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.log('Backend error text:', errorText);

      try {
        const errorData = JSON.parse(errorText);
        return NextResponse.json({ error: errorData.message || 'Không thể lấy thông tin account' }, { status: response.status });
      } catch (parseError) {
        console.error('Failed to parse error response as JSON:', parseError);
        return NextResponse.json({ error: `Server error: ${response.status} - ${errorText.substring(0, 100)}` }, { status: response.status });
      }
    }

    const data = await response.json();
    console.log('Backend success data:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json({ error: `Không thể kết nối đến server: ${error.message}` }, { status: 500 });
  }
} 