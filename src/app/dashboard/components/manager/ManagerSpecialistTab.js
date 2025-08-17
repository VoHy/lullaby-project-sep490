'use client';
import { useState, useEffect, useContext } from 'react';
import { FaExclamationTriangle, FaPlus } from 'react-icons/fa';
import { AuthContext } from '@/context/AuthContext';
import nursingSpecialistService from '@/services/api/nursingSpecialistService';
import accountService from '@/services/api/accountService';
import zoneService from '@/services/api/zoneService';
import SpecialistList from './specialist/SpecialistList';
import SpecialistFilters from './specialist/SpecialistFilters';
import AddSpecialistModal from './specialist/AddSpecialistModal';
import EditSpecialistModal from './specialist/EditSpecialistModal';
import nursingSpecialistServiceTypeService from '@/services/api/nursingSpecialistServiceTypeService';
import serviceTypeService from '@/services/api/serviceTypeService';


const ManagerSpecialistTab = ({ refetchSpecialists, specialists, zones, managedZone, loading, error }) => {
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
  const [selectedSpecialist, setSelectedSpecialist] = useState(null);

  // Lọc và tìm kiếm
  const filteredSpecialists = specialists.filter(specialist => {
    const matchesSearch = specialist.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      specialist.phoneNumber?.includes(searchTerm) ||
      specialist.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || specialist.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // Xử lý thêm chuyên gia mới
  const handleAddSpecialist = async (specialistData) => {
    try {
      await accountService.registerNursingSpecialist({
        fullName: specialistData.fullName,
        phoneNumber: specialistData.phoneNumber,
        email: specialistData.email,
        password: specialistData.password,
        avatarUrl: specialistData.avatarUrl || "string",
        dateOfBirth: specialistData.dateOfBirth,
        address: specialistData.address,
        gender: specialistData.gender,
        major: "Specialist",
        experience: specialistData.experience,
        slogan: specialistData.slogan,
        zoneID: managedZone.zoneID
      });
      // Gán dịch vụ cho chuyên gia nếu có
      if (Array.isArray(specialistData.serviceID) && specialistData.serviceID.length > 0) {
        // Lấy specialist vừa tạo (cần lấy lại danh sách hoặc từ API trả về)
        await nursingSpecialistServiceTypeService.create({
          nursingID: specialistData.nursingID, // hoặc lấy từ response nếu có
          serviceIDs: specialistData.serviceID.map(id => Number(id))
        });
      }
      if (typeof refetchSpecialists === 'function') {
        await refetchSpecialists();
      }
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding specialist:', error);
      throw new Error('Không thể thêm chuyên gia. Vui lòng thử lại.');
    }
  };

  // Xử lý cập nhật chuyên gia
  const handleUpdateSpecialist = async (specialistId, specialistData) => {
    try {
      await nursingSpecialistService.updateNursingSpecialist(specialistId, {
        zoneID: specialistData.zoneID,
        gender: specialistData.gender,
        dateOfBirth: specialistData.dateOfBirth ? new Date(specialistData.dateOfBirth).toISOString() : null,
        fullName: specialistData.fullName,
        address: specialistData.address,
        experience: specialistData.experience,
        slogan: specialistData.slogan,
        major: specialistData.major.charAt(0).toUpperCase() + specialistData.major.slice(1).toLowerCase(),
        status: specialistData.status
      });
      // Gán lại dịch vụ cho chuyên gia
      const serviceIDs = Array.isArray(specialistData.serviceID)
        ? specialistData.serviceID.filter(id => id && id !== "").map(id => Number(id))
        : specialistData.serviceID ? [Number(specialistData.serviceID)] : [];
      await nursingSpecialistServiceTypeService.create({
        nursingID: specialistId,
        serviceIDs: serviceIDs
      });
      if (typeof refetchSpecialists === 'function') {
        await refetchSpecialists();
      }
      setShowEditModal(false);
      setSelectedSpecialist(null);
    } catch (error) {
      console.error('Error updating specialist:', error);
      throw new Error('Không thể cập nhật chuyên gia. Vui lòng thử lại.');
    }
  };

  // Xử lý xóa chuyên gia
  const handleDeleteSpecialist = async (specialistId, accountId) => {
    try {
      await nursingSpecialistService.deleteNursingSpecialist(specialistId);
      if (typeof refetchSpecialists === 'function') {
        await refetchSpecialists();
      }
    } catch (error) {
      console.error('Error deleting specialist:', error);
      throw new Error('Không thể xóa chuyên gia. Vui lòng thử lại.');
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Đang tải dữ liệu chuyên gia...</p>
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
        <button onClick={() => window.location.reload()} className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg transition-colors">
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
          <h3 className="text-2xl font-bold text-gray-900">Quản lý Chuyên gia</h3>
          <p className="text-gray-600">
            Khu vực: {managedZone?.zoneName || 'N/A'} |
            Tổng số: {specialists.length} chuyên gia
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
        >
          <FaPlus />
          <span>Thêm Chuyên gia</span>
        </button>
      </div>

      {/* Filters */}
      <SpecialistFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        totalSpecialists={specialists.length}
        filteredCount={filteredSpecialists.length}
      />

      {/* Specialists List */}
      <SpecialistList
        specialists={filteredSpecialists}
        onEdit={(specialist) => {
          setSelectedSpecialist(specialist);
          setShowEditModal(true);
        }}
        onDelete={handleDeleteSpecialist}
      />

      {/* Add Specialist Modal */}
      {showAddModal && (
        <AddSpecialistModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddSpecialist}
          managedZone={managedZone}
        />
      )}

      {/* Edit Specialist Modal */}
      {showEditModal && selectedSpecialist && (
        <EditSpecialistModal
          specialist={selectedSpecialist}
          onClose={() => {
            setShowEditModal(false);
            setSelectedSpecialist(null);
          }}
          onUpdate={handleUpdateSpecialist}
          zones={zones}
          refetchSpecialists={refetchSpecialists}
          serviceTypes={serviceTypes}
        />
      )}
    </div>
  );
};

export default ManagerSpecialistTab;