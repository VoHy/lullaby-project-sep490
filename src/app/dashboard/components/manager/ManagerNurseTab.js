'use client';
import { useState, useEffect, useContext } from 'react';
import { FaExclamationTriangle, FaPlus } from 'react-icons/fa';
import { AuthContext } from '@/context/AuthContext';
import nursingSpecialistService from '@/services/api/nursingSpecialistService';
import accountService from '@/services/api/accountService';
import zoneService from '@/services/api/zoneService';
import NurseList from './nurse/NurseList';
import NurseFilters from './nurse/NurseFilters';
import AddNurseModal from './nurse/AddNurseModal';
import EditNurseModal from './nurse/EditNurseModal';
import nursingSpecialistServiceTypeService from '@/services/api/nursingSpecialistServiceTypeService';
import serviceTypeService from '@/services/api/serviceTypeService';


const ManagerNurseTab = ({ refetchNurses, nurses, zones, managedZone, loading, error }) => {
  const [serviceTypes, setServiceTypes] = useState([]);

  // Lấy danh sách dịch vụ khi component mount
  useEffect(() => {
    const fetchServiceTypes = async () => {
      try {
        const res = await serviceTypeService.getAllServiceTypes();
        // Nếu API trả về mảng trực tiếp
        if (Array.isArray(res)) {
          setServiceTypes(res);
        } else if (Array.isArray(res?.serviceTypes)) {
          setServiceTypes(res.serviceTypes);
        } else {
          setServiceTypes([]);
        }
      } catch (err) {
        setServiceTypes([]);
      }
    };
    fetchServiceTypes();
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedNurse, setSelectedNurse] = useState(null);

  // Lọc và tìm kiếm
  const filteredNurses = nurses.filter(nurse => {
    const matchesSearch = nurse.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nurse.phoneNumber?.includes(searchTerm) ||
      nurse.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || nurse.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // Xử lý thêm y tá mới
  const handleAddNurse = async (nurseData) => {
    try {
      await accountService.registerNursingSpecialist({
        fullName: nurseData.fullName,
        phoneNumber: nurseData.phoneNumber,
        email: nurseData.email,
        password: nurseData.password,
        avatarUrl: nurseData.avatarUrl || "string",
        dateOfBirth: nurseData.dateOfBirth,
        address: nurseData.address,
        gender: nurseData.gender,
        major: "Nurse",
        experience: nurseData.experience,
        slogan: nurseData.slogan,
        zoneID: managedZone.zoneID
      });
      if (typeof refetchNurses === 'function') {
        await refetchNurses();
      }
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding nurse:', error);
      throw new Error('Không thể thêm y tá. Vui lòng thử lại.');
    }
  };

  // Xử lý cập nhật y tá
  const handleUpdateNurse = async (nurseId, nurseData) => {
    try {
      // Chỉ gọi 1 API update
      await nursingSpecialistService.updateNursingSpecialist(nurseId, {
        zoneID: nurseData.zoneID,
        gender: nurseData.gender,
        dateOfBirth: nurseData.dateOfBirth ? new Date(nurseData.dateOfBirth).toISOString() : null,
        fullName: nurseData.fullName,
        address: nurseData.address,
        experience: nurseData.experience,
        slogan: nurseData.slogan,
        major: nurseData.major.charAt(0).toUpperCase() + nurseData.major.slice(1).toLowerCase(),
        status: nurseData.status
      });

      // Step 3: assign service type
      await nursingSpecialistServiceTypeService.create({
        nursingID: nurseId,
        serviceID: nurseData.serviceID
      });

      // Gọi callback từ cha để reload lại danh sách y tá toàn hệ thống
      if (typeof refetchNurses === 'function') {
        await refetchNurses();
      }

      setShowEditModal(false);
      setSelectedNurse(null);
    } catch (error) {
      console.error('Error updating nurse:', error);
      throw new Error('Không thể cập nhật y tá. Vui lòng thử lại.');
    }
  };

  // Xử lý xóa y tá
  const handleDeleteNurse = async (nurseId, accountId) => {
    try {
      await nursingSpecialistService.deleteNursingSpecialist(nurseId);
      if (typeof refetchNurses === 'function') {
        await refetchNurses();
      }
    } catch (error) {
      console.error('Error deleting nurse:', error);
      throw new Error('Không thể xóa y tá. Vui lòng thử lại.');
    }
  };



  // Loading state
  // Loading state
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Đang tải dữ liệu y tá...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-12">
        <FaExclamationTriangle className="text-red-500 text-6xl mb-4 inline-block" />
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Có lỗi xảy ra</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button onClick={() => window.location.reload()} className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors">
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Quản lý Y tá</h3>
          <p className="text-gray-600">
            Khu vực: {managedZone?.zoneName || 'N/A'} |
            Tổng số: {nurses.length} y tá
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
        >
          <FaPlus />
          <span>Thêm Y tá</span>
        </button>
      </div>

      {/* Filters */}
      <NurseFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        totalNurses={nurses.length}
        filteredCount={filteredNurses.length}
      />

      {/* Nurses List */}
      <NurseList
        nurses={filteredNurses}
        onEdit={(nurse) => {
          setSelectedNurse(nurse);
          setShowEditModal(true);
        }}
        onDelete={handleDeleteNurse}
      />

      {/* Add Nurse Modal */}
      {showAddModal && (
        <AddNurseModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddNurse}
          managedZone={managedZone}
        />
      )}

      {/* Edit Nurse Modal */}
      {showEditModal && selectedNurse && (
        <EditNurseModal
          nurse={selectedNurse}
          onClose={() => {
            setShowEditModal(false);
            setSelectedNurse(null);
          }}
          onUpdate={handleUpdateNurse}
          zones={zones}
          refetchNurses={refetchNurses}
          serviceTypes={serviceTypes}
        />
      )}
    </div>
  );
};

export default ManagerNurseTab;