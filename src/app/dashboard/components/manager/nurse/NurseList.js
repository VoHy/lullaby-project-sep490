import { useState } from 'react';
import { FaUserNurse, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import NurseDetailModal from './NurseDetailModal';

const NurseList = ({ nurses, onEdit, onDelete }) => {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedNurseForDetail, setSelectedNurseForDetail] = useState(null);
  const handleDelete = (nurse) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa y tá "${nurse.fullName}"?`)) {
      onDelete(nurse.nursingID, nurse.accountID);
    }
  };

    return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
    {nurses.length === 0 ? (
        <div className="text-center py-16">
      <FaUserNurse className="text-gray-300 text-8xl mb-6 mx-auto" />
          <h3 className="text-2xl font-bold text-gray-800 mb-3">
            Chưa có y tá nào
          </h3>
          <p className="text-gray-500 text-lg">
            Hãy thêm y tá đầu tiên vào khu vực quản lý của bạn.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gradient-to-r from-blue-50 to-indigo-50">
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
              {nurses.map((nurse) => (
                <tr key={nurse.nursingID} className="hover:bg-blue-50/50 transition-colors duration-200">
                  <td className="px-8 py-6 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg">
                          <span className="text-white font-bold text-lg">
                            {nurse.fullName?.charAt(0) || 'N'}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-base font-semibold text-gray-900">
                          {nurse.fullName}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {nurse.gender}
                          </span>
                          <span>•</span>
                          <span>{nurse.dateOfBirth ? new Date(nurse.dateOfBirth).toLocaleDateString('vi-VN') : 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{nurse.account?.phoneNumber || nurse.phoneNumber || 'N/A'}</div>
                    <div className="text-sm text-gray-500">{nurse.account?.email || nurse.email || 'N/A'}</div>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{nurse.experience || 'N/A'}</div>
                    <div className="text-sm text-gray-500 italic">{nurse.slogan || 'N/A'}</div>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full shadow-sm ${
                      nurse.status === 'active' 
                        ? 'bg-green-100 text-green-800 border border-green-200' 
                        : 'bg-red-100 text-red-800 border border-red-200'
                    }`}>
                      {nurse.status === 'active' ? 'Đang hoạt động' : 'Không hoạt động'}
                    </span>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => {
                          setSelectedNurseForDetail(nurse);
                          setShowDetailModal(true);
                        }}
                        className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors duration-200"
                      >
                        <FaEye className="mr-1" />
                        Xem chi tiết
                      </button>
                      <button
                        onClick={() => onEdit(nurse)}
                        className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                      >
                        <FaEdit className="mr-1" />
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(nurse)}
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
       {showDetailModal && selectedNurseForDetail && (
         <NurseDetailModal
           nurse={selectedNurseForDetail}
           onClose={() => {
             setShowDetailModal(false);
             setSelectedNurseForDetail(null);
           }}
         />
       )}
     </div>
   );
 };

export default NurseList; 