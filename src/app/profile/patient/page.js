'use client';

import { useState, useEffect, useContext } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AuthContext } from '@/context/AuthContext';
// Thêm các import icon cần thiết
import { FaUser, FaUsers } from "react-icons/fa";
import { FaWallet } from "react-icons/fa";
import PatientCareProfileList from './components/PatientCareProfileList';
import useCareProfileManager from './components/useCareProfileManager';
import CareProfileFormModal from './components/CareProfileFormModal';
import RelativeFormModal from './components/RelativeFormModal';
import ConfirmDeleteModal from './components/ConfirmDeleteModal';
import CareProfileDetailModal from './components/CareProfileDetailModal';
import RelativeDetailModal from './components/RelativeDetailModal';

// TabNavigation đồng bộ với profile
const TabNavigation = () => {
  const router = useRouter();
  const pathname = usePathname();
  const tabs = [
    {
      id: 'profile',
      name: 'Thông tin cá nhân',
      icon: <FaUser className="text-sm" />,
      href: '/profile',
      active: pathname === '/profile',
    },
    {
      id: 'care-profiles',
      name: 'Hồ sơ người thân',
      icon: <FaUsers className="text-sm" />,
      href: '/profile/patient',
      active: pathname === '/profile/patient',
    },
    {
      id: 'wallet',
      name: 'Ví điện tử',
      icon: <FaWallet className="text-sm" />,
      href: '/wallet',
      active: pathname === '/wallet',
    }
  ];
    return (
    <div className="flex flex-wrap gap-2 border-b border-gray-200 mb-8">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => router.push(tab.href)}
          className={`flex items-center gap-2 px-4 py-3 rounded-t-lg font-medium transition-all duration-200 ${
            tab.active
              ? 'bg-white text-purple-600 border-b-2 border-purple-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          {tab.icon}
          {tab.name}
        </button>
      ))}
      </div>
    );
};

export default function PatientProfilePage(props) {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);

  // Authentication check
  useEffect(() => {
    const checkAuth = () => {
      if (!user) {
        router.push('/auth/login');
        return;
      }
      setIsLoading(false);
    };

    // Delay để đảm bảo AuthContext đã load
    const timer = setTimeout(checkAuth, 100);
    return () => clearTimeout(timer);
  }, [user, router]);

  const manager = useCareProfileManager(router);

  if (isLoading) {
    return <div className="text-center py-20">Đang kiểm tra đăng nhập...</div>;
  }

  if (!user) {
    return null; // Sẽ redirect về login
  }

  if (manager.loading) return <div className="text-center py-20">Đang tải dữ liệu...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Thông báo thành công ở góc phải trên */}
      {manager.careProfileSuccess && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
          {manager.careProfileSuccess}
        </div>
      )}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2">
            Hồ sơ người thân
          </h1>
          <p className="text-gray-600">Quản lý thông tin hồ sơ chăm sóc và người thân</p>
        </div>
        <TabNavigation />
        <div className="bg-white rounded-xl shadow-lg">
        <PatientCareProfileList
            careProfiles={manager.careProfiles}
            relativesList={manager.relativesList}
            zones={manager.zones}
            relativesFilter={manager.relativesFilter}
            setRelativesFilter={manager.setRelativesFilter}
            handleOpenForm={manager.handleOpenRelativeForm}
            careProfileFilter={manager.careProfileFilter}
            setCareProfileFilter={manager.setCareProfileFilter}
            handleOpenCareProfileForm={manager.handleOpenCareProfileForm}
            onViewDetailCareProfile={manager.handleOpenCareProfileDetail}
            onViewDetailRelative={manager.handleOpenRelativeDetail}
            handleOpenEditCareProfile={manager.handleOpenCareProfileForm}
            handleOpenEditRelative={manager.handleOpenRelativeForm}
            handleDeleteCareProfile={manager.handleDeleteCareProfile}
            handleDeleteRelative={manager.handleDeleteRelative}
          />
        </div>
        {/* Modal form hồ sơ người thân */}
        <CareProfileFormModal
          open={manager.showCareProfileForm}
          onClose={manager.handleCloseCareProfileForm}
          onSave={manager.handleSaveCareProfile}
          formData={manager.careProfileForm}
          onChange={manager.handleCareProfileInputChange}
          loading={manager.careProfileLoading}
          isEdit={!!manager.editCareProfile}
          zones={manager.zones}
          zoneDetails={manager.zoneDetails}
          user={manager.user} // truyền user vào modal
        />
        {/* Modal form người thân */}
        <RelativeFormModal
          open={manager.showRelativeForm}
          onClose={manager.handleCloseRelativeForm}
          onSave={manager.handleSaveRelative}
          formData={manager.relativeForm}
          onChange={manager.handleRelativeInputChange}
          loading={manager.relativeLoading}
          isEdit={!!manager.editRelative}
          currentCareID={manager.currentCareID}
        />
        {/* Modal xác nhận xoá hồ sơ */}
        <ConfirmDeleteModal
          open={manager.showDeleteCareProfile}
          onClose={() => manager.setShowDeleteCareProfile(false)}
          onConfirm={manager.confirmDeleteCareProfile}
          title="Xác nhận xoá hồ sơ"
          message="Bạn có chắc chắn muốn xoá hồ sơ này không?"
          loading={manager.deleteLoading}
        />
        {/* Modal xác nhận xoá người thân */}
        <ConfirmDeleteModal
          open={manager.showDeleteRelative}
          onClose={() => manager.setShowDeleteRelative(false)}
          onConfirm={manager.confirmDeleteRelative}
          title="Xác nhận xoá người thân"
          message="Bạn có chắc chắn muốn xoá người thân này không?"
          loading={manager.deleteLoading}
        />
        {/* Modal chi tiết CareProfile */}
        <CareProfileDetailModal
          open={manager.showCareProfileDetail}
          onClose={manager.handleCloseCareProfileDetail}
          care={manager.detailCareProfile}
          zones={manager.zones}
          zoneDetails={manager.zoneDetails}
        />
        {/* Modal chi tiết Relative */}
        <RelativeDetailModal
          open={manager.showRelativeDetail}
          onClose={manager.handleCloseRelativeDetail}
          relative={manager.detailRelative}
        />
      </div>
    </div>
  );
} 