import React, { useState, useEffect } from 'react';
import careProfileService from '@/services/api/careProfileService';
import bookingService from '@/services/api/bookingService';
import customizeTaskService from '@/services/api/customizeTaskService';
import serviceTaskService from '@/services/api/serviceTaskService';
import customizePackageService from '@/services/api/customizePackageService';

// const NurseMedicalNoteTab = ({ medicalNotes, patients }) => {
//   const [notes, setNotes] = useState(medicalNotes);
//   const [selectedNote, setSelectedNote] = useState(null);
//   const [showAdd, setShowAdd] = useState(false);
//   const [form, setForm] = useState({
//     CareProfileID: '',
//     Note: '',
//     Advice: '',
//     Image: ''
//   });
//   const [careProfiles, setCareProfiles] = useState([]);
//   const [bookings, setBookings] = useState([]);
//   const [customizeTasks, setCustomizeTasks] = useState([]);
//   const [serviceTasks, setServiceTasks] = useState([]);
//   const [customizePackages, setCustomizePackages] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const [careProfilesData, bookingsData, customizeTasksData, serviceTasksData, customizePackagesData] = await Promise.all([
//           careProfileService.getAllCareProfiles(),
//           bookingService.getAllBookings(),
//           customizeTaskService.getAllCustomizeTasks(),
//           serviceTaskService.getAllServiceTasks(),
//           customizePackageService.getAllCustomizePackages()
//         ]);
//         setCareProfiles(careProfilesData);
//         setBookings(bookingsData);
//         setCustomizeTasks(customizeTasksData);
//         setServiceTasks(serviceTasksData);
//         setCustomizePackages(customizePackagesData);
//       } catch (err) {
//         console.error('Error fetching data:', err);
//         setError('Không thể tải dữ liệu. Vui lòng thử lại.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   // Hàm tìm booking gần nhất cho ghi chú (nếu MedicalNote không có BookingID)
//   const findBookingForNote = (note) => {
//     // Tìm booking gần nhất cho ghi chú (theo CareProfileID và thời gian)
//     return bookings
//       .filter(b => b.CareProfileID === note.CareProfileID)
//       .sort((a, b) => Math.abs(new Date(note.CreatedAt) - new Date(a.WorkDate)) - Math.abs(new Date(note.CreatedAt) - new Date(b.WorkDate)))[0];
//   };

