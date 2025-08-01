import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, faEnvelope, faPhone,
  faSave, faTimes, faEdit, faEye,
  faUserMd, faShieldAlt, faClock, faExclamationCircle
} from '@fortawesome/free-solid-svg-icons';
import accountService from '@/services/api/accountService';
import zoneService from '@/services/api/zoneService';

const ManagerDetailModal = ({ show, manager, onClose, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [managerData, setManagerData] = useState(null);
  const [zones, setZones] = useState([]);

  // Fetch manager và zones khi mở modal
  React.useEffect(() => {
    if (show && manager?.accountID) {
      setLoading(true);
      Promise.all([
        accountService.getManagerById(manager.accountID),
        zoneService.getZones()
      ]).then(([mgr, zs]) => {
        setManagerData(mgr);
        setZones(zs);
        setFormData({
          fullName: mgr.fullName || '',
          email: mgr.email || '',
          phoneNumber: mgr.phoneNumber || '',
          status: mgr.status || 'active',
        });
      }).finally(() => setLoading(false));
    }
  }, [show, manager]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Tên không được để trống';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email không được để trống';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Số điện thoại không được để trống';
    } else if (!/^[0-9]{10,11}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Số điện thoại không hợp lệ';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Sử dụng ID từ manager prop hoặc managerData
      const managerId = manager?.id || manager?.accountID || managerData?.id || managerData?.accountID;
      
      const updatedManager = {
        ...managerData,
        ...formData,
        updatedAt: new Date().toISOString(),
      };

      await accountService.updateManager(managerId, updatedManager);
      alert('Cập nhật manager thành công!');
      setIsEditing(false);
      
      // Cập nhật dữ liệu local với thông tin mới
      setManagerData(updatedManager);
      
      // Cập nhật formData với dữ liệu mới
      setFormData({
        fullName: updatedManager.fullName || '',
        email: updatedManager.email || '',
        phoneNumber: updatedManager.phoneNumber || '',
        status: updatedManager.status || 'active',
      });
      
      // Fetch lại thông tin manager mới nhất từ backend
      try {
        const freshManager = await accountService.getManagerById(managerId);
        setManagerData(freshManager);
      } catch (fetchError) {
        // Ignore fetch error, use updated data
      }
      
      if (onSave) {
        onSave(managerId, updatedManager);
      }
    } catch (error) {
      alert('Cập nhật manager thất bại!');
      console.error('Error updating manager:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Tìm khu vực mà Manager đang quản lý (đồng bộ với ManagerTab.js)
  const getManagedZone = (managerId) => {
    const zone = zones.find(z => z.managerID === managerId);
    return zone;
  };

  // Kiểm tra manager đã được khôi phục
  const isRestoredManager = (manager) => {
    return manager?.deletedAt && manager?.status === 'active';
  };

  // Hàm lấy trạng thái hiển thị cho manager
  const getManagerStatus = (manager) => {
    if (isRestoredManager(manager)) {
      return {
        text: 'Đã khôi phục',
        color: 'bg-yellow-100 text-yellow-700',
        description: 'Manager này đã được khôi phục sau khi xóa'
      };
    }
    
    if (manager?.status === 'active') {
      return {
        text: 'Hoạt động',
        color: 'bg-green-100 text-green-700',
        description: 'Manager đang hoạt động bình thường'
      };
    }
    
    return {
      text: 'Tạm khóa',
      color: 'bg-red-100 text-red-700',
      description: 'Manager đã bị tạm khóa'
    };
  };

  const getStatusText = (status) => {
    return status === 'active' ? 'Hoạt động' : 'Tạm khóa';
  };

  if (!show || !manager) return null;
  if (loading || !managerData) return (<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"><div className="bg-white p-8 rounded-xl">Đang tải dữ liệu...</div></div>);

  // Lấy khu vực quản lý hiện tại của Manager (đồng bộ với ManagerTab)
  const currentManagedZone = getManagedZone(managerData.accountID);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl p-8 relative max-h-[90vh] overflow-y-auto">
        <button 
          className="absolute top-4 right-4 text-gray-400 hover:text-pink-500 text-2xl font-bold z-10" 
          onClick={onClose}
        >
          &times;
        </button>
        
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
              Chi tiết Manager
            </h3>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold hover:shadow-lg transition-all duration-300 flex items-center"
            >
              <FontAwesomeIcon icon={isEditing ? faEye : faEdit} className="mr-2" />
              {isEditing ? 'Xem' : 'Chỉnh sửa'}
            </button>
          </div>
          <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Header Info */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {managerData.fullName?.charAt(0) || 'M'}
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-800">{managerData.fullName}</h4>
                <p className="text-gray-600">{managerData.email}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    getManagerStatus(managerData).color
                  }`} title={getManagerStatus(managerData).description}>
                    {getManagerStatus(managerData).text}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                    Manager
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Thông tin cá nhân */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-800 flex items-center">
                <FontAwesomeIcon icon={faUser} className="mr-2 text-purple-500" />
                Thông tin cá nhân
              </h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FontAwesomeIcon icon={faUser} className="mr-2 text-purple-500" />
                    Họ và tên
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                        errors.fullName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Nhập họ và tên"
                    />
                  ) : (
                    <p className="px-4 py-3 bg-gray-50 rounded-xl">{managerData.fullName}</p>
                  )}
                  {errors.fullName && (
                    <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FontAwesomeIcon icon={faEnvelope} className="mr-2 text-purple-500" />
                    Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="example@email.com"
                    />
                  ) : (
                    <p className="px-4 py-3 bg-gray-50 rounded-xl">{managerData.email}</p>
                  )}
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FontAwesomeIcon icon={faPhone} className="mr-2 text-purple-500" />
                    Số điện thoại
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                        errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="0123456789"
                    />
                  ) : (
                    <p className="px-4 py-3 bg-gray-50 rounded-xl">{managerData.phoneNumber || 'Chưa cập nhật'}</p>
                  )}
                  {errors.phoneNumber && (
                    <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Thông tin quản lý */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-800 flex items-center">
                <FontAwesomeIcon icon={faUserMd} className="mr-2 text-purple-500" />
                Thông tin quản lý
              </h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Khu vực quản lý
                  </label>
                  <p className="px-4 py-3 bg-gray-50 rounded-xl">
                    {currentManagedZone ? currentManagedZone.zoneName : 'Chưa phân công'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    * Khu vực quản lý chỉ có thể thay đổi bởi Admin
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FontAwesomeIcon icon={faShieldAlt} className="mr-2 text-purple-500" />
                    Trạng thái
                  </label>
                  {isEditing ? (
                    <select
                      value={formData.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="active">Hoạt động</option>
                      <option value="inactive">Tạm khóa</option>
                    </select>
                  ) : (
                    <p className="px-4 py-3 bg-gray-50 rounded-xl">{getStatusText(managerData.status)}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FontAwesomeIcon icon={faClock} className="mr-2 text-purple-500" />
                    Ngày tạo tài khoản
                  </label>
                  <p className="px-4 py-3 bg-gray-50 rounded-xl">
                    {managerData.createAt ? new Date(managerData.createAt).toLocaleString('vi-VN') : 'Chưa cập nhật'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FontAwesomeIcon icon={faClock} className="mr-2 text-purple-500" />
                    Cập nhật lần cuối
                  </label>
                  <p className="px-4 py-3 bg-gray-50 rounded-xl">
                    {managerData.updatedAt ? new Date(managerData.updatedAt).toLocaleString('vi-VN') : 'Chưa cập nhật'}
                  </p>
                </div>

                {/* Thông tin khôi phục cho manager đã khôi phục */}
                {isRestoredManager(managerData) && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <FontAwesomeIcon icon={faExclamationCircle} className="text-yellow-600" />
                      <span className="text-sm font-semibold text-yellow-800">Thông tin khôi phục</span>
                    </div>
                    <div className="text-sm text-yellow-700 space-y-1">
                      <p>• Manager này đã được khôi phục sau khi bị xóa</p>
                      <p>• Ngày xóa: {new Date(managerData.deletedAt).toLocaleString('vi-VN')}</p>
                      <p>• Lưu ý: Manager này có thể không thể xóa lại được</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Buttons */}
          {isEditing && (
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-6 py-3 rounded-xl bg-gray-500 text-white font-semibold hover:bg-gray-600 transition-all duration-300"
              >
                <FontAwesomeIcon icon={faTimes} className="mr-2" />
                Hủy
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-60 flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faSave} className="mr-2" />
                    Lưu thay đổi
                  </>
                )}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ManagerDetailModal; 