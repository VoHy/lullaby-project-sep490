import { HiOutlineUserGroup } from "react-icons/hi2";

export default function StaffSelectionModal({ 
  staffPopup, 
  setStaffPopup, 
  getAvailableStaff, 
  handleSelectStaff, 
  nursingSpecialists 
}) {
  if (!staffPopup.open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full relative border-2 border-pink-100 animate-pop-in">
        <button
          className="absolute top-2 right-2 text-2xl text-gray-400 hover:text-pink-500 transition"
          onClick={() => setStaffPopup({ open: false, serviceId: null })}
        >
          &times;
        </button>
        <h2 className="text-xl font-extrabold text-purple-700 mb-4 flex items-center gap-2">
          <HiOutlineUserGroup />
          Chọn nhân sự cho dịch vụ
        </h2>
        <div className="flex gap-6 flex-col md:flex-row">
          {/* Chuyên viên chăm sóc */}
          <div className="flex-1">
            <h3 className="font-semibold text-blue-700 mb-2">Chuyên viên chăm sóc</h3>
            <ul className="space-y-2">
              {getAvailableStaff(staffPopup.serviceId)
                .filter((n) => n.major && n.major.toLowerCase().includes("Chuyên viên chăm sóc"))
                .map((n) => (
                  <li
                    key={n.nursingID}
                    className="border rounded-xl p-2 flex items-center gap-2 hover:bg-blue-50 cursor-pointer transition"
                    onClick={() =>
                      handleSelectStaff(staffPopup.serviceId, "nurse", n.nursingID)
                    }
                  >
                    <img
                      src={n.avatarUrl && n.avatarUrl !== 'string' ? n.avatarUrl : "/images/logo-eldora.png"}
                      alt="avatar"
                      className="w-10 h-10 rounded-full object-cover border-2 border-blue-200"
                    />
                    <div>
                      <div className="font-semibold text-blue-700">{n.fullName}</div>
                      <div className="text-xs text-gray-500">
                        Kinh nghiệm: {n.experience} năm
                      </div>
                      <div className="text-xs text-gray-500">{n.slogan}</div>
                    </div>
                  </li>
                ))}
              {getAvailableStaff(staffPopup.serviceId).filter(
                (n) => n.major && n.major.toLowerCase().includes("Chuyên viên chăm sóc")
              ).length === 0 && (
                <li className="text-xs text-gray-400">
                  Không có Chuyên viên chăm sóc nào rảnh thời điểm này.
                </li>
              )}
            </ul>
          </div>
          {/* Chuyên viên */}
          <div className="flex-1">
            <h3 className="font-semibold text-pink-700 mb-2">Chuyên viên</h3>
            <ul className="space-y-2">
              {getAvailableStaff(staffPopup.serviceId)
                .filter((n) => n.major && !n.major.toLowerCase().includes("Chuyên viên chăm sóc"))
                .map((n) => (
                  <li
                    key={n.nursingID}
                    className="border rounded-xl p-2 flex items-center gap-2 hover:bg-pink-50 cursor-pointer transition"
                    onClick={() =>
                      handleSelectStaff(staffPopup.serviceId, "specialist", n.nursingID)
                    }
                  >
                    <img
                      src={n.avatarUrl && n.avatarUrl !== 'string' ? n.avatarUrl : "/images/logo-eldora.png"}
                      alt="avatar"
                      className="w-10 h-10 rounded-full object-cover border-2 border-pink-200"
                    />
                    <div>
                      <div className="font-semibold text-pink-700">{n.fullName}</div>
                      <div className="text-xs text-gray-500">
                        Kinh nghiệm: {n.experience} năm
                      </div>
                      <div className="text-xs text-gray-500">{n.slogan}</div>
                    </div>
                  </li>
                ))}
              {getAvailableStaff(staffPopup.serviceId).filter(
                (n) => n.major && !n.major.toLowerCase().includes("Chuyên viên chăm sóc")
              ).length === 0 && (
                <li className="text-xs text-gray-400">
                  Không có Chuyên viên nào rảnh thời điểm này.
                </li>
              )}
            </ul>
          </div>
        </div>
        <div className="mt-6 text-right">
          <button
            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 font-semibold shadow-sm transition"
            onClick={() => setStaffPopup({ open: false, serviceId: null })}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
} 