import { HiOutlineUserGroup, HiOutlinePhone, HiOutlineMapPin, HiExclamationTriangle } from "react-icons/hi2";
import { formatDateToDDMMYYYY } from '@/app/profile/utils/dateUtils';

export default function CareProfileSelector({
  careProfiles,
  relatives,
  selectedCareProfile,
  setSelectedCareProfile,
  error
}) {
  return (
    <section className="border rounded-2xl p-4 md:p-6 bg-white">
      <label className="block font-semibold mb-3 flex items-center gap-2">
        <HiOutlineUserGroup />
        Chọn hồ sơ người thân <span className="text-red-500">*</span>
      </label>

      {careProfiles.length === 0 ? (
        <div className="text-center py-6">
          <HiOutlineUserGroup className="text-gray-400 text-6xl mb-4 mx-auto" />
          <p className="text-gray-600 mb-4">Bạn chưa có hồ sơ người thân nào</p>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            onClick={() => window.location.href = '/profile/patient'}
          >
            Tạo hồ sơ người thân
          </button>
        </div>
      ) : careProfiles.filter(p => p.status === 'active' || p.status === 'Active').length === 0 ? (
        <div className="text-center py-6">
          <HiExclamationTriangle className="text-gray-400 text-6xl mb-4 mx-auto" />
          <p className="text-gray-600 mb-2">Tất cả hồ sơ người thân đều không hoạt động</p>
          <p className="text-gray-500 text-sm mb-4">Vui lòng kích hoạt hồ sơ để có thể đặt dịch vụ</p>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            onClick={() => window.open('/profile/patient', '_blank')}
          >
            Quản lý hồ sơ
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {careProfiles.filter(p => p.status === 'active' || p.status === 'Active').map((profile) => (
            <div
              key={profile.careProfileID}
              className={`border rounded-xl p-4 cursor-pointer transition-all ${selectedCareProfile?.careProfileID === profile.careProfileID
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-blue-300"
                }`}
              onClick={() => setSelectedCareProfile(profile)}
            >
              <div className="flex items-start gap-3">
                <img
                  src={profile.image || "/images/hero-bg.jpg"}
                  alt={profile.profileName}
                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-gray-800">{profile.profileName}</h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${profile.status === "active" || profile.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                        }`}
                    >
                      {profile.status === "active" || profile.status === "Active" ? "Hoạt động" : "Ngừng hoạt động"}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <HiOutlinePhone className="text-gray-400" />
                      <span>{profile.phoneNumber || "Chưa có số điện thoại"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <HiOutlineMapPin className="text-gray-400" />
                      <span>{profile.address || "Chưa có địa chỉ"}</span>
                    </div>
                    {profile.dateOfBirth && (
                      <div className="text-xs text-gray-500">
                        Ngày sinh: {formatDateToDDMMYYYY(profile.dateOfBirth)}
                      </div>
                    )}
                    {Array.isArray(relatives) && relatives.length > 0 && (
                      <div className="pt-2 text-xs text-gray-600">
                        <div className="font-semibold text-gray-700 mb-1">Con:</div>
                        <ul className="list-disc pl-5 space-y-0.5">
                          {relatives
                            .filter(r => (r.careProfileID || r.CareProfileID) === profile.careProfileID)
                            .slice(0, 3)
                            .map(r => (
                              <li key={(r.relativeID || r.RelativeID || r.relativeid) + '_' + (r.relativeName || r.name)}>
                                {(r.relativeName || r.name) || 'Người thân'}
                                {r.dateOfBirth || r.DateOfBirth ? ` - ${formatDateToDDMMYYYY(r.dateOfBirth || r.DateOfBirth)}` : ''}
                              </li>
                            ))}
                          {relatives.filter(r => (r.careProfileID || r.CareProfileID) === profile.careProfileID).length > 3 && (
                            <li>...</li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
                {selectedCareProfile?.careProfileID === profile.careProfileID && (
                  <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {error && selectedCareProfile === null && (
        <div className="text-red-500 text-sm mt-2">
          Vui lòng chọn hồ sơ người thân để tiếp tục
        </div>
      )}
    </section>
  );
} 