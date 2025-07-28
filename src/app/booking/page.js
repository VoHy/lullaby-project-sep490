"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useMemo, useContext } from "react";
import serviceTypes from '@/mock/ServiceType';
import serviceTasks from '@/mock/ServiceTask';
import workSchedules from "@/mock/WorkSchedule";
import nursingSpecialists from '@/mock/NursingSpecialist';
import careProfiles from '@/mock/CareProfile';
import {
  BookingHeader,
  PackageInfo,
  ServicesList,
  BookingForm,
  StaffSelectionModal
} from './components';
import { AuthContext } from "@/context/AuthContext";

export default function BookingPage() {
  const [datetime, setDatetime] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useContext(AuthContext);
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
  const [selectedCareProfile, setSelectedCareProfile] = useState(null);
  const [careProfileError, setCareProfileError] = useState("");

  // Kiểm tra ngày giờ hợp lệ cho dịch vụ lẻ (cách hiện tại ít nhất 30 phút)
  const isDatetimeValid = useMemo(() => {
    if (!datetime) return false;
    const selected = new Date(datetime);
    const now = new Date();
    return selected.getTime() - now.getTime() >= 30 * 60 * 1000;
  }, [datetime]);

  // Lấy danh sách CareProfile của user hiện tại (chỉ lấy active)
  const userCareProfiles = user ? careProfiles.filter(p => p.AccountID === user.AccountID && p.Status === 'active') : [];
  
  // Reset selectedCareProfile nếu nó không active
  if (selectedCareProfile && selectedCareProfile.Status !== 'active') {
    setSelectedCareProfile(null);
  }

  // Lấy ZoneID của user (giả sử lấy từ careProfiles)
  const userProfile = user ? careProfiles.find(p => p.AccountID === user.AccountID) : careProfiles[0];
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
    setCareProfileError("");
    
    // Validate user login
    if (!user) {
      setError("Vui lòng đăng nhập để tiếp tục");
      return;
    }
    
    // Validate CareProfile
    if (!selectedCareProfile) {
      setCareProfileError("Vui lòng chọn hồ sơ người thân để tiếp tục");
      return;
    }
    
    // Validate CareProfile status
    if (selectedCareProfile.Status !== 'active') {
      setCareProfileError("Hồ sơ người thân không hoạt động. Vui lòng chọn hồ sơ khác hoặc kích hoạt hồ sơ này.");
      return;
    }
    
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
    params.set("careProfileId", selectedCareProfile.CareProfileID);
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

  // Loading state khi user chưa load xong
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50 py-8">
        <div className="max-w-5xl mx-auto px-2 md:px-4">
          <div className="bg-white rounded-2xl shadow-xl p-4 md:p-8 relative overflow-hidden">
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Đang tải thông tin người dùng...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50 py-8">
      <div className="max-w-5xl mx-auto px-2 md:px-4">
        <div className="bg-white rounded-2xl shadow-xl p-4 md:p-8 relative overflow-hidden">
          {/* Header */}
          <BookingHeader />

          {/* Main 2-column layout */}
          <div className="flex flex-col md:flex-row gap-4 md:gap-8">
            {/* LEFT COLUMN: Info, dịch vụ, tổng tiền */}
            <div className="md:w-1/2 flex flex-col gap-4">
              <PackageInfo packageDetail={detail} />
              <ServicesList
                selectedServicesList={selectedServicesList}
                packageId={packageId}
                isDatetimeValid={isDatetimeValid}
                getAvailableStaff={getAvailableStaff}
                selectedStaff={selectedStaff}
                setSelectedStaff={setSelectedStaff}
                setStaffPopup={setStaffPopup}
                nursingSpecialists={nursingSpecialists}
              />
            </div>

            {/* RIGHT COLUMN: Form, chọn ngày giờ, ghi chú, thanh toán */}
            <div className="md:w-1/2">
              <BookingForm
                datetime={datetime}
                setDatetime={setDatetime}
                note={note}
                setNote={setNote}
                isDatetimeValid={isDatetimeValid}
                error={error}
                handlePayment={handlePayment}
                careProfiles={userCareProfiles}
                selectedCareProfile={selectedCareProfile}
                setSelectedCareProfile={setSelectedCareProfile}
                careProfileError={careProfileError}
              />
            </div>
          </div>

        {/* Popup chọn nhân sự */}
          <StaffSelectionModal
            staffPopup={staffPopup}
            setStaffPopup={setStaffPopup}
            getAvailableStaff={getAvailableStaff}
            handleSelectStaff={handleSelectStaff}
            nursingSpecialists={nursingSpecialists}
          />
          </div>
      </div>
    </div>
  );
}