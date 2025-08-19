'use client';
import { useState, useEffect } from 'react';
import { FaTimes, FaUser, FaGraduationCap, FaClipboardList, FaSave, FaHourglassHalf } from 'react-icons/fa';
import { nursingSpecialistServiceTypeService } from '@/services/api';

const EditSpecialistModal = ({ specialist, onClose, onUpdate, zones, refetchSpecialists, serviceTypes = [] }) => {
  const [formData, setFormData] = useState({
    accountID: specialist.accountID,
    nursingID: specialist.nursingID,
    fullName: specialist.fullName || '',
    password: specialist.password || 'string',
    avatarUrl: specialist.avatarUrl || 'string',
    createAt: specialist.createAt || new Date().toISOString(),
    deletedAt: specialist.deletedAt || null,
    gender: specialist.gender || 'Nam',
    dateOfBirth: specialist.dateOfBirth ? specialist.dateOfBirth.split('T')[0] : '',
    address: specialist.address || '',
    experience: specialist.experience || '',
    slogan: specialist.slogan || '',
    zoneID: specialist.zoneID || '',
    major: specialist.major || 'Specialist',
    status: specialist.status || 'active',
    serviceID: Array.isArray(specialist.serviceIDs) ? specialist.serviceIDs.map(String) : []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [registeredServiceIDs, setRegisteredServiceIDs] = useState([]);

  useEffect(() => {
    setFormData({
      accountID: specialist.accountID,
      nursingID: specialist.nursingID,
      fullName: specialist.fullName || '',
      password: specialist.password || 'string',
      avatarUrl: specialist.avatarUrl || 'string',
      createAt: specialist.createAt || new Date().toISOString(),
      deletedAt: specialist.deletedAt || null,
      gender: specialist.gender || 'Nam',
      dateOfBirth: specialist.dateOfBirth ? specialist.dateOfBirth.split('T')[0] : '',
      address: specialist.address || '',
      experience: specialist.experience || '',
      slogan: specialist.slogan || '',
      zoneID: specialist.zoneID || '',
      major: specialist.major || 'Specialist',
      status: specialist.status || 'active',
      serviceID: Array.isArray(specialist.serviceIDs) ? specialist.serviceIDs.map(String) : []
    });
  }, [specialist]);

  // Fetch các dịch vụ đã được thêm theo nursingID để highlight
  useEffect(() => {
    const fetchRegisteredServices = async () => {
      try {
        if (!specialist?.nursingID) return;
        const result = await nursingSpecialistServiceTypeService.getByNursing(specialist.nursingID);
        const ids = Array.isArray(result) ? result.map(item => String(item.serviceID)) : [];
        setRegisteredServiceIDs(ids);
      } catch (err) {
        // Không chặn UI nếu lỗi
      }
    };
    fetchRegisteredServices();
  }, [specialist?.nursingID]);

  const handleChange = (e) => {
    const { name, value, multiple, options } = e.target;
    if (multiple) {
      const values = Array.from(options)
        .filter(option => option.selected)
        .map(option => option.value);
      setFormData(prev => ({
        ...prev,
        [name]: values
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate required fields
      if (!formData.fullName) {
        throw new Error('Vui lòng điền đầy đủ thông tin bắt buộc');
      }

      await onUpdate(specialist.nursingID, formData);

      // Gọi API mapping dịch vụ nếu có chọn dịch vụ
      if (formData.serviceID && formData.serviceID.length > 0) {
        await nursingSpecialistServiceTypeService.create({
          nursingID: specialist.nursingID,
          serviceIDs: formData.serviceID
        });
      }
      // Gọi callback reload danh sách chuyên gia nếu có
      if (typeof refetchSpecialists === 'function') {
        await refetchSpecialists();
      }
      onClose();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[80vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-8 py-6">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold text-gray-900">Sửa thông tin Chuyên gia</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-2 rounded-full hover:bg-gray-100"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>
        </div>
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Account Information */}
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h4 className="text-base font-semibold mb-4 text-gray-800 flex items-center gap-2">
                <FaUser className="text-gray-500" />
                Thông tin tài khoản
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-0">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-300 focus:border-gray-300 transition-colors duration-200 bg-gray-50 focus:bg-white"
                    required
                  />
                </div>
              </div>
            </section>

            {/* Professional Information */}
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h4 className="text-base font-semibold mb-4 text-gray-800 flex items-center gap-2">
                <FaGraduationCap className="text-gray-500" />
                Thông tin chuyên môn
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-0">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kinh nghiệm
                  </label>
                  <input
                    type="text"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-300 focus:border-gray-300 transition-colors duration-200 bg-gray-50 focus:bg-white"
                    placeholder="VD: 5 năm, 10 năm..."
                  />
                </div>

                <div className="bg-white rounded-lg p-0">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slogan
                  </label>
                  <input
                    type="text"
                    name="slogan"
                    value={formData.slogan}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-300 focus:border-gray-300 transition-colors duration-200 bg-gray-50 focus:bg-white"
                    placeholder="VD: Chăm sóc tận tình..."
                  />
                </div>

                <div className="bg-white rounded-lg p-0">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chuyên môn
                  </label>
                  <select
                    name="major"
                    value={formData.major}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-300 focus:border-gray-300 transition-colors duration-200 bg-gray-50 focus:bg-white"
                  >
                    <option value="specialist">Chuyên gia</option>
                    <option value="nurse">Y tá</option>
                  </select>
                </div>

                <div className="bg-white rounded-lg p-0">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Khu vực
                  </label>
                  <select
                    name="zoneID"
                    value={formData.zoneID}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-300 focus:border-gray-300 transition-colors duration-200 bg-gray-50 focus:bg-white"
                  >
                    {zones.map(zone => (
                      <option key={zone.zoneID} value={zone.zoneID}>
                        {zone.zoneName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="bg-white rounded-lg p-0 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dịch vụ
                  </label>
                  <div className="flex flex-col gap-2">
                    {Array.isArray(serviceTypes) &&
                      serviceTypes
                        .filter(service => service.isPackage === false)
                        .map(service => {
                          const isChecked = Array.isArray(formData.serviceID) && formData.serviceID.includes(String(service.serviceID));
                          const isRegistered = Array.isArray(registeredServiceIDs) && registeredServiceIDs.includes(String(service.serviceID));
                          return (
                            <label key={service.serviceID} className="inline-flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="serviceID"
                                value={service.serviceID}
                                checked={isChecked}
                                onChange={e => {
                                  const value = e.target.value;
                                  setFormData(prev => {
                                    const current = Array.isArray(prev.serviceID) ? prev.serviceID.map(String) : [];
                                    if (e.target.checked) {
                                      if (!current.includes(value)) {
                                        return { ...prev, serviceID: [...current, value] };
                                      }
                                      return prev;
                                    } else {
                                      return { ...prev, serviceID: current.filter(id => id !== value) };
                                    }
                                  });
                                }}
                                className="form-checkbox h-4 w-4 text-purple-600"
                              />
                              <span className={isRegistered ? "font-bold text-red-600" : ""}>
                                {service.serviceName}
                                {isRegistered && (
                                  <span className="ml-2 text-xs text-red-600">(dịch vụ đã được thêm)</span>
                                )}
                              </span>
                            </label>
                          );
                        })
                    }
                  </div>
                </div>
              </div>
            </section>

            {/* Personal Information */}
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h4 className="text-base font-semibold mb-4 text-gray-800 flex items-center gap-2">
                <FaUser className="text-gray-500" />
                Thông tin cá nhân
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-0">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giới tính
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-300 focus:border-gray-300 transition-colors duration-200 bg-gray-50 focus:bg-white"
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                </div>

                <div className="bg-white rounded-lg p-0">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ngày sinh
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-300 focus:border-gray-300 transition-colors duration-200 bg-gray-50 focus:bg-white"
                  />
                </div>

                <div className="bg-white rounded-lg p-0 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Địa chỉ
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-300 focus:border-gray-300 transition-colors duration-200 bg-gray-50 focus:bg-white"
                    placeholder="Số nhà, đường, phường, quận, thành phố"
                  />
                </div>
              </div>
            </section>

            {/* Avatar Information */}
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h4 className="text-base font-semibold mb-4 text-gray-800 flex items-center gap-2">
                <FaClipboardList className="text-gray-500" />
                Thông tin bổ sung
              </h4>
              <div className="bg-white rounded-lg p-0">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Avatar URL
                </label>
                <input
                  type="text"
                  name="avatarUrl"
                  value={formData.avatarUrl}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-300 focus:border-gray-300 transition-colors duration-200 bg-gray-50 focus:bg-white"
                  placeholder="URL hình ảnh (tùy chọn)"
                />
              </div>
            </section>
          </div>

          {/* Action Buttons */}
          <div className="sticky bottom-0 bg-white border-t border-gray-100 px-8 py-6">
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 font-semibold"
                disabled={loading}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-5 py-3 bg-gray-900 text-white rounded-lg hover:bg-black/80 transition-all duration-200 font-semibold shadow-sm disabled:opacity-50"
                disabled={loading}
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2"><FaHourglassHalf /> Đang cập nhật...</span>
                ) : (
                  <span className="inline-flex items-center gap-2"><FaSave /> Cập nhật</span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSpecialistModal;