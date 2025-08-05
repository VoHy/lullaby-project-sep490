import React from 'react';

// const NurseNotificationsTab = ({ notifications }) => (
//   <div>
//     <h3 className="font-semibold text-lg mb-2">Thông báo</h3>
//     <ul className="space-y-2">
//       {notifications.length === 0 && <li className="text-gray-500">Không có thông báo nào.</li>}
//       {notifications.map(n => (
//         <li key={n.NotificationID} className="p-3 bg-yellow-50 rounded flex flex-col md:flex-row md:justify-between md:items-center">
//           <div>
//             <span className="font-semibold">{n.Title}</span>
//             <div className="text-xs text-gray-500">{n.Content}</div>
//           </div>
//           <span className="mt-2 md:mt-0 text-xs text-gray-400">{n.CreatedAt ? new Date(n.CreatedAt).toLocaleString('vi-VN') : '-'}</span>
//         </li>
//       ))}
//     </ul>
//   </div>
// );

const NurseNotificationsTab = () => {
  return (
    <div>
      <h1>Nurse Notifications Tab</h1>
    </div>
  );
};
export default NurseNotificationsTab; 