"use client";
import { useParams, useRouter } from "next/navigation";
import { useState } from 'react';
import NursingSpecialistSelect from '../../../components/NursingSpecialistSelect';


export default function PackageDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  // Tìm package theo id
  const pkg = packageTypes.flatMap(pt => pt.packages).find(p => p.id === Number(id));
  const [selectedServices, setSelectedServices] = useState([]);
  // const [selectedNurse, setSelectedNurse] = useState(''); // Xoá dòng này
  const [selectedNurses, setSelectedNurses] = useState([]); // Thêm state mới

  // Giả lập zoneId, thực tế lấy từ user/package
  const zoneId = 1;

  if (!pkg) return <div className="p-8 text-center text-red-500 font-bold">Không tìm thấy gói dịch vụ!</div>;

  const handleToggleService = (serviceId) => {
    setSelectedServices(prev =>
      prev.includes(serviceId) ? prev.filter(id => id !== serviceId) : [...prev, serviceId]
    );
  };

  const total = pkg.services.filter(s => selectedServices.includes(s.id)).reduce((sum, s) => sum + s.price, 0);

  const handleBooking = () => {
    // Gửi thông tin booking: selectedServices, selectedNurses (nếu có)
    alert(`Đã booking ${selectedServices.length} dịch vụ${selectedNurses.length > 0 ? ' với y tá: ' + selectedNurses.join(', ') : ''}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-xl mx-auto px-4 bg-white rounded-xl shadow p-8">
        <button className="mb-4 text-pink-600 hover:underline" onClick={() => router.back()}>&larr; Quay lại</button>
        <h1 className="text-2xl font-bold text-blue-700 mb-2">{pkg.name}</h1>
        <p className="mb-4 text-gray-600">{pkg.description}</p>
        <div className="mb-6">
          {pkg.services.map(service => (
            <div key={service.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
              <div>
                <div className="font-semibold text-blue-700">{service.name}</div>
                <div className="text-gray-500 text-sm">{service.detail}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-pink-600 font-bold">{service.price.toLocaleString()}đ</span>
                <input
                  type="checkbox"
                  checked={selectedServices.includes(service.id)}
                  onChange={() => handleToggleService(service.id)}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Chọn y tá (không bắt buộc):</label>
          {/* Tích hợp component chọn y tá mới */}
          <NursingSpecialistSelect zoneId={zoneId} onSelectNurses={setSelectedNurses} />
        </div>
        <div className="text-right font-semibold mb-2">
          Tổng tiền: <span className="text-pink-600">{total.toLocaleString()}đ</span>
        </div>
        <div className="flex justify-end gap-2">
          <button className="px-4 py-2 rounded bg-gray-200" onClick={() => router.back()}>Quay lại</button>
          <button
            className="px-6 py-2 bg-pink-600 text-white rounded font-semibold"
            disabled={selectedServices.length === 0}
            onClick={handleBooking}
          >
            Booking
          </button>
        </div>
      </div>
    </div>
  );
} 