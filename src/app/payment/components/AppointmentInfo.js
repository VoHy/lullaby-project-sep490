import { FaCalendarAlt, FaStickyNote, FaUser } from 'react-icons/fa';

export default function AppointmentInfo({ 
  formattedDatetime, 
  note, 
  selectedCareProfile 
}) {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <h4 className="font-semibold text-gray-700 mb-3">Thông tin lịch hẹn</h4>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <FaCalendarAlt className="text-blue-600" />
          <div>
            <span className="text-sm text-gray-600">Thời gian:</span>
            <div className="font-semibold text-gray-800">{formattedDatetime}</div>
          </div>
        </div>
        {selectedCareProfile && (
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center mt-1">
              <FaUser className="text-blue-600 text-xs" />
            </div>
            <div>
              <span className="text-sm text-gray-600">Hồ sơ người thân:</span>
              <div className="font-semibold text-gray-800">{selectedCareProfile.ProfileName}</div>
              <div className="text-xs text-gray-500 mt-1">
                {selectedCareProfile.PhoneNumber && `SĐT: ${selectedCareProfile.PhoneNumber}`}
                {selectedCareProfile.Address && ` • ${selectedCareProfile.Address}`}
              </div>
            </div>
          </div>
        )}
        {note && (
          <div className="flex items-start gap-3">
            <FaStickyNote className="text-blue-600 mt-1" />
            <div>
              <span className="text-sm text-gray-600">Ghi chú:</span>
              <div className="font-semibold text-gray-800">{note}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 