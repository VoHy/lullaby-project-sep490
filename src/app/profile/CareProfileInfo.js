// import React, { useState } from "react";
// import { FaEdit, FaSave, FaTimes, FaUser, FaCalendar, FaPhone, FaMapMarkerAlt, FaStickyNote, FaShieldAlt, FaCamera } from "react-icons/fa";

// export default function CareProfileInfo({ careProfile, zones, onUpdate }) {
//   const [showEdit, setShowEdit] = useState(false);
//   const [form, setForm] = useState(careProfile);
//   const [avatarPreview, setAvatarPreview] = useState("");

//   React.useEffect(() => {
//     setForm(careProfile);
//   }, [careProfile]);

//   const handleAvatarChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setAvatarPreview(reader.result);
//         setForm(f => ({ ...f, Image: reader.result }));
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSave = (e) => {
//     e.preventDefault();
//     onUpdate(form);
//     setShowEdit(false);
//     setAvatarPreview("");
//   };

//   const zone = zones?.find(z => z.zone_id == careProfile.ZoneID);
  
//   return (
//     <>
//       {/* Main Profile Card */}
//       <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 relative overflow-hidden">
//         {/* Background Pattern */}
//         <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
        
//         <div className="relative z-10">
//           <div className="flex flex-col md:flex-row items-start gap-6">
//             {/* Avatar Section */}
//             <div className="flex-shrink-0">
//               <div className="relative">
//                 <img 
//                   src={careProfile.Image || "/images/avatar1.jpg"} 
//                   alt={careProfile.Care_Name} 
//                   className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg" 
//                 />
//                 <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full p-2 shadow-lg">
//                   <FaUser className="text-sm" />
//                 </div>
//               </div>
//             </div>

//             {/* Information Section */}
//             <div className="flex-1">
//               <div className="flex items-start justify-between mb-6">
//                 <div>
//                   <h2 className="text-3xl font-bold text-gray-800 mb-2">{careProfile.Care_Name}</h2>
//                   <p className="text-gray-600">Hồ sơ chăm sóc</p>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
//                     careProfile.Status === "active" 
//                       ? "bg-green-100 text-green-700" 
//                       : "bg-red-100 text-red-700"
//                   }`}>
//                     {careProfile.Status === "active" ? "Đang hoạt động" : "Ngừng hoạt động"}
//                   </span>
//                   <button 
//                     onClick={() => setShowEdit(true)} 
//                     className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
//                   >
//                     <FaEdit className="text-sm" />
//                     Chỉnh sửa
//                   </button>
//                 </div>
//               </div>

//               {/* Information Grid */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="space-y-4">
//                   <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
//                     <FaCalendar className="text-purple-500 text-lg" />
//                     <div>
//                       <p className="text-sm text-gray-600">Ngày sinh</p>
//                       <p className="font-medium">{careProfile.DateOfBirth || 'Chưa cập nhật'}</p>
//                     </div>
//                   </div>
                  
//                   <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
//                     <FaPhone className="text-purple-500 text-lg" />
//                     <div>
//                       <p className="text-sm text-gray-600">Số điện thoại</p>
//                       <p className="font-medium">{careProfile.PhoneNumber || 'Chưa cập nhật'}</p>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="space-y-4">
//                   <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
//                     <FaMapMarkerAlt className="text-purple-500 text-lg" />
//                     <div>
//                       <p className="text-sm text-gray-600">Khu vực</p>
//                       <p className="font-medium">{zone ? `${zone.zone_name} - ${zone.city}` : 'Chưa cập nhật'}</p>
//                     </div>
//                   </div>
                  
//                   <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
//                     <FaMapMarkerAlt className="text-purple-500 text-lg" />
//                     <div>
//                       <p className="text-sm text-gray-600">Địa chỉ</p>
//                       <p className="font-medium text-sm">{careProfile.Address || 'Chưa cập nhật'}</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Notes Section */}
//               {careProfile.Note && (
//                 <div className="mt-6 p-4 bg-blue-50 rounded-lg">
//                   <div className="flex items-start gap-3">
//                     <FaStickyNote className="text-blue-500 mt-1" />
//                     <div>
//                       <p className="text-sm font-medium text-blue-800 mb-1">Ghi chú</p>
//                       <p className="text-blue-700">{careProfile.Note}</p>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Edit Modal */}
//       {showEdit && (
//         <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-200">
//           <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
//             {/* Modal Header */}
//             <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-t-3xl">
//               <div className="flex items-center justify-between">
//                 <h2 className="text-2xl font-bold">Chỉnh sửa hồ sơ chăm sóc</h2>
//                 <button 
//                   onClick={() => setShowEdit(false)} 
//                   className="text-white hover:text-gray-200 text-2xl transition-colors"
//                 >
//                   <FaTimes />
//                 </button>
//               </div>
//             </div>

//             {/* Modal Body */}
//             <form onSubmit={handleSave} className="p-6">
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                 {/* Left Column */}
//                 <div className="space-y-6">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
//                       <FaUser className="mr-2 text-purple-500" />
//                       Họ và tên *
//                     </label>
//                     <input 
//                       type="text" 
//                       name="Care_Name" 
//                       value={form.Care_Name} 
//                       onChange={e => setForm(f => ({ ...f, Care_Name: e.target.value }))} 
//                       required 
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors" 
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
//                       <FaCalendar className="mr-2 text-purple-500" />
//                       Ngày sinh
//                     </label>
//                     <input 
//                       type="date" 
//                       name="DateOfBirth" 
//                       value={form.DateOfBirth} 
//                       onChange={e => setForm(f => ({ ...f, DateOfBirth: e.target.value }))} 
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors" 
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
//                       <FaPhone className="mr-2 text-purple-500" />
//                       Số điện thoại
//                     </label>
//                     <input 
//                       type="tel" 
//                       name="PhoneNumber" 
//                       value={form.PhoneNumber} 
//                       onChange={e => setForm(f => ({ ...f, PhoneNumber: e.target.value }))} 
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors" 
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
//                       <FaMapMarkerAlt className="mr-2 text-purple-500" />
//                       Địa chỉ
//                     </label>
//                     <input 
//                       type="text" 
//                       name="Address" 
//                       value={form.Address} 
//                       onChange={e => setForm(f => ({ ...f, Address: e.target.value }))} 
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors" 
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
//                       <FaMapMarkerAlt className="mr-2 text-purple-500" />
//                       Khu vực
//                     </label>
//                     <select 
//                       name="ZoneID" 
//                       value={form.ZoneID || ""} 
//                       onChange={e => setForm(f => ({ ...f, ZoneID: e.target.value }))} 
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
//                     >
//                       <option value="">Chọn khu vực</option>
//                       {zones.map(z => (
//                         <option key={z.zone_id} value={z.zone_id}>{z.zone_name} - {z.city}</option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>

//                 {/* Right Column */}
//                 <div className="space-y-6">
//                   {/* Avatar Upload */}
//                   <div className="flex flex-col items-center gap-4 p-6 bg-gray-50 rounded-lg">
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Ảnh đại diện</label>
//                     <div className="relative">
//                       <img 
//                         src={avatarPreview || form.Image || "/images/avatar1.jpg"} 
//                         alt="avatar" 
//                         className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg" 
//                       />
//                       <label className="absolute bottom-0 right-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full p-3 cursor-pointer shadow-lg hover:shadow-xl transition-all">
//                         <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
//                         <FaCamera className="text-sm" />
//                       </label>
//                     </div>
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
//                       <FaStickyNote className="mr-2 text-purple-500" />
//                       Ghi chú
//                     </label>
//                     <textarea 
//                       name="Note" 
//                       value={form.Note} 
//                       onChange={e => setForm(f => ({ ...f, Note: e.target.value }))} 
//                       rows="4"
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors resize-none" 
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
//                       <FaShieldAlt className="mr-2 text-purple-500" />
//                       Trạng thái
//                     </label>
//                     <select 
//                       name="Status" 
//                       value={form.Status} 
//                       onChange={e => setForm(f => ({ ...f, Status: e.target.value }))} 
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
//                     >
//                       <option value="active">Đang hoạt động</option>
//                       <option value="inactive">Ngừng hoạt động</option>
//                     </select>
//                   </div>
//                 </div>
//               </div>

//               {/* Modal Footer */}
//               <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
//                 <button 
//                   type="button" 
//                   onClick={() => setShowEdit(false)} 
//                   className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors flex items-center gap-2"
//                 >
//                   <FaTimes className="text-sm" />
//                   Hủy
//                 </button>
//                 <button 
//                   type="submit" 
//                   className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
//                 >
//                   <FaSave className="text-sm" />
//                   Lưu thay đổi
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </>
//   );
// } 