//   // Hàm tìm dịch vụ con (ServiceTask) từ booking và CustomizeTask
//   const findServiceTaskForNote = (note, booking) => {
//     // Tìm dịch vụ con (ServiceTask) từ booking và CustomizeTask
//     if (!booking) return null;
//     const task = customizeTasks.find(t => t.BookingID === booking.BookingID && t.CareProfileID === note.CareProfileID);
//     if (!task) return null;
//     return serviceTasks.find(st => st.ServiceTaskID === task.ServiceTaskID);
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
//           <p className="text-gray-600">Đang tải dữ liệu...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="text-center">
//           <div className="text-red-500 mb-4">⚠️</div>
//           <p className="text-red-600">{error}</p>
//           <button 
//             onClick={() => window.location.reload()} 
//             className="mt-4 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
//           >
//             Thử lại
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <h3 className="font-semibold text-lg mb-4">Danh sách ghi chú y tế</h3>
//       <button
//         className="mb-4 px-4 py-2 rounded bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold"
//         onClick={() => setShowAdd(true)}
//       >
//         Thêm ghi chú
//       </button>
//       <div className="space-y-4">
//         {notes.length === 0 && (
//           <div className="text-gray-500">Không có ghi chú y tế nào.</div>
//         )}
//         {notes.map(note => {
//           const patient = careProfiles.find(p => p.CareProfileID === note.CareProfileID);
//           const booking = findBookingForNote(note);
//           const serviceTask = findServiceTaskForNote(note, booking);
//           const packageObj = booking ? customizePackages.find(pkg => pkg.CustomizePackageID === booking.CustomizePackageID) : null;
//           return (
//             <div
//               key={note.MedicalNoteID}
//               className="p-4 bg-blue-50 rounded shadow flex flex-col md:flex-row md:items-center md:justify-between gap-4 cursor-pointer"
//               onClick={() => setSelectedNote(note)}
//             >
//               <div className="flex-1">
//                 <div className="font-bold text-blue-700 mb-1">{patient?.ProfileName || 'Bệnh nhân'} - {note.CreatedAt ? new Date(note.CreatedAt).toLocaleString('vi-VN') : '-'}</div>
//                 <div className="mb-1 text-gray-700"><span className="font-semibold">Nội dung:</span> {note.Note}</div>
//                 <div className="mb-1 text-gray-700"><span className="font-semibold">Lời khuyên:</span> {note.Advice}</div>
//                 {booking && (
//                   <div className="mb-1 text-gray-600 text-sm"><span className="font-semibold">Booking:</span> #{booking.BookingID} ({booking.WorkDate ? new Date(booking.WorkDate).toLocaleString('vi-VN') : '-'})</div>
//                 )}
//                 {packageObj && (
//                   <div className="mb-1 text-gray-600 text-sm"><span className="font-semibold">Gói dịch vụ:</span> {packageObj.Name}</div>
//                 )}
//                 {serviceTask && (
//                   <div className="mb-1 text-gray-600 text-sm"><span className="font-semibold">Dịch vụ:</span> {serviceTask.Description}</div>
//                 )}
//               </div>
//               {note.Image && (
//                 <img src={note.Image} alt="note" className="w-20 h-20 object-cover rounded border" />
//               )}
//             </div>
//           );
//         })}
//       </div>
//       {/* Panel chi tiết */}
//       {selectedNote && (() => {
//         const patient = careProfiles.find(p => p.CareProfileID === selectedNote.CareProfileID);
//         const booking = findBookingForNote(selectedNote);
//         const serviceTask = findServiceTaskForNote(selectedNote, booking);
//         const packageObj = booking ? customizePackages.find(pkg => pkg.CustomizePackageID === booking.CustomizePackageID) : null;
//         return (
//           <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
//             <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative animate-fade-in">
//               <button
//                 className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
//                 onClick={() => setSelectedNote(null)}
//                 title="Đóng"
//               >✕</button>
//               <h4 className="text-xl font-bold mb-4 text-blue-700">Chi tiết ghi chú y tế</h4>
//               <div className="mb-2"><span className="font-semibold">Bệnh nhân:</span> {patient?.ProfileName}</div>
//               <div className="mb-2"><span className="font-semibold">Thời gian:</span> {selectedNote.CreatedAt ? new Date(selectedNote.CreatedAt).toLocaleString('vi-VN') : '-'}</div>
//               <div className="mb-2"><span className="font-semibold">Nội dung:</span> {selectedNote.Note}</div>
//               <div className="mb-2"><span className="font-semibold">Lời khuyên:</span> {selectedNote.Advice}</div>
//               {booking && (
//                 <div className="mb-2"><span className="font-semibold">Booking:</span> #{booking.BookingID} ({booking.WorkDate ? new Date(booking.WorkDate).toLocaleString('vi-VN') : '-'})</div>
//               )}
//               {packageObj && (
//                 <div className="mb-2"><span className="font-semibold">Gói dịch vụ:</span> {packageObj.Name}</div>
//               )}
//               {serviceTask && (
//                 <div className="mb-2"><span className="font-semibold">Dịch vụ:</span> {serviceTask.Description}</div>
//               )}
//               {selectedNote.Image && (
//                 <img src={selectedNote.Image} alt="note" className="w-32 h-32 object-cover rounded border mt-2" />
//               )}
//             </div>
//           </div>
//         );
//       })()}
//       {/* Form thêm ghi chú */}
//       {showAdd && (
//         <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
//           <form
//             className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative animate-fade-in"
//             onSubmit={e => {
//               e.preventDefault();
//               setNotes([
//                 ...notes,
//                 {
//                   MedicalNoteID: notes.length + 1,
//                   CareProfileID: form.CareProfileID,
//                   Note: form.Note,
//                   Advice: form.Advice,
//                   Image: form.Image,
//                   CreatedAt: new Date().toISOString()
//                 }
//               ]);
//               setShowAdd(false);
//               setForm({ CareProfileID: '', Note: '', Advice: '', Image: '' });
//             }}
//           >
//             <button
//               className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
//               onClick={() => setShowAdd(false)}
//               type="button"
//               title="Đóng"
//             >✕</button>
//             <h4 className="text-xl font-bold mb-4 text-purple-700">Thêm ghi chú y tế</h4>
//             <div className="mb-2">
//               <label className="font-semibold">Bệnh nhân:</label>
//               <select
//                 className="w-full border rounded px-2 py-1"
//                 value={form.CareProfileID}
//                 onChange={e => setForm(f => ({ ...f, CareProfileID: e.target.value }))}
//                 required
//               >
//                 <option value="">Chọn bệnh nhân</option>
//                 {patients.map(p => (
//                   <option key={p.CareProfileID} value={p.CareProfileID}>{p.ProfileName}</option>
//                 ))}
//               </select>
//             </div>
//             <div className="mb-2">
//               <label className="font-semibold">Nội dung:</label>
//               <textarea
//                 className="w-full border rounded px-2 py-1"
//                 value={form.Note}
//                 onChange={e => setForm(f => ({ ...f, Note: e.target.value }))}
//                 required
//               />
//             </div>
//             <div className="mb-2">
//               <label className="font-semibold">Lời khuyên:</label>
//               <textarea
//                 className="w-full border rounded px-2 py-1"
//                 value={form.Advice}
//                 onChange={e => setForm(f => ({ ...f, Advice: e.target.value }))}
//               />
//             </div>
//             <div className="mb-2">
//               <label className="font-semibold">Ảnh (URL):</label>
//               <input
//                 className="w-full border rounded px-2 py-1"
//                 value={form.Image}
//                 onChange={e => setForm(f => ({ ...f, Image: e.target.value }))}
//                 placeholder="Nhập đường dẫn ảnh hoặc để trống"
//               />
//             </div>
//             <button
//               type="submit"
//               className="mt-4 px-6 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:shadow-lg"
//             >
//               Thêm ghi chú
//             </button>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// };
const NurseMedicalNoteTab = () => {
  return (
    <div>
      <h1>Nurse Medical Note Tab</h1>
    </div>
  );
};

export default NurseMedicalNoteTab; 