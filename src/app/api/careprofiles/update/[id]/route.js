import { proxyRequest } from '@/lib/proxyRequest';
import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    
    // Convert field names to match backend expectation
    const backendData = {
      zoneDetailID: body.zoneDetailID,
      profileName: body.profileName,
      dateOfBirth: body.dateOfBirth,
      phoneNumber: body.phoneNumber,
      address: body.address,
      image: body.image,
      note: body.note,
      status: body.status?.toLowerCase() || 'active' // Convert to lowercase
    };
    
    const endpoint = `/api/careprofiles/update/${id}`;
    const result = await proxyRequest(endpoint, 'PUT', { body: JSON.stringify(backendData) });
    
    return NextResponse.json(result.data, { 
      status: result.status 
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
} 