'use client';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import nursingSpecialistService from '@/services/api/nursingSpecialistService';
import accountService from '@/services/api/accountService';
import zoneService from '@/services/api/zoneService';
import NurseList from './nurse/NurseList';
import NurseFilters from './nurse/NurseFilters';
import AddNurseModal from './nurse/AddNurseModal';
import EditNurseModal from './nurse/EditNurseModal';

const ManagerNurseTab = () => {
  const { user } = useContext(AuthContext);
  const [nurses, setNurses] = useState([]);
  const [zones, setZones] = useState([]);
  const [managedZone, setManagedZone] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedNurse, setSelectedNurse] = useState(null);

    // Load data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');

        const [nursesData, zonesData, accountsData] = await Promise.all([
          nursingSpecialistService.getAllNursingSpecialists(),
          zoneService.getZones(),
          accountService.getAllAccounts()
        ]);

        // Lọc y tá (major = 'nurse') trong khu vực quản lý
        const managedZone = zonesData.find(zone => zone.managerID === user.accountID);
        setManagedZone(managedZone);

        if (managedZone) {
          const zoneNurses = nursesData.filter(nurse =>
            nurse.zoneID === managedZone.zoneID && nurse.major === 'nurse'
          );

          // Merge account data vào nurse data
          const nursesWithAccountData = zoneNurses.map(nurse => {
            const account = accountsData.find(acc => acc.accountID === nurse.accountID);
            return {
              ...nurse,
              phoneNumber: account?.phoneNumber || 'N/A',
              email: account?.email || 'N/A'
            };
          });

          setNurses(nursesWithAccountData);
        } else {
          setNurses([]);
        }

        setZones(zonesData);
      } catch (error) {
        console.error('Error fetching nurse data:', error);
        setError('Không thể tải dữ liệu y tá. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user.accountID]);

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
      // Sử dụng API register nursing specialist trực tiếp
      const response = await accountService.registerNursingSpecialist({
        fullName: nurseData.fullName,
        phoneNumber: nurseData.phoneNumber,
        email: nurseData.email,
        password: nurseData.password,
        avatarUrl: nurseData.avatarUrl || "string",
        dateOfBirth: nurseData.dateOfBirth,
        address: nurseData.address,
        gender: nurseData.gender,
        major: "nurse",
        experience: nurseData.experience,
        slogan: nurseData.slogan,
        zoneID: managedZone.zoneID
      });

      // Cập nhật local state
      setNurses(prev => [...prev, response]);
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding nurse:', error);
      throw new Error('Không thể thêm y tá. Vui lòng thử lại.');
    }
  };

  // Xử lý cập nhật y tá
  const handleUpdateNurse = async (nurseId, nurseData) => {
    try {
      // Cập nhật account với đầy đủ fields theo API documentation
      await accountService.updateAccount(nurseData.accountID, {
        accountID: nurseData.accountID,
        roleID: 2, // Nurse role
        fullName: nurseData.fullName,
        phoneNumber: nurseData.phoneNumber,
        email: nurseData.email,
        password: nurseData.password || "string", // Giữ nguyên password
        avatarUrl: nurseData.avatarUrl || "string",
        createAt: nurseData.createAt || new Date().toISOString(),
        deletedAt: nurseData.deletedAt || null,
        status: nurseData.status
      });

      // Cập nhật nursing specialist profile (theo API documentation)
      await nursingSpecialistService.updateNursingSpecialist(nurseId, {
        zoneID: nurseData.zoneID,
        gender: nurseData.gender,
        dateOfBirth: nurseData.dateOfBirth,
        fullName: nurseData.fullName,
        address: nurseData.address,
        experience: nurseData.experience,
        slogan: nurseData.slogan,
        major: nurseData.major,
        status: nurseData.status
      });

      // Refresh data để lấy thông tin mới nhất
      const [nursesData, accountsData] = await Promise.all([
        nursingSpecialistService.getAllNursingSpecialists(),
        accountService.getAllAccounts()
      ]);

      const managedZone = zones.find(zone => zone.managerID === user.accountID);
      if (managedZone) {
        const zoneNurses = nursesData.filter(nurse =>
          nurse.zoneID === managedZone.zoneID && nurse.major === 'nurse'
        );

        // Merge account data vào nurse data
        const nursesWithAccountData = zoneNurses.map(nurse => {
          const account = accountsData.find(acc => acc.accountID === nurse.accountID);
          return {
            ...nurse,
            phoneNumber: account?.phoneNumber || 'N/A',
            email: account?.email || 'N/A'
          };
        });

        setNurses(nursesWithAccountData);
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
      // Xóa nursing specialist
      await nursingSpecialistService.deleteNursingSpecialist(nurseId);

      // Xóa account
      await accountService.deleteAccount(accountId);

      // Cập nhật local state
      setNurses(prev => prev.filter(nurse => nurse.nursingID !== nurseId));
    } catch (error) {
      console.error('Error deleting nurse:', error);
      throw new Error('Không thể xóa y tá. Vui lòng thử lại.');
    }
  };

  

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
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
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
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
        >
          <span>➕</span>
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
        />
      )}
    </div>
  );
};

export default ManagerNurseTab;