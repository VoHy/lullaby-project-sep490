import { FaCalendarAlt, FaStickyNote, FaUser, FaPhone, FaMapMarkerAlt, FaBirthdayCake } from 'react-icons/fa';

export default function AppointmentInfo({
  datetime,
  note,
  selectedCareProfile
}) {


  // Format datetime từ workdate
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
    } catch (error) {
      return 'Chưa có thông tin';
    }
  };

  const formattedDateTime = formatDateTime(datetime);

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <h4 className="font-semibold text-gray-700 mb-3">Thông tin lịch hẹn</h4>
      <div className="space-y-4">
        {/* Thời gian */}
        <div className="flex items-center gap-3">
          <FaCalendarAlt className="text-blue-600" />
          <div>
            <span className="text-sm text-gray-600">Thời gian:</span>
            <div className="font-semibold text-gray-800">{formattedDateTime}</div>
          </div>
        </div>

        {/* Thông tin người được chăm sóc */}
        {selectedCareProfile && (
          <div className="bg-blue-50 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <FaUser className="text-blue-600" />
              <h5 className="font-semibold text-gray-700">Thông tin người được chăm sóc</h5>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Tên */}
              <div className="flex items-center gap-2">
                <FaUser className="text-blue-500 text-sm" />
                <div>
                  <span className="text-xs text-gray-500">Tên:</span>
                  <div className="font-medium text-gray-800">
                    {selectedCareProfile.profileName || 'Chưa có thông tin'}
                  </div>
                </div>
              </div>

              {/* Ngày sinh */}
              {selectedCareProfile.dateOfBirth && (
                <div className="flex items-center gap-2">
                  <FaBirthdayCake className="text-blue-500 text-sm" />
                  <div>
                    <span className="text-xs text-gray-500">Ngày sinh:</span>
                    <div className="font-medium text-gray-800">
                      {new Date(selectedCareProfile.dateOfBirth).toLocaleDateString('vi-VN')}
                    </div>
                  </div>
                </div>
              )}

              {/* Số điện thoại */}
              {selectedCareProfile.phoneNumber && (
                <div className="flex items-center gap-2">
                  <FaPhone className="text-blue-500 text-sm" />
                  <div>
                    <span className="text-xs text-gray-500">Số điện thoại:</span>
                    <div className="font-medium text-gray-800">{selectedCareProfile.phoneNumber}</div>
                  </div>
                </div>
              )}

              {/* Địa chỉ */}
              {selectedCareProfile.address && (
                <div className="flex items-start gap-2 md:col-span-2">
                  <FaMapMarkerAlt className="text-blue-500 text-sm mt-1" />
                  <div>
                    <span className="text-xs text-gray-500">Địa chỉ:</span>
                    <div className="font-medium text-gray-800">{selectedCareProfile.address}</div>
                  </div>
                </div>
              )}

              {/* Trạng thái */}
              {selectedCareProfile.status && (
                <div className="flex items-center gap-2">
                  <FaUser className="text-green-500 text-sm" />
                  <div>
                    <span className="text-xs text-gray-500">Trạng thái:</span>
                    <div className="font-medium text-gray-800">{selectedCareProfile.status}</div>
                  </div>
                </div>
              )}

              {/* Ghi chú */}
              {selectedCareProfile.note && (
                <div className="flex items-start gap-2 md:col-span-2">
                  <FaStickyNote className="text-blue-500 text-sm mt-1" />
                  <div>
                    <span className="text-xs text-gray-500">Ghi chú:</span>
                    <div className="font-medium text-gray-800">{selectedCareProfile.note}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Ghi chú */}
            {note && (
              <div className="flex items-start gap-3">
                <FaStickyNote className="text-blue-600 mt-1" />
                <div>
                  <span className="text-sm text-gray-600">Ghi chú:</span>
                  <div className="font-semibold text-gray-800"> Phí phát sinh: {note}%</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 