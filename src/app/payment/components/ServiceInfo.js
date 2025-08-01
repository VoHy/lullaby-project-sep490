import { FaCheckCircle, FaClock, FaUserMd, FaUser } from 'react-icons/fa';

export default function ServiceInfo({ 
  packageId, 
  packageDetail, 
  childServices, 
  selectedServices, 
  getStaffInfo 
}) {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
          <FaCheckCircle className="text-blue-600 text-xl" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Thông tin dịch vụ</h2>
      </div>

      {/* Package hoặc Services */}
      {packageId && packageDetail && (
        <div className="mb-6">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border-l-4 border-blue-500">
            <h3 className="text-lg font-bold text-blue-700 mb-2">Gói dịch vụ</h3>
            <div className="space-y-2">
              <div className="font-bold text-xl text-pink-700">{packageDetail.ServiceName}</div>
              <div className="text-gray-700">{packageDetail.Description}</div>
              <div className="flex items-center gap-2 text-gray-600">
                <FaClock className="text-sm" />
                <span>Thời gian: {packageDetail.Duration}</span>
              </div>
              <div className="text-2xl font-bold text-pink-600">
                {(packageDetail.Price || 0).toLocaleString()}đ
              </div>
              {packageDetail.Discount && (
                <div className="text-green-600 font-semibold">
                  Giảm giá: {packageDetail.Discount}%
                </div>
              )}
            </div>
          </div>

          {/* Child Services */}
          {childServices.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold text-gray-700 mb-3">Các dịch vụ trong gói:</h4>
              <div className="space-y-3">
                {childServices.map((s, idx) => (
                  <div key={s.ServiceID || idx} className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-blue-700">{s.ServiceName}</span>
                      <span className="text-pink-600 font-semibold">{(s.Price || 0).toLocaleString()}đ</span>
                    </div>
                    <div className="text-gray-600 text-sm mb-2">{s.Description}</div>
                    <div className="flex items-center gap-2 text-gray-500 text-xs">
                      <FaClock />
                      <span>{s.Duration}</span>
                    </div>
                    {getStaffInfo(s.ServiceID) && (
                      <div className="flex items-center gap-2 text-green-700 text-xs mt-2">
                        <FaUserMd />
                        <span>{getStaffInfo(s.ServiceID).name} ({getStaffInfo(s.ServiceID).type === 'nurse' ? 'Y tá' : 'Chuyên gia'})</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {selectedServices.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-700 mb-3">Dịch vụ lẻ</h3>
          <div className="space-y-3">
            {selectedServices.map((s) => (
              <div key={s.ServiceID} className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-blue-700">{s.ServiceName}</span>
                  <span className="text-pink-600 font-semibold">{(s.Price || 0).toLocaleString()}đ</span>
                </div>
                <div className="text-gray-600 text-sm mb-2">{s.Description}</div>
                {getStaffInfo(s.ServiceID) && (
                  <div className="flex items-center gap-2 text-green-700 text-xs">
                    <FaUserMd />
                    <span>{getStaffInfo(s.ServiceID).name} ({getStaffInfo(s.ServiceID).type === 'nurse' ? 'Y tá' : 'Chuyên gia'})</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 