'use client';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import nursingSpecialistService from '@/services/api/nursingSpecialistService';
import accountService from '@/services/api/accountService';
import zoneService from '@/services/api/zoneService';
import SpecialistList from './specialist/SpecialistList';
import SpecialistFilters from './specialist/SpecialistFilters';
import AddSpecialistModal from './specialist/AddSpecialistModal';
import EditSpecialistModal from './specialist/EditSpecialistModal';

const ManagerSpecialistTab = () => {
  const { user } = useContext(AuthContext);
  const [specialists, setSpecialists] = useState([]);
  const [zones, setZones] = useState([]);
  const [managedZone, setManagedZone] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSpecialist, setSelectedSpecialist] = useState(null);

  // Load data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');

        const [specialistsData, zonesData, accountsData] = await Promise.all([
          nursingSpecialistService.getAllNursingSpecialists(),
          zoneService.getZones(),
          accountService.getAllAccounts()
        ]);

        // Lọc chuyên gia (major = 'specialist') trong khu vực quản lý
        const managedZone = zonesData.find(zone => zone.managerID === user.accountID);
        setManagedZone(managedZone);

        if (managedZone) {
          const zoneSpecialists = specialistsData.filter(specialist =>
            specialist.zoneID === managedZone.zoneID && specialist.major === 'specialist'
          );

          // Merge account data vào specialist data
          const specialistsWithAccountData = zoneSpecialists.map(specialist => {
            const account = accountsData.find(acc => acc.accountID === specialist.accountID);
            return {
              ...specialist,
              phoneNumber: account?.phoneNumber || 'N/A',
              email: account?.email || 'N/A'
            };
          });

          setSpecialists(specialistsWithAccountData);
        } else {
          setSpecialists([]);
        }

        setZones(zonesData);
      } catch (error) {
        console.error('Error fetching specialist data:', error);
        setError('Không thể tải dữ liệu chuyên gia. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user.accountID]);

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
      // Sử dụng API register nursing specialist trực tiếp
      const response = await accountService.registerNursingSpecialist({
        fullName: specialistData.fullName,
        phoneNumber: specialistData.phoneNumber,
        email: specialistData.email,
        password: specialistData.password,
        avatarUrl: specialistData.avatarUrl || "string",
        dateOfBirth: specialistData.dateOfBirth,
        address: specialistData.address,
        gender: specialistData.gender,
        major: "specialist",
        experience: specialistData.experience,
        slogan: specialistData.slogan,
        zoneID: managedZone.zoneID
      });

      // Cập nhật local state
      setSpecialists(prev => [...prev, response]);
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding specialist:', error);
      throw new Error('Không thể thêm chuyên gia. Vui lòng thử lại.');
    }
  };

  // Xử lý cập nhật chuyên gia
  const handleUpdateSpecialist = async (specialistId, specialistData) => {
    try {
      // Cập nhật account với đầy đủ fields theo API documentation
      await accountService.updateAccount(specialistData.accountID, {
        accountID: specialistData.accountID,
        roleID: 2, // Specialist role
        fullName: specialistData.fullName,
        phoneNumber: specialistData.phoneNumber,
        email: specialistData.email,
        password: specialistData.password || "string", // Giữ nguyên password
        avatarUrl: specialistData.avatarUrl || "string",
        createAt: specialistData.createAt || new Date().toISOString(),
        deletedAt: specialistData.deletedAt || null,
        status: specialistData.status
      });

      // Cập nhật nursing specialist profile (theo API documentation)
      await nursingSpecialistService.updateNursingSpecialist(specialistId, {
        zoneID: specialistData.zoneID,
        gender: specialistData.gender,
        dateOfBirth: specialistData.dateOfBirth,
        fullName: specialistData.fullName,
        address: specialistData.address,
        experience: specialistData.experience,
        slogan: specialistData.slogan,
        major: specialistData.major,
        status: specialistData.status
      });

      // Refresh data để lấy thông tin mới nhất
      const [specialistsData, accountsData] = await Promise.all([
        nursingSpecialistService.getAllNursingSpecialists(),
        accountService.getAllAccounts()
      ]);

      const managedZone = zones.find(zone => zone.managerID === user.accountID);
      if (managedZone) {
        const zoneSpecialists = specialistsData.filter(specialist =>
          specialist.zoneID === managedZone.zoneID && specialist.major === 'specialist'
        );

        // Merge account data vào specialist data
        const specialistsWithAccountData = zoneSpecialists.map(specialist => {
          const account = accountsData.find(acc => acc.accountID === specialist.accountID);
          return {
            ...specialist,
            phoneNumber: account?.phoneNumber || 'N/A',
            email: account?.email || 'N/A'
          };
        });

        setSpecialists(specialistsWithAccountData);
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
      // Xóa nursing specialist
      await nursingSpecialistService.deleteNursingSpecialist(specialistId);

      // Xóa account
      await accountService.deleteAccount(accountId);

      // Cập nhật local state
      setSpecialists(prev => prev.filter(specialist => specialist.nursingID !== specialistId));
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
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
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
          <span>➕</span>
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
        />
      )}
    </div>
  );
};

export default ManagerSpecialistTab; 