import { Suspense } from 'react';
import DashboardClient from './DashboardClient';

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          <div className="w-64 bg-white shadow-lg min-h-screen" />
          <div className="flex-1 p-8">
            <div className="h-8 bg-gray-200 rounded mb-6 animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[1,2,3,4].map(i => <div key={i} className="bg-white p-6 rounded-lg shadow h-20 animate-pulse" />)}
            </div>
          </div>
        </div>
      </div>
    }>
      <DashboardClient />
    </Suspense>
  );
}