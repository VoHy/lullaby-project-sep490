// 'use client';

// import React, { useEffect, useMemo, useState } from 'react';
// import { FaTimes, FaUserMd, FaPhone, FaMapMarkerAlt, FaStar, FaCheck } from 'react-icons/fa';
// import workScheduleService from '@/services/api/workScheduleService';

// const NurseSelectionModal = ({
//   isOpen,
//   onClose,
//   service,
//   availableNurses,
//   onAssign,
//   bookingDate,
//   bookingId,
//   customizeTasks
// }) => {
//   const [selectedNurseId, setSelectedNurseId] = useState(null);
//   const [isAssigning, setIsAssigning] = useState(false);
//   const [conflictMap, setConflictMap] = useState({});

//   if (!isOpen) return null;

//   // Load lịch của các nurse và đánh dấu trùng lịch
//   useEffect(() => {
//     const loadConflicts = async () => {
//       try {
//         if (!Array.isArray(availableNurses) || availableNurses.length === 0 || !bookingDate) {
//           setConflictMap({});
//           return;
//         }

//         const bookingTime = new Date(bookingDate);

//         const results = await Promise.all(
//           availableNurses.map(async (n) => {
//             const id = n.nursingID || n.nursing_ID || n.Nursing_ID;
//             try {
//               const schedules = await workScheduleService.getAllByNursing(id);
//               const hasConflict = Array.isArray(schedules) && schedules.some((ws) => {
//                 const start = new Date(ws.workDate || ws.WorkDate);
//                 const end = new Date(ws.endTime || ws.EndTime || start);
//                 // conflict nếu bookingTime nằm trong khoảng [start, end]
//                 const overlaps = bookingTime >= start && bookingTime <= end;
//                 const sameBooking = (ws.bookingID || ws.BookingID) === bookingId;
//                 return overlaps && !sameBooking; // bỏ qua conflict nếu là cùng booking hiện tại
//               });
//               return [id, !!hasConflict];
//             } catch {
//               return [id, false];
//             }
//           })
//         );

//         const map = {};
//         results.forEach(([id, cf]) => { map[id] = cf; });
//         setConflictMap(map);
//       } catch (e) {
//         console.warn('Không thể kiểm tra conflict:', e?.message);
//         setConflictMap({});
//       }
//     };
//     loadConflicts();
//   }, [availableNurses, bookingDate, bookingId]);

//   // Nếu cùng booking và cùng taskOrder đã có nurse này, coi như conflict (không cho chọn)
//   const isBlockedByTaskOrder = (nursingId) => {
//     if (!Array.isArray(customizeTasks)) return false;
//     // lấy các task trong booking hiện tại có cùng taskOrder với dịch vụ đang chọn
//     const currentTaskOrder = service?.taskOrder;
//     if (currentTaskOrder == null) return false;
//     return customizeTasks.some(t => {
//       const tOrder = t.taskOrder || t.task_Order || t.Task_Order;
//       const tBooking = t.bookingID || t.BookingID;
//       const tNurse = t.nursingID || t.NursingID;
//       return tBooking === bookingId && tOrder === currentTaskOrder && tNurse === nursingId;
//     });
//   };

//   const handleAssign = async () => {
//     if (!selectedNurseId) return;
//     if (conflictMap[selectedNurseId]) return; // không cho gán nếu trùng lịch
    
//     setIsAssigning(true);
//     try {
//       await onAssign(selectedNurseId);
//       onClose();
//     } catch (error) {
//       console.error('Error assigning nurse:', error);
//     } finally {
//       setIsAssigning(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
//       <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
//         {/* Header */}
//         <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 relative">
//           <button
//             className="absolute top-4 right-4 text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-colors"
//             onClick={onClose}
//           >
//             <FaTimes className="text-lg" />
//           </button>
          
//           <h2 className="text-2xl font-bold mb-2">Chọn điều dưỡng</h2>
//           <p className="text-blue-100">
//             Cho dịch vụ: <span className="font-semibold">{service?.serviceName || service?.ServiceName}</span>
//           </p>
//         </div>

