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
  const [errors, setErrors] = useState({});

  // Fetch zones và zone details từ API thật khi mở modal
  useEffect(() => {
    if (show) {
      setLoading(true);
      Promise.all([
        zoneService.getZones(),
        zoneDetailService.getZoneDetails()
      ])
        .then(([zonesData, zoneDetailsData]) => {
          setZones(zonesData || []);
          setZoneDetails(zoneDetailsData || []);
        })
        .catch((error) => {
          console.error('Error fetching zones data:', error);
          setZones([]);
          setZoneDetails([]);
        })
        .finally(() => setLoading(false));
    }
  }, [show]);

  if (!show) return null;

  const handleAvatarUrlChange = (e) => {
    setAvatarUrl(e.target.value);
  };
  const roleLabels = {
    Nurse: 'Chuyên viên chăm sóc',
    Specialist: 'Chuyên viên tư vấn',
  };

  const handleRoleChange = (e) => {
    const value = e.target.value;
    setRole(value);
    setMajor(value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation helpers and exact rules requested
    const emailRegex = /[^\s@]+@[^\s@]+\.[^\s@]+/;
    const phoneRegex = /^0\d{8,9}$/; // starts with 0 and has 9-10 digits total
  const isValidUrl = (v) => /^(https?:\/\/).+/.test(String(v));
  // experience can be any string per request; no numeric validation enforced
  const isPositiveNumber = (v) => true;

    // Họ tên: không để trống và phải từ 2 ký tự trở lên
    const newErrors = {};
    if (!fullName || String(fullName).trim().length < 2) {
      newErrors.fullName = 'Họ tên không hợp lệ. Vui lòng nhập ít nhất 2 ký tự.';
    }

    // Email format
    if (!email || !emailRegex.test(String(email))) {
      newErrors.email = 'Email không hợp lệ.';
    }

    // Số điện thoại: bắt đầu từ 0 và có 9-10 chữ số
    if (!phone || !phoneRegex.test(String(phone))) {
      newErrors.phone = 'Số điện thoại không hợp lệ. Phải bắt đầu bằng 0 và có 9-10 chữ số.';
    }

    // Validation mật khẩu mạnh (stepwise messages)
    const pwd = password || '';
    if (pwd.length < 8) {
      newErrors.password = 'Mật khẩu phải có ít nhất 8 ký tự';
    } else if (!/[a-z]/.test(pwd)) {
      newErrors.password = 'Mật khẩu phải có ít nhất 1 chữ thường [a-z]';
    } else if (!/[A-Z]/.test(pwd)) {
      newErrors.password = 'Mật khẩu phải có ít nhất 1 chữ hoa [A-Z]';
    } else if (!/[0-9]/.test(pwd)) {
      newErrors.password = 'Mật khẩu phải có ít nhất 1 số [0-9]';
    } else if (!/[!@#$%^&*]/.test(pwd)) {
      newErrors.password = 'Mật khẩu phải có ít nhất 1 ký tự đặc biệt [!@#$%^&*]';
    }

    if (avatarUrl && !isValidUrl(avatarUrl)) {
      newErrors.avatarUrl = 'URL ảnh đại diện không hợp lệ. Vui lòng nhập URL bắt đầu bằng http:// hoặc https://';
    }
    if (role === 'Nurse' || role === 'Specialist') {
      // Role-specific validation
      if (!gender) {
        newErrors.gender = 'Vui lòng chọn Giới tính cho Nurse/Specialist.';
      }
      if (!dob) {
        newErrors.dob = 'Vui lòng chọn Ngày sinh cho Nurse/Specialist.';
      }
      if (!zoneId) {
        newErrors.zoneId = 'Vui lòng chọn Khu vực làm việc cho Nurse/Specialist.';
      }
      // Experience: allow any string (not enforcing numeric format)
    }

    // If there are validation errors so far, set them and bail out
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Duplicate email check via getAllAccounts
    try {
      setLoading(true);
      const allAccounts = await accountService.getAllAccounts();
      const emailExists = Array.isArray(allAccounts) && allAccounts.some(acc => String(acc.email || acc.Email || '').toLowerCase() === String(email).toLowerCase());
      if (emailExists) {
        setErrors({ email: 'Email đã tồn tại trong hệ thống' });
        setLoading(false);
        return;
      }
    } catch (err) {
      // If the check fails, set a generic error but allow proceeding if you prefer
      console.error('Email duplicate check failed:', err);
      // fallthrough — we still allow submit to try and backend will reject if duplicate
    }

    try {
      if (role === 'Nurse' || role === 'Specialist') {
        // Chuẩn hóa dữ liệu gửi lên API
        const data = {
          fullName: fullName,
          phoneNumber: phone,
          email: email,
          password: password,
          avatarUrl: avatarUrl || defaultAvatarUrl,
          dateOfBirth: dob,
          address: address,
          gender: gender,
          major: major,
          experience: experience,
          slogan: slogan,
          zoneID: Number(zoneId),
          status: 'active', // Đảm bảo luôn active khi tạo mới
        };
        const result = await accountService.registerNursingSpecialist(data);
        // clear errors and loading
        setErrors({});
        setLoading(false);
        alert(result.message || 'Tạo tài khoản nurse specialist thành công!');
        if (onSubmit) onSubmit();
      } else {
        const accountData = {
          full_name: fullName,
          email,
          phone_number: phone,
          avatar_url: avatarUrl || defaultAvatarUrl,
          role_id: role === 'Nurse' ? 2 : 2,
          role_name: role === 'Nurse' ? 'Nurse' : 'Specialist',
          status: 'active',
          password,
        };
        setErrors({});
        setLoading(false);
        if (onSubmit) onSubmit(accountData);
      }

      // reset
      setAvatarUrl(''); setFullName(''); setEmail(''); setPhone(''); setRole(''); setPassword('');
      setZoneId(''); setGender(''); setDob(''); setMajor(''); setExperience(''); setSlogan(''); setAddress('');
      if (onClose) onClose();
    } catch (err) {
      console.error('Submit error:', err);
      setLoading(false);
      setErrors({ form: 'Tạo tài khoản thất bại. Vui lòng thử lại.' });
    }
  };

  // Default avatars by gender (used when no custom URL provided)
  const DEFAULT_MALE = 'https://i.ibb.co/zWchkWb9/bae8ac1e948df3e40f745095485a1351.jpg';
  const DEFAULT_FEMALE = 'https://i.ibb.co/qX4Pprh/ae4af3fa63764c2b2d27ff9a35f7097a.jpg';
  const defaultAvatarUrl = gender === 'Nam' ? DEFAULT_MALE : gender === 'Nữ' ? DEFAULT_FEMALE : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm overflow-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-4 relative my-6 mx-2">
        {/* Header */}
        <div className="top-0 bg-white z-10 flex items-center justify-between border-b border-gray-100 pb-2 mb-4">
          <h3 className="text-lg md:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">Tạo tài khoản mới</h3>
          <button
            className="ml-2 text-gray-400 hover:text-pink-500 text-2xl font-bold"
            onClick={onClose}
            aria-label="Đóng"
            type="button"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ảnh đại diện (URL)</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400"
                placeholder="URL (không bắt buộc)"
                value={avatarUrl}
                onChange={e => { handleAvatarUrlChange(e); setErrors(prev => ({ ...prev, avatarUrl: undefined })); }}
              />
              {errors.avatarUrl && <p className="text-xs text-red-500 mt-1">{errors.avatarUrl}</p>}

              <div className="mt-3 text-center">
                <img
                  src={avatarUrl || defaultAvatarUrl || '/images/logo.png'}
                  alt="avatar-preview"
                  className="w-20 h-20 rounded-full object-cover border-2 border-pink-200 mx-auto"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400"
                placeholder="Nhập họ và tên"
                value={fullName}
                onChange={e => { setFullName(e.target.value); setErrors(prev => ({ ...prev, fullName: undefined })); }}
              />
              {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}

              <label className="block text-sm font-medium text-gray-700 mb-1 mt-3">Email</label>
              <input
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400"
                placeholder="Nhập email"
                value={email}
                onChange={e => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: undefined })); }}
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400"
                placeholder="Nhập số điện thoại"
                value={phone}
                onChange={e => { setPhone(e.target.value); setErrors(prev => ({ ...prev, phone: undefined })); }}
              />
              {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
              <input
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400"
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={e => { setPassword(e.target.value); setErrors(prev => ({ ...prev, password: undefined })); }}
              />
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vai trò</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400"
                value={role}
                onChange={e => { handleRoleChange(e); setErrors(prev => ({ ...prev, role: undefined })); }}
              >
                <option value="" hidden>Chọn vai trò</option>
                <option value="Nurse">Chuyên viên chăm sóc</option>
                <option value="Specialist">Chuyên viên tư vấn</option>
              </select>
              {errors.role && <p className="text-xs text-red-500 mt-1">{errors.role}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Giới tính</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400"
                value={gender}
                onChange={e => { setGender(e.target.value); setErrors(prev => ({ ...prev, gender: undefined })); }}
              >
                <option value="" hidden>Chọn giới tính</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
              {errors.gender && <p className="text-xs text-red-500 mt-1">{errors.gender}</p>}
            </div>
          </div>

          {(role === 'Nurse' || role === 'Specialist') && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 space-y-3">
              <div className="font-semibold text-purple-700">Thông tin chuyên môn</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Khu vực làm việc (Quận)</label>
                  <select
                    required
                    className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-purple-300"
                    value={zoneId}
                    onChange={e => { setZoneId(e.target.value); setErrors(prev => ({ ...prev, zoneId: undefined })); }}
                  >
                    <option value="" hidden>Chọn khu vực</option>
                    {zones && zones.filter(z => z && z.zoneID && z.zoneName).map(z => (
                      <option key={String(z.zoneID)} value={z.zoneID}>{z.zoneName}</option>
                    ))}
                  </select>
                  {errors.zoneId && <p className="text-xs text-red-500 mt-1">{errors.zoneId}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Ngày sinh</label>
                  <input
                    type="date"
                    required
                    className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-purple-300"
                    value={dob}
                    onChange={e => { setDob(e.target.value); setErrors(prev => ({ ...prev, dob: undefined })); }}
                  />
                  {errors.dob && <p className="text-xs text-red-500 mt-1">{errors.dob}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Chuyên ngành</label>
                  <input
                    type="text"
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
                    className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-purple-300"
                    placeholder="Nhập số năm kinh nghiệm"
                    value={experience}
                    onChange={e => setExperience(e.target.value)}
                  />
                  {errors.experience && <p className="text-xs text-red-500 mt-1">{errors.experience}</p>}
                </div>
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

              <div>
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
          )}

          {errors.form && <p className="text-sm text-red-600">{errors.form}</p>}

          <div className="flex items-center justify-end space-x-2">
            <button
              type="button"
              className="px-4 py-2 rounded bg-gray-100 text-gray-700"
              onClick={onClose}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded bg-purple-600 text-white disabled:opacity-60"
            >
              {loading ? 'Đang xử lý...' : 'Tạo tài khoản'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserModal;