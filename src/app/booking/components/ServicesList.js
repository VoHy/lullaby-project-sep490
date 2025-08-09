import { HiOutlineUserGroup, HiOutlineCalendar, HiOutlineCurrencyDollar } from "react-icons/hi2";

export default function ServicesList({ 
  selectedServicesList, 
  packageId, 
  isDatetimeValid, 
  total 
}) {
  return (
    <section className="border rounded-2xl p-4 md:p-6 bg-blue-50/60 shadow-sm">
             <h2 className="text-lg md:text-xl font-bold mb-3 text-blue-700 flex items-center gap-2">
         <HiOutlineUserGroup className="text-xl md:text-2xl" />
         {packageId ? "Thông tin gói và dịch vụ" : "Dịch vụ đã chọn"}
       </h2>
      <ul className="space-y-3 md:space-y-4">
        {selectedServicesList.length === 0 ? (
          <li className="bg-white rounded-xl shadow p-3 md:p-4 border flex flex-col gap-1">
            <div className="text-center text-gray-500 py-4">
              {packageId ? "Gói dịch vụ này chưa có dịch vụ con được cấu hình. Vui lòng liên hệ admin để thêm dịch vụ." : "Không có dịch vụ nào được chọn hoặc đang tải..."}
            </div>
          </li>
        ) : (
                     selectedServicesList.map((s) => (
             <li key={s.serviceID} className={`bg-white rounded-xl shadow p-3 md:p-4 border flex flex-col gap-1 ${s.isPackage ? 'border-purple-300 bg-purple-50' : s.isServiceTask ? 'border-blue-200 bg-blue-50' : ''}`}>
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-2">
                   <span className={`font-bold text-base md:text-lg ${s.isPackage ? 'text-purple-700' : s.isServiceTask ? 'text-blue-700' : 'text-blue-700'}`}>
                     {s.isPackage ? '📦 ' : s.isServiceTask ? '🔹 ' : ''}{s.serviceName || s.ServiceName || s.taskName || s.TaskName || 'Dịch vụ con'}
                   </span>
                   {/* Hiển thị số lượng nếu có */}
                   {s.quantity && s.quantity > 1 && (
                     <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-medium">
                       x{s.quantity}
                     </span>
                   )}
                 </div>
                 <div className="flex items-center gap-2">
                   {!packageId && !s.isPackage && !s.isServiceTask && (
                     <span className="text-pink-600 font-bold text-sm md:text-base">
                       {(s.price || s.Price)?.toLocaleString("vi-VN") ?? ""}
                       {(s.price || s.Price) !== undefined ? " VNĐ" : ""}
                       {s.quantity && s.quantity > 1 && (
                         <span className="text-xs text-gray-500 ml-1">({((s.price || s.Price) * s.quantity)?.toLocaleString("vi-VN")} VNĐ)</span>
                       )}
                     </span>
                   )}
                   {s.isPackage && (
                     <span className="text-purple-600 font-bold text-sm md:text-base">
                       {(s.price || s.Price)?.toLocaleString("vi-VN") ?? ""}
                       {(s.price || s.Price) !== undefined ? " VNĐ" : ""}
                     </span>
                   )}
                   {s.isServiceTask && (
                     <span className="text-blue-600 font-bold text-sm md:text-base">
                       {(s.price || s.Price)?.toLocaleString("vi-VN") ?? ""}
                       {(s.price || s.Price) !== undefined ? " VNĐ" : ""}
                     </span>
                   )}
                 </div>
               </div>
               <div className="text-gray-500 text-xs md:text-sm">{s.description || s.Description || s.taskDescription || s.TaskDescription}</div>
               <div className="text-gray-500 text-xs md:text-sm flex items-center gap-1">
                 <HiOutlineCalendar /> Thời gian: {s.duration || s.Duration || s.taskDuration || s.TaskDuration || 'N/A'} phút
               </div>
          </li>
        ))
        )}
      </ul>
      <div className="flex justify-end mt-4 md:mt-6 items-center gap-2">
        <span className="text-base md:text-lg font-semibold">Tổng tiền:</span>
        <span className="text-xl md:text-2xl text-pink-600 font-extrabold flex items-center gap-1">
          <HiOutlineCurrencyDollar />
          {total > 0 ? total.toLocaleString("vi-VN") + " VNĐ" : "0 VNĐ"}
        </span>
      </div>
    </section>
  );
} 