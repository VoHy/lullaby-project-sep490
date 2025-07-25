"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import serviceTypes from '@/mock/ServiceType';
import serviceTasks from '@/mock/ServiceTask';
import workSchedules from "@/mock/WorkSchedule";
import nursingSpecialists from '@/mock/NursingSpecialist';
import careProfiles from '@/mock/CareProfile';

export default function BookingPage() {
  const [datetime, setDatetime] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const serviceId = searchParams.get('service');
  const packageId = searchParams.get('package');

  // Lấy thông tin dịch vụ lẻ hoặc package
  let detail = null;
  let childServices = [];

  if (packageId) {
    detail = serviceTypes.find(s => s.ServiceID === Number(packageId));
    const tasks = serviceTasks.filter(t => t.Package_ServiceID === Number(packageId));
    childServices = tasks.map(t => serviceTypes.find(s => s.ServiceID === t.Child_ServiceID)).filter(Boolean);
  } else if (serviceId) {
    // Có thể là 1 dịch vụ hoặc nhiều dịch vụ lẻ (danh sách id)
    if (serviceId.includes(',')) {
      childServices = serviceId.split(',').map(id => serviceTypes.find(st => st.ServiceID === Number(id))).filter(Boolean);
    } else {
      detail = serviceTypes.find(s => s.ServiceID === Number(serviceId));
    }
  }

  // Form state
  const [note, setNote] = useState("");
  const [selectedNurses, setSelectedNurses] = useState([]);
  const [error, setError] = useState("");

  // Kiểm tra ngày giờ hợp lệ cho dịch vụ lẻ (cách hiện tại ít nhất 30 phút)
  const isDatetimeValid = useMemo(() => {
    if (!datetime) return false;
    const selected = new Date(datetime);
    const now = new Date();
    return selected.getTime() - now.getTime() >= 30 * 60 * 1000;
  }, [datetime]);

  // Lấy ZoneID của user (giả sử lấy từ careProfiles, AccountID=1)
  const userProfile = careProfiles[0]; // TODO: lấy đúng user đang login
  const userZoneID = userProfile?.ZoneDetailID || 1;

  // State chọn nhân sự cho từng dịch vụ
  const [selectedStaff, setSelectedStaff] = useState({}); // {serviceId: {type: 'nurse'|'specialist', id: id}}
  const [staffPopup, setStaffPopup] = useState({ open: false, serviceId: null });

  // Lấy danh sách dịch vụ đã chọn
  // selectedServicesList: luôn là mảng các dịch vụ lẻ (nếu là package thì là childServices, nếu là dịch vụ lẻ thì là [detail], nếu là nhiều dịch vụ lẻ thì là childServices)
  let selectedServicesList = [];
  if (packageId && detail) {
    selectedServicesList = childServices;
  } else if (serviceId && serviceId.includes(',')) {
    selectedServicesList = childServices;
  } else if (serviceId && detail) {
    selectedServicesList = [detail];
  }

  // Tính tổng tiền
  let total = 0;
  if (packageId && detail) {
    // Tổng tiền là giá của gói, không phải cộng các dịch vụ con
    total = detail.Price || 0;
  } else if (!packageId && selectedServicesList.length > 0) {
    total = selectedServicesList.reduce((sum, s) => sum + (s.Price || 0), 0);
  }

  // Lọc nhân sự rảnh theo ZoneID và workSchedules (có ca trực, status active, đúng ngày user chọn)
  const getAvailableStaff = (serviceId) => {
    if (!isDatetimeValid) return [];
    const targetDate = datetime.split('T')[0];
    // Lấy danh sách nhân sự cùng ZoneID, active
    const available = nursingSpecialists.filter(n => n.ZoneID === userZoneID && n.Status === 'active');
    // Lọc theo lịch rảnh (workSchedules)
    return available.filter(n =>
      workSchedules.some(ws =>
        ws.NursingID === n.NursingID &&
        ws.WorkDate.startsWith(targetDate) &&
        ws.Status === 'active'
      )
    );
  };

  const handleSelectStaff = (serviceId, type, id) => {
    setSelectedStaff(prev => ({
      ...prev,
      [serviceId]: { type, id }
    }));
    setStaffPopup({ open: false, serviceId: null });
  };

  // Chọn/bỏ chọn nurse
  const handleToggleNurse = (id) => {
    setSelectedNurses(prev =>
      prev.includes(id) ? prev.filter(nid => nid !== id) : [...prev, id]
    );
  };

  // Xử lý thanh toán
  const handlePayment = () => {
    setError("");

    // Kiểm tra cho dịch vụ lẻ hoặc nhiều dịch vụ lẻ
    if (!packageId) {
      if (!datetime || !isDatetimeValid) {
        setError("Vui lòng chọn ngày giờ hợp lệ (cách hiện tại ít nhất 30 phút)");
        return;
      }
    }

    // Truyền thông tin booking sang trang payment
    const params = new URLSearchParams();
    if (packageId) {
      params.set("package", packageId);
      // params.set("nurses", selectedNurses.join(","));
    } else if (serviceId) {
      params.set("service", serviceId);
      params.set("datetime", datetime);
    }
    params.set("note", note);
    router.push(`/payment?${params.toString()}`);
  };

  // Hiển thị thông tin package nếu có
  const renderPackageInfo = () => {
    if (!packageId || !detail) return null;
    return (
      <div className="mb-6 border rounded-lg p-4 bg-white shadow">
        <h3 className="text-lg font-bold text-pink-700 mb-2">Thông tin gói dịch vụ</h3>
        <div className="mb-1"><span className="font-semibold">Tên gói:</span> {detail.ServiceName}</div>
        <div className="mb-1"><span className="font-semibold">Mô tả:</span> {detail.Description}</div>
        <div className="mb-1"><span className="font-semibold">Thời gian:</span> {detail.Duration}</div>
        <div className="mb-1"><span className="font-semibold">Giá gói:</span> <span className="text-pink-600 font-bold">{(detail.Price || 0).toLocaleString('vi-VN')}đ</span></div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-3xl mx-auto px-4 bg-white rounded-xl shadow p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2">
          <button
            className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 font-semibold shadow"
            onClick={() => router.back()}
          >
            ← Quay lại
          </button>
          <h1 className="text-3xl font-bold text-pink-600 text-center flex-1">Xác nhận đặt dịch vụ</h1>
        </div>
        {/* Thông tin gói dịch vụ nếu có */}
        {renderPackageInfo()}
        {/* Danh sách dịch vụ đã chọn và tổng tiền */}
        <section className="mb-8 border rounded-lg p-4 bg-blue-50 shadow-sm">
          <h2 className="text-xl font-semibold mb-2 text-blue-700">
            {packageId ? "Các dịch vụ trong gói" : "Dịch vụ đã chọn"}
          </h2>
          <ul className="list-disc pl-6">
            {selectedServicesList.map((s) => (
              <li key={s.ServiceID} className="mb-2">
                <span className="font-bold text-blue-700">{s.ServiceName}</span>
                {/* Nếu là package thì không hiển thị giá dịch vụ con */}
                {!packageId && (
                  <> - <span className="text-pink-600">{s.Price?.toLocaleString('vi-VN') ?? ''}{s.Price !== undefined ? 'đ' : ''}</span></>
                )}
                <div className="text-gray-500 text-sm">{s.Description}</div>
                <div className="text-gray-500 text-sm">Thời gian: {s.Duration}</div>
                {/* Chọn nhân sự cho cả gói và lẻ */}
                {isDatetimeValid && (
                  <div className="mt-2">
                    {getAvailableStaff(s.ServiceID).length === 0 ? (
                      <div className="text-xs text-gray-400 italic">Không có nhân sự rảnh thời điểm này. Manager sẽ phân công sau.</div>
                    ) : selectedStaff[s.ServiceID] ? (
                      <div className="flex items-center gap-2">
                        <span className="text-green-700 font-semibold">Đã chọn: </span>
                        <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-700 text-xs font-bold">
                          {selectedStaff[s.ServiceID].type === 'nurse' ? 'Y tá' : 'Chuyên gia'}
                        </span>
                        <span className="font-semibold">
                          {(() => {
                            const staff = nursingSpecialists.find(n => n.NursingID === Number(selectedStaff[s.ServiceID].id));
                            return staff ? staff.FullName : '';
                          })()}
                        </span>
                        <button className="ml-2 px-2 py-0.5 rounded bg-gray-200 text-gray-700 text-xs hover:bg-gray-300" onClick={() => setStaffPopup({ open: true, serviceId: s.ServiceID })}>Đổi</button>
                      </div>
                    ) : (
                      <button className="px-4 py-1 rounded bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:scale-105" onClick={() => setStaffPopup({ open: true, serviceId: s.ServiceID })}>Chọn nhân sự</button>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
          <div className="flex justify-end mt-4">
            <span className="text-lg font-semibold">Tổng tiền: </span>
            <span className="text-2xl text-pink-600 font-bold ml-2">
              {total > 0
                ? total.toLocaleString('vi-VN') + 'đ'
                : '0đ'}
            </span>
          </div>
        </section>
        {/* Chọn ngày giờ (bắt buộc cho cả gói và lẻ) */}
        <section className="mb-6 border rounded-lg p-4 bg-white">
          <label className="block font-semibold mb-1">Chọn ngày giờ đặt dịch vụ <span className="text-red-500">*</span></label>
          <input
            type="datetime-local"
            className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-pink-300"
            value={datetime}
            onChange={e => setDatetime(e.target.value)}
            min={new Date(Date.now() + 30 * 60 * 1000).toISOString().slice(0, 16)}
            autoFocus
          />
          {!isDatetimeValid && datetime && (
            <div className="text-red-500 text-sm mt-1">Thời gian phải cách hiện tại ít nhất 30 phút</div>
          )}
        </section>
        {/* Popup chọn nhân sự */}
        {staffPopup.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl p-8 max-w-lg w-full relative">
              <button className="absolute top-2 right-2 text-xl" onClick={() => setStaffPopup({ open: false, serviceId: null })}>&times;</button>
              <h2 className="text-xl font-bold text-purple-700 mb-4">Chọn nhân sự cho dịch vụ</h2>
              <div className="flex gap-6">
                {/* Y tá */}
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-700 mb-2">Y tá</h3>
                  <ul className="space-y-2">
                    {getAvailableStaff(staffPopup.serviceId).filter(n => n.Major && n.Major.toLowerCase().includes('y tá')).map(n => (
                      <li key={n.NursingID} className="border rounded p-2 flex items-center gap-2 hover:bg-blue-50 cursor-pointer" onClick={() => handleSelectStaff(staffPopup.serviceId, 'nurse', n.NursingID)}>
                        <img src={n.avatar_url || '/default-avatar.png'} alt="avatar" className="w-10 h-10 rounded-full object-cover border-2 border-blue-200" />
                        <div>
                          <div className="font-semibold text-blue-700">{n.FullName}</div>
                          <div className="text-xs text-gray-500">Kinh nghiệm: {n.Experience} năm</div>
                          <div className="text-xs text-gray-500">{n.Slogan}</div>
                        </div>
                      </li>
                    ))}
                    {getAvailableStaff(staffPopup.serviceId).filter(n => n.Major && n.Major.toLowerCase().includes('y tá')).length === 0 && (
                      <li className="text-xs text-gray-400">Không có y tá nào rảnh thời điểm này.</li>
                    )}
                  </ul>
                </div>
                {/* Chuyên gia */}
                <div className="flex-1">
                  <h3 className="font-semibold text-pink-700 mb-2">Chuyên gia</h3>
                  <ul className="space-y-2">
                    {getAvailableStaff(staffPopup.serviceId).filter(n => n.Major && !n.Major.toLowerCase().includes('y tá')).map(n => (
                      <li key={n.NursingID} className="border rounded p-2 flex items-center gap-2 hover:bg-pink-50 cursor-pointer" onClick={() => handleSelectStaff(staffPopup.serviceId, 'specialist', n.NursingID)}>
                        <img src={n.avatar_url || '/default-avatar.png'} alt="avatar" className="w-10 h-10 rounded-full object-cover border-2 border-pink-200" />
                        <div>
                          <div className="font-semibold text-pink-700">{n.FullName}</div>
                          <div className="text-xs text-gray-500">Kinh nghiệm: {n.Experience} năm</div>
                          <div className="text-xs text-gray-500">{n.Slogan}</div>
                        </div>
                      </li>
                    ))}
                    {getAvailableStaff(staffPopup.serviceId).filter(n => n.Major && !n.Major.toLowerCase().includes('y tá')).length === 0 && (
                      <li className="text-xs text-gray-400">Không có chuyên gia nào rảnh thời điểm này.</li>
                    )}
                  </ul>
                </div>
              </div>
              <div className="mt-4 text-right">
                <button className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 font-semibold" onClick={() => setStaffPopup({ open: false, serviceId: null })}>Đóng</button>
              </div>
            </div>
          </div>
        )}
        {/* Chọn nurse cho package (nếu cần, giữ nguyên logic cũ nếu muốn) */}
        {/* <section className="mb-6 border rounded-lg p-4 bg-white">
          ... chọn nurse cho package ...
        </section> */}
        <section className="mb-6 border rounded-lg p-4 bg-white">
          <label className="block font-semibold mb-1">Ghi chú</label>
          <textarea
            className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-pink-300"
            rows={3}
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Nhập ghi chú nếu có..."
          />
        </section>
        {error && <div className="text-red-500 mb-4 font-semibold">{error}</div>}
        <button
          className="w-full py-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold text-lg shadow hover:scale-105 transition"
          onClick={handlePayment}
        >
          Thanh toán
        </button>
      </div>
    </div>
  );
}