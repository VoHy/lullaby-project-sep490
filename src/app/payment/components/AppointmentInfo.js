import {
  FaCalendarAlt, FaStickyNote, FaUser, FaPhone,
  FaMapMarkerAlt, FaBirthdayCake
} from 'react-icons/fa';

export default function AppointmentInfo({
  datetime,
  note,
  selectedCareProfile
}) {
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'Chưa có thông tin';
    try {
      const date = new Date(dateTimeString);
      return date.toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    } catch {
      return 'Chưa có thông tin';
    }
  };

  const formattedDateTime = formatDateTime(datetime);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 space-y-5">
      {/* Tiêu đề */}
      <h4 className="text-lg font-bold text-gray-800 border-b pb-2">
        Thông tin lịch hẹn
      </h4>

      {/* Thời gian */}
      <div className="flex items-center gap-3 text-gray-700">
        <FaCalendarAlt className="text-blue-600 text-lg" />
        <div>
          <p className="text-sm text-gray-500">Thời gian</p>
          <p className="font-medium">{formattedDateTime}</p>
        </div>
      </div>

      {/* Thông tin người được chăm sóc */}
      {selectedCareProfile && (
        <div className="bg-blue-50 rounded-xl p-4 space-y-4">
          <div className="flex items-center gap-2">
            <FaUser className="text-blue-600" />
            <h5 className="font-semibold text-gray-800">
              Người được chăm sóc
            </h5>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 text-gray-700">
            <InfoItem icon={<FaUser />} label="Tên" value={selectedCareProfile.profileName} />
            {selectedCareProfile.dateOfBirth && (
              <InfoItem icon={<FaBirthdayCake />} label="Ngày sinh" value={new Date(selectedCareProfile.dateOfBirth).toLocaleDateString('vi-VN')} />
            )}
            {selectedCareProfile.phoneNumber && (
              <InfoItem icon={<FaPhone />} label="Số điện thoại" value={selectedCareProfile.phoneNumber} />
            )}
            <InfoItem
              icon={<FaUser />}
              label="Trạng thái"
              value={selectedCareProfile.status?.toLowerCase() === 'active' ? 'Hoạt động' : 'Không hoạt động'}
            />
            {selectedCareProfile.address && (
              <InfoItem icon={<FaMapMarkerAlt />} label="Địa chỉ" value={selectedCareProfile.address} full />
            )}
            {selectedCareProfile.note && (
              <InfoItem icon={<FaStickyNote />} label="Ghi chú" value={selectedCareProfile.note} full />
            )}
          </div>
        </div>
      )}

      {/* Ghi chú phí phát sinh */}
      {note && (
        <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-xl">
          <FaStickyNote className="text-yellow-600 mt-1" />
          <div>
            <p className="text-sm text-gray-600">Ghi chú</p>
            <p className="font-semibold text-gray-800">Phí phát sinh: {note}%</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Component nhỏ cho gọn code
function InfoItem({ icon, label, value, full }) {
  return (
    <div className={`flex items-start gap-2 ${full ? 'sm:col-span-2' : ''}`}>
      <span className="text-blue-500 mt-1">{icon}</span>
      <div>
        <p className="text-xs text-gray-500">{label}:</p>
        <p className="font-medium text-gray-800">{value || 'Chưa có thông tin'}</p>
      </div>
    </div>
  );
}
