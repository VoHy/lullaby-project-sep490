import { proxyRequest } from '@/lib/proxyRequest';
import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5294';
    
    const response = await fetch(`${backendUrl}/api/servicetypes/softdelete/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    });


    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend error response:', errorText);
      
      try {
        const errorData = JSON.parse(errorText);
        
        // Nếu dịch vụ đã được đánh dấu removed, trả về success
        if (errorData.error && errorData.error.includes('already marked as removed')) {
          return NextResponse.json({ 
            message: 'Service type already deleted',
            alreadyDeleted: true 
          });
        }
        
        return NextResponse.json(
          { error: errorData.error || 'Soft delete service type thất bại' },
          { status: response.status }
        );
      } catch (parseError) {
        console.error('Failed to parse error response as JSON:', parseError);
        return NextResponse.json(
          { error: `Server error: ${response.status} - ${errorText.substring(0, 100)}` },
          { status: response.status }
        );
      }
    }

    // Kiểm tra xem response có content không
    const responseText = await response.text();
    
    if (!responseText) {
      return NextResponse.json({ message: 'Service type deleted successfully' });
    }

    try {
      const data = JSON.parse(responseText);
      return NextResponse.json(data);
    } catch (parseError) {
      console.error('Failed to parse success response as JSON:', parseError);
      return NextResponse.json({ message: 'Service type deleted successfully' });
    }
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: `Không thể kết nối đến server: ${error.message}` },
      { status: 500 }
    );
  }
} 