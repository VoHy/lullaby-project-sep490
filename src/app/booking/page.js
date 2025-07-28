"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import serviceTypes from '@/mock/ServiceType';
import serviceTasks from '@/mock/ServiceTask';
import workSchedules from "@/mock/WorkSchedule";
import nursingSpecialists from '@/mock/NursingSpecialist';
import careProfiles from '@/mock/CareProfile';
import { HiOutlineArrowLeft, HiOutlineUserGroup, HiOutlineCalendar, HiOutlineDocumentText, HiOutlineCurrencyDollar } from "react-icons/hi2";

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
      if (!datetime || !isDatetimeValid) {
        setError("Vui lòng chọn ngày giờ hợp lệ (cách hiện tại ít nhất 30 phút)");
        return;
      }
    const params = new URLSearchParams();
    if (packageId) {
      params.set("package", packageId);
    } else if (serviceId) {
      // Truyền services (danh sách id, kể cả 1 dịch vụ lẻ)
      params.set("services", serviceId);
    }
    params.set("datetime", datetime);
    params.set("note", note);
    // Truyền selectedStaff (object) sang payment
    params.set("selectedStaff", encodeURIComponent(JSON.stringify(
      Object.fromEntries(
        Object.entries(selectedStaff).map(([serviceId, staff]) => [
          serviceId,
          {
            ...staff,
            name: (() => {
              const found = nursingSpecialists.find(n => n.NursingID === Number(staff.id));
              return found ? found.FullName : '';
            })()
          }
        ])
      )
    )));
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50 py-8">
      <div className="max-w-5xl mx-auto px-2 md:px-4">
        <div className="bg-white rounded-2xl shadow-xl p-4 md:p-8 relative overflow-hidden">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 md:mb-8 gap-2 border-b pb-3 md:pb-4">
          <button
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 font-semibold shadow-sm transition"
            onClick={() => router.back()}
          >
              <HiOutlineArrowLeft className="text-xl" />
              <span>Quay lại</span>
          </button>
            <h1 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 text-center flex-1">
              Xác nhận đặt dịch vụ
            </h1>
        </div>
          {/* Main 2-column layout */}
          <div className="flex flex-col md:flex-row gap-4 md:gap-8">
            {/* LEFT COLUMN: Info, dịch vụ, tổng tiền */}
            <div className="md:w-1/2 flex flex-col gap-4">
        {renderPackageInfo()}
              <section className="border rounded-2xl p-4 md:p-6 bg-blue-50/60 shadow-sm">
                <h2 className="text-lg md:text-xl font-bold mb-3 text-blue-700 flex items-center gap-2">
                  <HiOutlineUserGroup className="text-xl md:text-2xl" />
            {packageId ? "Các dịch vụ trong gói" : "Dịch vụ đã chọn"}
          </h2>
                <ul className="space-y-3 md:space-y-4">
            {selectedServicesList.map((s) => (
                    <li key={s.ServiceID} className="bg-white rounded-xl shadow p-3 md:p-4 border flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-blue-700 text-base md:text-lg">{s.ServiceName}</span>
                {!packageId && (
                          <span className="ml-2 text-pink-600 font-bold text-sm md:text-base">{s.Price?.toLocaleString('vi-VN') ?? ''}{s.Price !== undefined ? 'đ' : ''}</span>
                )}
                      </div>
                      <div className="text-gray-500 text-xs md:text-sm">{s.Description}</div>
                      <div className="text-gray-500 text-xs md:text-sm flex items-center gap-1"><HiOutlineCalendar /> Thời gian: {s.Duration}</div>
                {isDatetimeValid && (
                  <div className="mt-2">
                    {getAvailableStaff(s.ServiceID).length === 0 ? (
                      <div className="text-xs text-gray-400 italic">Không có nhân sự rảnh thời điểm này. Manager sẽ phân công sau.</div>
                    ) : selectedStaff[s.ServiceID] ? (
                      <div className="flex items-center gap-2">
                        <span className="text-green-700 font-semibold">Đã chọn: </span>
                              <span className={`px-2 py-0.5 rounded text-xs font-bold ${selectedStaff[s.ServiceID].type === 'nurse' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}`}>
                          {selectedStaff[s.ServiceID].type === 'nurse' ? 'Y tá' : 'Chuyên gia'}
                        </span>
                        <span className="font-semibold">
                          {(() => {
                            const staff = nursingSpecialists.find(n => n.NursingID === Number(selectedStaff[s.ServiceID].id));
                            return staff ? staff.FullName : '';
                          })()}
                        </span>
                              <button className="ml-2 px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-xs hover:bg-gray-200 transition" onClick={() => setStaffPopup({ open: true, serviceId: s.ServiceID })}>Đổi</button>
                      </div>
                    ) : (
                            <button className="px-4 py-1 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:scale-105 shadow transition" onClick={() => setStaffPopup({ open: true, serviceId: s.ServiceID })}>Chọn nhân sự</button>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
                <div className="flex justify-end mt-4 md:mt-6 items-center gap-2">
                  <span className="text-base md:text-lg font-semibold">Tổng tiền:</span>
                  <span className="text-xl md:text-2xl text-pink-600 font-extrabold flex items-center gap-1">
                    <HiOutlineCurrencyDollar />
              {total > 0
                ? total.toLocaleString('vi-VN') + 'đ'
                : '0đ'}
            </span>
          </div>
        </section>
            </div>
            {/* RIGHT COLUMN: Form, chọn ngày giờ, ghi chú, thanh toán */}
            <div className="md:w-1/2 flex flex-col gap-4">
              <section className="border rounded-2xl p-4 md:p-6 bg-white flex flex-col gap-2">
                <label className="block font-semibold mb-1 flex items-center gap-2"><HiOutlineCalendar />Chọn ngày giờ đặt dịch vụ <span className="text-red-500">*</span></label>
          <input
            type="datetime-local"
                  className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-pink-300 text-base shadow-sm"
            value={datetime}
            onChange={e => setDatetime(e.target.value)}
            min={new Date(Date.now() + 30 * 60 * 1000).toISOString().slice(0, 16)}
            autoFocus
          />
          {!isDatetimeValid && datetime && (
            <div className="text-red-500 text-sm mt-1">Thời gian phải cách hiện tại ít nhất 30 phút</div>
          )}
        </section>
              {/* Ghi chú */}
              <section className="border rounded-2xl p-4 md:p-6 bg-white">
                <label className="block font-semibold mb-1 flex items-center gap-2"><HiOutlineDocumentText />Ghi chú</label>
                <textarea
                  className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-pink-300 text-base shadow-sm"
                  rows={3}
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="Nhập ghi chú nếu có..."
                />
              </section>
              {error && <div className="text-red-500 mb-2 font-semibold animate-shake">{error}</div>}
              <button
                className="w-full py-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-extrabold text-lg shadow-lg hover:scale-105 hover:shadow-xl transition mt-1 disabled:opacity-60"
                onClick={handlePayment}
                disabled={!isDatetimeValid}
              >
                Thanh toán
              </button>
            </div>
          </div>
        {/* Popup chọn nhân sự */}
        {staffPopup.open && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm animate-fade-in">
              <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full relative border-2 border-pink-100 animate-pop-in">
                <button className="absolute top-2 right-2 text-2xl text-gray-400 hover:text-pink-500 transition" onClick={() => setStaffPopup({ open: false, serviceId: null })}>&times;</button>
                <h2 className="text-xl font-extrabold text-purple-700 mb-4 flex items-center gap-2"><HiOutlineUserGroup />Chọn nhân sự cho dịch vụ</h2>
                <div className="flex gap-6 flex-col md:flex-row">
                {/* Y tá */}
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-700 mb-2">Y tá</h3>
                  <ul className="space-y-2">
                    {getAvailableStaff(staffPopup.serviceId).filter(n => n.Major && n.Major.toLowerCase().includes('y tá')).map(n => (
                        <li key={n.NursingID} className="border rounded-xl p-2 flex items-center gap-2 hover:bg-blue-50 cursor-pointer transition" onClick={() => handleSelectStaff(staffPopup.serviceId, 'nurse', n.NursingID)}>
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
                        <li key={n.NursingID} className="border rounded-xl p-2 flex items-center gap-2 hover:bg-pink-50 cursor-pointer transition" onClick={() => handleSelectStaff(staffPopup.serviceId, 'specialist', n.NursingID)}>
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
                <div className="mt-6 text-right">
                  <button className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 font-semibold shadow-sm transition" onClick={() => setStaffPopup({ open: false, serviceId: null })}>Đóng</button>
                </div>
              </div>
            </div>
          )}
          </div>
      </div>
    </div>
  );
}