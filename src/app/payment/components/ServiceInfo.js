import { FaCheckCircle, FaClock, FaUserMd, FaUser } from 'react-icons/fa';

export default function ServiceInfo({ 
  packageId, 
  packageDetail, 
  childServices, 
  selectedServices, 
  getStaffInfo,
  total,
  bookingData
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
      {packageDetail && (
        <div className="mb-6">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border-l-4 border-blue-500">
            <h3 className="text-lg font-bold text-blue-700 mb-2">Gói dịch vụ</h3>
            <div className="space-y-2">
              <div className="font-bold text-xl text-pink-700">
                {packageDetail.serviceName || packageDetail.ServiceName || 'Gói dịch vụ'}
              </div>
              <div className="text-gray-700">
                {packageDetail.description || packageDetail.Description || 'Mô tả dịch vụ'}
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <FaClock className="text-sm" />
                <span>Thời gian: {packageDetail.duration || packageDetail.Duration || 0} phút</span>
              </div>
              <div className="text-2xl font-bold text-pink-600">
                {(packageDetail.price || packageDetail.Price || 0).toLocaleString()}đ
              </div>
              {packageDetail.discount && (
                <div className="text-green-600 font-semibold">
                  Giảm giá: {packageDetail.discount}%
                </div>
              )}
            </div>
          </div>

          {/* Child Services */}
          {childServices && childServices.length > 0 && (
            <div className="mt-4">  
              <h4 className="font-semibold text-gray-700 mb-3">Các dịch vụ trong gói:</h4>
              <div className="space-y-3">
                {childServices.map((s, idx) => (
                  <div key={s.serviceID || s.serviceTypeID || idx} className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-blue-700">
                        {s.serviceName || s.ServiceName || 'Dịch vụ con'}
                      </span>
                      <span className="text-pink-600 font-semibold">
                        {(s.price || s.Price || 0).toLocaleString()}đ
                      </span>
                    </div>
                    <div className="text-gray-600 text-sm mb-2">
                      {s.description || s.Description || 'Mô tả dịch vụ'}
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 text-xs">
                      <FaClock />
                      <span>{s.duration || s.Duration || 0} phút</span>
                    </div>
                    {getStaffInfo && getStaffInfo(s.serviceID || s.serviceTypeID) && (
                      <div className="flex items-center gap-2 text-green-700 text-xs mt-2">
                        <FaUserMd />
                        <span>{getStaffInfo(s.serviceID || s.serviceTypeID).name} ({getStaffInfo(s.serviceID || s.serviceTypeID).type === 'nurse' ? 'Y tá' : 'Chuyên gia'})</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {selectedServices && selectedServices.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-700 mb-3">Dịch vụ lẻ</h3>
          <div className="space-y-3">
            {selectedServices.map((s, idx) => (
              <div key={s.serviceID || s.serviceTypeID || idx} className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-blue-700">
                    {s.serviceName || s.ServiceName || 'Dịch vụ'}
                  </span>
                  <span className="text-pink-600 font-semibold">
                    {(s.price || s.Price || 0).toLocaleString()}đ
                    {s.quantity && s.quantity > 1 && ` x${s.quantity}`}
                  </span>
                </div>
                <div className="text-gray-600 text-sm mb-2">
                  {s.description || s.Description || 'Mô tả dịch vụ'}
                </div>
                <div className="flex items-center gap-2 text-gray-500 text-xs">
                  <FaClock />
                  <span>{s.duration || s.Duration || 0} phút</span>
                </div>
                {getStaffInfo && getStaffInfo(s.serviceID || s.serviceTypeID) && (
                  <div className="flex items-center gap-2 text-green-700 text-xs mt-2">
                    <FaUserMd />
                    <span>{getStaffInfo(s.serviceID || s.serviceTypeID).name} ({getStaffInfo(s.serviceID || s.serviceTypeID).type === 'nurse' ? 'Y tá' : 'Chuyên gia'})</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hiển thị thông tin booking khi không có service details */}
      {!packageDetail && !selectedServices && total && total > 0 && (
        <div className="mb-6">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border-l-4 border-blue-500">
            <h3 className="text-lg font-bold text-blue-700 mb-2">Thông tin đặt lịch</h3>
            <div className="space-y-2">
              <div className="font-bold text-xl text-pink-700">
                Booking #{bookingData?.bookingID || 'N/A'}
              </div>
              <div className="text-gray-700">
                Đặt lịch dịch vụ chăm sóc
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <FaClock className="text-sm" />
                <span>Trạng thái: {bookingData?.status || 'pending'}</span>
              </div>
              <div className="text-2xl font-bold text-pink-600">
                {total.toLocaleString()}đ
              </div>
              {/* Hiển thị thông tin về phí phát sinh nếu có */}
              {bookingData?.extra && (
                <div className="text-sm text-orange-600 font-medium">
                  Phí phát sinh: {bookingData.extra}%
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Extra Fee - Phí phát sinh cho ngày lễ */}
      {bookingData?.extra && (
        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-4 border-l-4 border-orange-500 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center">
              <span className="text-orange-600 text-sm font-bold">!</span>
            </div>
            <h4 className="font-semibold text-orange-700">Phí phát sinh cho ngày lễ</h4>
          </div>
          <div className="text-orange-800">
            <p className="text-sm mb-2">
              <strong>Lưu ý:</strong> Đặt lịch vào ngày lễ sẽ có phí phát sinh thêm. 
              Phí này sẽ được tính vào hóa đơn khi thanh toán.
            </p>
            <div className="bg-white rounded-lg p-3 border border-orange-200">
              <div className="text-sm text-gray-600 mb-1">Chi tiết phí phát sinh:</div>
              <div className="font-medium text-orange-700">{bookingData.extra}%</div>
            </div>
          </div>
        </div>
      )}

      {/* Tổng tiền */}
      {total && total > 0 && (
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-4 border-l-4 border-pink-500">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-gray-700">Tổng tiền:</span>
            <span className="text-2xl font-bold text-pink-600">{total.toLocaleString()}đ</span>
          </div>
          {bookingData?.extra && (
            <div className="mt-2 pt-2 border-t border-pink-200">
              <div className="text-sm text-gray-600">
                <span className="font-medium">Bao gồm phí phát sinh cho ngày lễ</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 