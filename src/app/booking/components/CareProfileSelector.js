import { HiOutlineUserGroup, HiOutlinePhone, HiOutlineMapPin } from "react-icons/hi2";

export default function CareProfileSelector({ 
  careProfiles, 
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
          <div className="text-gray-400 text-6xl mb-4">👥</div>
          <p className="text-gray-600 mb-4">Bạn chưa có hồ sơ người thân nào</p>
          <button 
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            onClick={() => window.open('/profile/patient', '_blank')}
          >
            Tạo hồ sơ người thân
          </button>
        </div>
      ) : careProfiles.filter(p => p.Status === 'active').length === 0 ? (
        <div className="text-center py-6">
          <div className="text-gray-400 text-6xl mb-4">⚠️</div>
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
          {careProfiles.filter(p => p.Status === 'active').map((profile) => (
            <div
              key={profile.CareProfileID}
              className={`border rounded-xl p-4 cursor-pointer transition-all ${
                selectedCareProfile?.CareProfileID === profile.CareProfileID
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-blue-300"
              }`}
              onClick={() => setSelectedCareProfile(profile)}
            >
              <div className="flex items-start gap-3">
                <img
                  src={profile.Image || "/images/hero-bg.jpg"}
                  alt={profile.ProfileName}
                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-gray-800">{profile.ProfileName}</h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        profile.Status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {profile.Status === "active" ? "Hoạt động" : "Ngừng hoạt động"}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <HiOutlinePhone className="text-gray-400" />
                      <span>{profile.PhoneNumber || "Chưa có số điện thoại"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <HiOutlineMapPin className="text-gray-400" />
                      <span>{profile.Address || "Chưa có địa chỉ"}</span>
                    </div>
                    {profile.DateOfBirth && (
                      <div className="text-xs text-gray-500">
                        Ngày sinh: {profile.DateOfBirth}
                      </div>
                    )}
                  </div>
                </div>
                {selectedCareProfile?.CareProfileID === profile.CareProfileID && (
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