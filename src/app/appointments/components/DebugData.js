'use client';

import React from 'react';

const DebugData = ({ 
  appointment, 
  customizePackages, 
  serviceTypes 
}) => {
  const bookingId = appointment?.bookingID || appointment?.BookingID;
  
  const bookingPackages = customizePackages?.filter(pkg =>
    pkg.bookingID === bookingId ||
    pkg.BookingID === bookingId ||
    pkg.booking_ID === bookingId
  ) || [];

  return (
    <div className="bg-gray-100 p-4 rounded-lg text-xs overflow-auto max-h-96">
      <h3 className="font-bold mb-4 text-red-600">🐛 DEBUG DATA</h3>
      
      <div className="mb-4">
        <h4 className="font-bold text-blue-600">Appointment BookingID:</h4>
        <pre className="bg-white p-2 rounded">{JSON.stringify(bookingId, null, 2)}</pre>
      </div>

      <div className="mb-4">
        <h4 className="font-bold text-green-600">Customize Packages (All {customizePackages?.length || 0}):</h4>
        <pre className="bg-white p-2 rounded max-h-32 overflow-auto">
          {JSON.stringify(customizePackages, null, 2)}
        </pre>
      </div>

      <div className="mb-4">
        <h4 className="font-bold text-purple-600">Filtered Booking Packages ({bookingPackages.length}):</h4>
        <pre className="bg-white p-2 rounded max-h-32 overflow-auto">
          {JSON.stringify(bookingPackages, null, 2)}
        </pre>
      </div>

      <div className="mb-4">
        <h4 className="font-bold text-orange-600">Service Types (All {serviceTypes?.length || 0}):</h4>
        <pre className="bg-white p-2 rounded max-h-32 overflow-auto">
          {JSON.stringify(serviceTypes?.map(s => ({
            id: s.serviceID || s.serviceTypeID || s.ServiceID,
            name: s.serviceName || s.ServiceName
          })), null, 2)}
        </pre>
      </div>

      <div className="mb-4">
        <h4 className="font-bold text-pink-600">Service Matching Test:</h4>
        {bookingPackages.map((pkg, index) => {
          const serviceId = pkg.serviceID || pkg.service_ID || pkg.Service_ID;
          const matchedService = serviceTypes?.find(s =>
            s.serviceID === serviceId ||
            s.serviceTypeID === serviceId ||
            s.ServiceID === serviceId
          );
          
          return (
            <div key={index} className="bg-white p-2 rounded mb-2">
              <div>Package {index + 1}: ID={pkg.customizePackageID}, ServiceID={serviceId}, Quantity={pkg.quantity}</div>
              <div className={matchedService ? 'text-green-600' : 'text-red-600'}>
                {matchedService ? `✅ Found: ${matchedService.serviceName || matchedService.ServiceName}` : `❌ No match for ServiceID: ${serviceId}`}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DebugData;
