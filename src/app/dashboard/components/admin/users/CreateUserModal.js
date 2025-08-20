import { useState, useEffect } from 'react';
import accountService from '@/services/api/accountService';
import zoneService from '@/services/api/zoneService';
import zoneDetailService from '@/services/api/zoneDetailService';

const CreateUserModal = ({ show, onClose, onSubmit }) => {
  const [avatarUrl, setAvatarUrl] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('');
  const [password, setPassword] = useState('');
  // Thông tin chuyên môn
  const [zoneId, setZoneId] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');
  const [major, setMajor] = useState('');
  const [experience, setExperience] = useState('');
  const [slogan, setSlogan] = useState('');
  const [address, setAddress] = useState('');
  const [zones, setZones] = useState([]);
  const [zoneDetails, setZoneDetails] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch zones và zone details từ API thật khi mở modal
  useEffect(() => {
    if (show) {
      setLoading(true);
      Promise.all([
        zoneService.getZones(),
        zoneDetailService.getZoneDetails()
      ])
        .then(([zonesData, zoneDetailsData]) => {
          setZones(zonesData);
          setZoneDetails(zoneDetailsData);
        })
        .catch((error) => {
          console.error('Error fetching zones data:', error);
          setZones([]);
          setZoneDetails([]);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [show]);

  if (!show) return null;

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
        setAvatarUrl('');
      };
      reader.readAsDataURL(file);
    }
  };
  const handleAvatarUrlChange = (e) => {
    setAvatarUrl(e.target.value);
    setAvatarPreview('');
  };
  const roleLabels = {
    Nurse: 'Chuyên gia chăm sóc',
    Specialist: 'Chuyên gia tư vấn',
  };

  const handleRoleChange = (e) => {
    const value = e.target.value;
    setRole(value);
    setMajor(value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (role === 'Nurse' || role === 'Specialist') {
      // Chuẩn hóa dữ liệu gửi lên API
      const data = {
        fullName: fullName,
        phoneNumber: phone,
        email: email,
        password: password,
        avatarUrl: avatarUrl || avatarPreview,
        dateOfBirth: dob,
        address: address,
        gender: gender,
        major: major,
        experience: experience,
        slogan: slogan,
        zoneID: Number(zoneId),
        status: 'active', // Đảm bảo luôn active khi tạo mới
      };
      try {
        const result = await accountService.registerNursingSpecialist(data);
        alert(result.message || 'Tạo tài khoản nurse specialist thành công!');
        if (onSubmit) onSubmit();
      } catch (err) {
        alert('Tạo tài khoản nurse specialist thất bại!');
      }
    } else {
      const accountData = {
        full_name: fullName,
        email,
        phone_number: phone,
        avatar_url: avatarUrl || avatarPreview,
        role_id: role === 'Nurse' ? 2 : 2,
        role_name: role === 'Nurse' ? 'Nurse' : 'Specialist',
        status: 'active',
        password,
      };
      if (onSubmit) onSubmit(accountData);
    }
    // Reset form
    setAvatarUrl(''); setFullName(''); setEmail(''); setPhone(''); setRole(''); setAvatarPreview(''); setPassword('');
    setZoneId(''); setGender(''); setDob(''); setMajor(''); setExperience(''); setSlogan(''); setAddress('');
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm overflow-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-2 md:p-4 relative my-6 mx-2">
        {/* Sticky tiêu đề + nút đóng */}
        <div className="top-0 bg-white z-10 flex items-center justify-between border-b border-gray-100 pb-2 mb-2">
          <h3 className="text-lg md:text-xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 flex-1">Tạo tài khoản mới</h3>
          <button
            className="ml-2 text-gray-400 hover:text-pink-500 text-2xl font-bold"
            onClick={onClose}
            aria-label="Đóng"
            type="button"
          >
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 items-start">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400"
                  placeholder="Nhập họ và tên"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400"
                  placeholder="Nhập email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400"
                  placeholder="Nhập số điện thoại"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
                <input
                  type="password"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400"
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vai trò</label>
                <select
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400"
                  value={role}
                  onChange={handleRoleChange}
                >
                  <option value="" hidden>Chọn vai trò</option>
                  <option value="Nurse">Chuyên gia chăm sóc</option>
                  <option value="Specialist">Chuyên gia tư vấn</option>
                </select>
              </div>
            </div>
            {/* Avatar */}
            <div className="flex flex-col items-center gap-1 bg-purple-50 border border-purple-100 rounded-lg p-2 shadow-sm">
              <label className="block text-xs font-medium mb-1 text-gray-600">Ảnh đại diện</label>
              <div className="relative w-20 h-20 mb-1">
                <img src={avatarPreview || avatarUrl || "/images/logo-eldora.png"} alt="avatar" className="w-20 h-20 rounded-full object-cover border-2 border-pink-200 mx-auto" />
                <label className="absolute bottom-0 right-0 bg-pink-500 text-white rounded-full p-1 cursor-pointer shadow-md hover:bg-pink-600 transition" title="Đổi ảnh">
                  <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487a2.25 2.25 0 1 1 3.182 3.182M6.75 21h10.5A2.25 2.25 0 0 0 19.5 18.75V8.25A2.25 2.25 0 0 0 17.25 6H6.75A2.25 2.25 0 0 0 4.5 8.25v10.5A2.25 2.25 0 0 0 6.75 21z" />
                  </svg>
                </label>
              </div>
              <input
                type="text"
                className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400"
                placeholder="Dán URL ảnh đại diện"
                value={avatarUrl}
                onChange={handleAvatarUrlChange}
              />
            </div>
          </div>
          {/* Card chuyên môn full width */}
          {(role === 'Nurse' || role === 'Specialist') && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-2 mt-2 space-y-2 shadow-sm">
              <div className="font-semibold text-purple-700 mb-1 text-base">Thông tin chuyên môn</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Khu vực làm việc (Quận)</label>
                  <select
                    required
                    className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-purple-300"
                    value={zoneId}
                    onChange={e => setZoneId(e.target.value)}
                  >
                    <option value="" hidden>Chọn khu vực</option>
                    {zones
                      .filter(z => z && z.zoneID && z.zoneName)
                      .map(z => (
                        <option key={String(z.zoneID)} value={z.zoneID}>
                          {z.zoneName}
                        </option>
                      ))}
                  </select>
                  {zones.length === 0 && (
                    <p className="text-xs text-red-500 mt-1">Không có dữ liệu khu vực</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Giới tính</label>
                  <select
                    required
                    className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-purple-300"
                    value={gender}
                    onChange={e => setGender(e.target.value)}
                  >
                    <option value="" hidden>Chọn giới tính</option>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Ngày sinh</label>
                  <input
                    type="date"
                    required
                    className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-purple-300"
                    value={dob}
                    onChange={e => setDob(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Chuyên ngành</label>
                  <input
                    type="text"
                    required
                    className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-purple-300"
                    placeholder="Nhập chuyên ngành"
                    value={roleLabels[major] || ''}
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Kinh nghiệm (năm)</label>
                  <input
                    type="text"
                    required
                    className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-purple-300"
                    placeholder="Nhập số năm kinh nghiệm"
                    value={experience}
                    onChange={e => setExperience(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Slogan</label>
                  <input
                    type="text"
                    className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-purple-300"
                    placeholder="Nhập slogan"
                    value={slogan}
                    onChange={e => setSlogan(e.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Địa chỉ</label>
                  <input
                    type="text"
                    className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-purple-300"
                    placeholder="Nhập địa chỉ làm việc"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
          {/* Nút lưu */}
          <div className="pt-2 flex flex-col md:flex-row md:justify-end">
            <button
              type="submit"
              className="w-full md:w-auto px-6 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:shadow-lg mt-2 md:mt-0"
            >
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserModal; 