//         {/* Content */}
//         <div className="p-6 max-h-[60vh] overflow-y-auto">
//           {availableNurses && availableNurses.length > 0 ? (
//             <div className="space-y-4">
//               {availableNurses.map((nurse) => {
//                 const nurseId = nurse.nursingID || nurse.nursing_ID || nurse.Nursing_ID;
//                 const isSelected = selectedNurseId === nurseId;
//                 const hasConflict = !!conflictMap[nurseId];
                
//                 return (
//                   <div
//                     key={nurseId}
//                     className={`border rounded-xl p-4 transition-all ${
//                       hasConflict
//                         ? 'border-red-300 bg-red-50 opacity-70 cursor-not-allowed'
//                         : isSelected
//                           ? 'border-blue-500 bg-blue-50 cursor-pointer'
//                           : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 cursor-pointer'
//                     }`}
//                     onClick={() => { if (!hasConflict) setSelectedNurseId(nurseId); }}
//                   >
//                     <div className="flex items-start justify-between">
//                       <div className="flex items-start gap-4 flex-1">
//                         <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
//                           <FaUserMd />
//                         </div>
                        
//                         <div className="flex-1">
//                           <h3 className={`text-lg ${hasConflict ? 'font-extrabold text-red-700' : 'font-semibold text-gray-900'}`}>
//                             {nurse.fullName || nurse.full_Name || nurse.Full_Name || 'Không có tên'}
//                           </h3>
                          
//                           {nurse.phoneNumber && (
//                             <div className="flex items-center gap-2 text-gray-600 mt-1">
//                               <FaPhone className="text-sm" />
//                               <span className="text-sm">{nurse.phoneNumber}</span>
//                             </div>
//                           )}
                          
//                           {nurse.address && (
//                             <div className="flex items-center gap-2 text-gray-600 mt-1">
//                               <FaMapMarkerAlt className="text-sm" />
//                               <span className="text-sm">{nurse.address}</span>
//                             </div>
//                           )}

//                           <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
//                             <span>ID: {nurseId}</span>
//                             {nurse.experience && (
//                               <span>Kinh nghiệm: {nurse.experience}</span>
//                             )}
//                             {nurse.rating && (
//                               <div className="flex items-center gap-1">
//                                 <FaStar className="text-yellow-400" />
//                                 <span>{nurse.rating}/5</span>
//                               </div>
//                             )}
//                             {hasConflict && (
//                               <span className="ml-2 px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-semibold">Trùng lịch</span>
//                             )}
//                           </div>
//                         </div>
//                       </div>
                      
//                       {isSelected && (
//                         <div className="ml-4">
//                           <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
//                             <FaCheck className="text-white text-xs" />
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           ) : (
//             <div className="text-center py-12">
//               <FaUserMd className="mx-auto text-6xl text-gray-300 mb-4" />
//               <h3 className="text-lg font-semibold text-gray-700 mb-2">
//                 Không có điều dưỡng khả dụng
//               </h3>
//               <p className="text-gray-500">
//                 Hiện tại không có điều dưỡng nào trong khu vực này
//               </p>
//             </div>
//           )}
//         </div>

//         {/* Footer */}
//         {availableNurses && availableNurses.length > 0 && (
//           <div className="border-t p-6 flex justify-end gap-3">
//             <button
//               onClick={onClose}
//               className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
//             >
//               Hủy
//             </button>
//             <button
//               onClick={handleAssign}
//               disabled={!selectedNurseId || isAssigning || !!conflictMap[selectedNurseId]}
//               className={`px-6 py-2 rounded-lg text-white font-medium transition-colors ${
//                 !selectedNurseId || isAssigning || !!conflictMap[selectedNurseId]
//                   ? 'bg-gray-400 cursor-not-allowed'
//                   : 'bg-blue-500 hover:bg-blue-600'
//               }`}
//             >
//               {isAssigning ? 'Đang phân công...' : 'Phân công điều dưỡng'}
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default NurseSelectionModal;
