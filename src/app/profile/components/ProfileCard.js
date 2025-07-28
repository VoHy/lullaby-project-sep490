import { FaEdit, FaSave, FaTimes, FaUser, FaEnvelope, FaPhone, FaCalendar, FaShieldAlt } from "react-icons/fa";

export default function ProfileCard({ profile, isEditing, editData, onEditClick, onInputChange, onSave, onCancel, loading, error   }) {
  if (!profile) return null;
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-8">
      <div className="text-center mb-6">
        <div className="relative inline-block">
          <img 
            src={profile.avatar_url || "/images/hero-bg.jpg"} 
            alt={profile.full_name} 
            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg" 
          />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mt-4">{profile.full_name}</h2>
        {/* <p className="text-gray-600">{profile.role_id}</p> */}
      </div>
      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <FaUser className="mr-2 text-blue-500" />
              Họ và tên
            </label>
            <input 
              name="full_name" 
              value={editData.full_name} 
              onChange={onInputChange} 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <FaEnvelope className="mr-2 text-blue-500" />
              Email
            </label>
            <input 
              name="email" 
              type="email"
              value={editData.email} 
              onChange={onInputChange} 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <FaPhone className="mr-2 text-blue-500" />
              Số điện thoại
            </label>
            <input 
              name="phone_number" 
              value={editData.phone_number} 
              onChange={onInputChange} 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <FaEnvelope className="mr-2 text-blue-500" />
              Avatar URL
            </label>
            <input 
              name="avatar_url" 
              value={editData.avatar_url} 
              onChange={onInputChange} 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
            />
          </div>
          {error && (
            <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}
          <div className="flex gap-3">
            <button 
              onClick={onSave} 
              disabled={loading} 
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-3 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <FaSave className="text-sm" />
              {loading ? 'Đang lưu...' : 'Lưu'}
            </button>
            <button 
              onClick={onCancel} 
              className="flex-1 bg-gray-300 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-400 transition-colors flex items-center justify-center gap-2"
            >
              <FaTimes className="text-sm" />
              Hủy
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <FaEnvelope className="text-blue-500" />
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium">{profile.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <FaPhone className="text-blue-500" />
            <div>
              <p className="text-sm text-gray-600">Số điện thoại</p>
              <p className="font-medium">{profile.phone_number}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <FaCalendar className="text-blue-500" />
            <div>
              <p className="text-sm text-gray-600">Ngày tạo</p>
              <p className="font-medium">
                {profile.created_at ? new Date(profile.created_at).toLocaleDateString('vi-VN') : '-'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <FaShieldAlt className="text-blue-500" />
            <div>
              <p className="text-sm text-gray-600">Trạng thái</p>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                profile.status === "active" 
                  ? "bg-green-100 text-green-700" 
                  : "bg-red-100 text-red-700"
              }`}>
                {profile.status === "active" ? "Đang hoạt động" : "Ngừng hoạt động"}
              </span>
            </div>
          </div>
          <button 
            onClick={onEditClick} 
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-3 rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <FaEdit className="text-sm" />
            Chỉnh sửa thông tin
          </button>
        </div>
      )}
    </div>
  );
} 