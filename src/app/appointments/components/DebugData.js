'use client';

import React from 'react';

const DebugData = ({ 
  appointment, 
  customizePackages, 
  customizeTasks,
  serviceTypes 
}) => {
  const bookingId = appointment?.bookingID || appointment?.BookingID;
  
  const bookingPackages = customizePackages?.filter(pkg =>
    pkg.bookingID === bookingId ||
    pkg.BookingID === bookingId ||
    pkg.booking_ID === bookingId
  ) || [];

  const bookingCustomizeTasks = customizeTasks?.filter(task =>
    task.bookingID === bookingId ||
    task.BookingID === bookingId ||
    task.booking_ID === bookingId
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
        <h4 className="font-bold text-orange-600">Customize Tasks (All {customizeTasks?.length || 0}):</h4>
        <pre className="bg-white p-2 rounded max-h-32 overflow-auto">
          {JSON.stringify(customizeTasks, null, 2)}
        </pre>
      </div>

      <div className="mb-4">
        <h4 className="font-bold text-purple-600">Matched Customize Tasks for BookingID {bookingId}: ({bookingCustomizeTasks.length})</h4>
        <pre className="bg-white p-2 rounded max-h-32 overflow-auto">
          {JSON.stringify(bookingCustomizeTasks, null, 2)}
        </pre>
      </div>

      <div className="mb-4">
        <h4 className="font-bold text-indigo-600">Matched Customize Packages for BookingID {bookingId}: ({bookingPackages.length})</h4>
        <pre className="bg-white p-2 rounded max-h-32 overflow-auto">
          {JSON.stringify(bookingPackages, null, 2)}
        </pre>
      </div>

      <div className="mb-4">
        <h4 className="font-bold text-gray-600">Service Types Sample:</h4>
        <pre className="bg-white p-2 rounded max-h-32 overflow-auto">
          {JSON.stringify(serviceTypes?.slice(0, 3), null, 2)}
        </pre>
      </div>

      <div className="mb-4">
        <h4 className="font-bold text-pink-600">Service Matching Test:</h4>
        {bookingCustomizeTasks.map((task, index) => {
          const serviceId = task.serviceID || task.service_ID || task.Service_ID;
          const matchedService = serviceTypes?.find(s =>
            s.serviceID === serviceId ||
            s.serviceTypeID === serviceId ||
            s.ServiceID === serviceId
          );
          
          return (
            <div key={index} className="bg-white p-2 rounded mb-2">
              <div>Task {index + 1}: TaskID={task.customizeTaskID}, ServiceID={serviceId}, Status={task.status}</div>
              <div className={matchedService ? 'text-green-600' : 'text-red-600'}>
                {matchedService ? `✅ Found: ${matchedService.serviceName || matchedService.ServiceName}` : `❌ No match for ServiceID: ${serviceId}`}
              </div>
              <div className="text-xs text-gray-600">
                NursingID: {task.nursingID || 'None'} | BookingID: {task.bookingID}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DebugData;
