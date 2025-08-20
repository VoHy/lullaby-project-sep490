import { useState } from 'react';
import { FaUserMd, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import SpecialistDetailModal from './SpecialistDetailModal';

const SpecialistList = ({ specialists, onEdit, onDelete }) => {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedSpecialistForDetail, setSelectedSpecialistForDetail] = useState(null);

  const handleDelete = (specialist) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa chuyên gia "${specialist.fullName}"?`)) {
      onDelete(specialist.nursingID, specialist.accountID);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
    {specialists.length === 0 ? (
        <div className="text-center py-16">
      <FaUserMd className="text-gray-300 text-8xl mb-6 mx-auto" />
          <h3 className="text-2xl font-bold text-gray-800 mb-3">
            Chưa có chuyên gia tư vấn nào
          </h3>
          <p className="text-gray-500 text-lg">
            Hãy thêm chuyên gia tư vấn đầu tiên vào khu vực quản lý của bạn.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gradient-to-r from-purple-50 to-pink-50">
              <tr>
                <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Thông tin
                </th>
                <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Liên hệ
                </th>
                <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Kinh nghiệm
                </th>
                <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-50">
              {specialists.map((specialist) => (
                <tr key={specialist.nursingID} className="hover:bg-purple-50/50 transition-colors duration-200">
                  <td className="px-8 py-6 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-600 flex items-center justify-center shadow-lg">
                          <span className="text-white font-bold text-lg">
                            {specialist.fullName?.charAt(0) || 'C'}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-base font-semibold text-gray-900">
                          {specialist.fullName}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {specialist.gender}
                          </span>
                          <span>•</span>
                          <span>{specialist.dateOfBirth ? new Date(specialist.dateOfBirth).toLocaleDateString('vi-VN') : 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{specialist.account?.phoneNumber || specialist.phoneNumber || 'N/A'}</div>
                    <div className="text-sm text-gray-500">{specialist.account?.email || specialist.email || 'N/A'}</div>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{specialist.experience || 'N/A'}</div>
                    <div className="text-sm text-gray-500 italic">{specialist.slogan || 'N/A'}</div>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full shadow-sm ${
                      specialist.status === 'active' 
                        ? 'bg-green-100 text-green-800 border border-green-200' 
                        : 'bg-red-100 text-red-800 border border-red-200'
                    }`}>
                      {specialist.status === 'active' ? 'Đang hoạt động' : 'Không hoạt động'}
                    </span>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => {
                          setSelectedSpecialistForDetail(specialist);
                          setShowDetailModal(true);
                        }}
                        className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors duration-200"
                      >
                        <FaEye className="mr-1" />
                        Xem chi tiết
                      </button>
                      <button
                        onClick={() => onEdit(specialist)}
                        className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-purple-700 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors duration-200"
                      >
                        <FaEdit className="mr-1" />
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(specialist)}
                        className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors duration-200"
                      >
                        <FaTrash className="mr-1" />
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedSpecialistForDetail && (
        <SpecialistDetailModal
          specialist={selectedSpecialistForDetail}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedSpecialistForDetail(null);
          }}
        />
      )}
    </div>
  );
};

export default SpecialistList; 