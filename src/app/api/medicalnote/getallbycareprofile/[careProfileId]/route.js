import { proxyRequest } from '@/lib/proxyRequest';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { careProfileId } = await params;
  const endpoint = `/api/MedicalNote/GetAllByCareProfile/${careProfileId}`;
  return await proxyRequest(endpoint, 'GET');
} 