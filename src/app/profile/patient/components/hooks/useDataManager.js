// Data Manager Hook - Quản lý API calls và data states
import { useState, useEffect } from 'react';
import relativesService from '@/services/api/relativesService';
import zoneService from '@/services/api/zoneService';
import zoneDetailService from '@/services/api/zoneDetailService';
import careProfileService from '@/services/api/careProfileService';
import bookingService from '@/services/api/bookingService';
import { validateCareProfile, validateRelative, prepareCareProfileData, prepareRelativeData } from '../../utils/formUtils';
import { clearServicesCache } from '@/app/services/page.js'; // Import hàm clearServicesCache

export const useDataManager = (user, router) => {
  // Data states
  const [loading, setLoading] = useState(true);
  const [careProfiles, setCareProfiles] = useState([]);
  const [relativesList, setRelativesList] = useState([]);
  const [zones, setZones] = useState([]);
  const [zonedetailsList, setZonedetailsList] = useState([]);

  // Filter states
  const [careProfileFilter, setCareProfileFilter] = useState('all');
  const [relativesFilter, setRelativesFilter] = useState({});

  // Load all data from API
  const loadData = async () => {
    if (!user) {
      router.push('/profile/patient');
      return;
    }

    try {
      setLoading(true);

      const [allCareProfiles, allRelatives, zonesData, zoneDetailsData] = await Promise.all([
        careProfileService.getCareProfiles().catch(() => []),
        relativesService.getRelatives().catch(() => []),
        zoneService.getZones().catch(() => []),
        zoneDetailService.getZoneDetails().catch(() => [])
      ]);

      // Lọc careProfiles theo accountID đang đăng nhập
      const currentAccountId = user.accountID || user.AccountID;
      const filteredCareProfiles = (Array.isArray(allCareProfiles) ? allCareProfiles : []).filter(cp => {
        const accId = cp.accountID ?? cp.AccountID;
        return accId === currentAccountId;
      });

      // Lọc relatives theo danh sách careProfile ở trên
      const careIds = new Set(filteredCareProfiles.map(cp => cp.careProfileID ?? cp.CareProfileID));
      const filteredRelatives = (Array.isArray(allRelatives) ? allRelatives : []).filter(r => {
        const rCareId = r.careProfileID ?? r.CareProfileID ?? r.careprofileID;
        return careIds.has(rCareId);
      });

      setCareProfiles(filteredCareProfiles);
      setRelativesList(filteredRelatives);
      setZones(Array.isArray(zonesData) ? zonesData : []);
      setZonedetailsList(Array.isArray(zoneDetailsData) ? zoneDetailsData : []);

    } catch (error) {
      console.error('Error loading data:', error);
      setCareProfiles([]);
      setRelativesList([]);
      setZones([]);
      setZonedetailsList([]);
    } finally {
      setLoading(false);
    }
  };

  // CRUD operations for CareProfile
  const saveCareProfile = async (data, editItem, user) => {
    // Validate
    const errors = validateCareProfile(data);
    if (errors.length) {
      const error = new Error(errors.join('\n'));
      error.validationErrors = errors;
      throw error;
    }

    // Normalize and prepare
    const submitData = prepareCareProfileData({ ...data }, user);

    // If creating (not editing) and no image provided, set default care profile avatar
    if (!editItem) {
      if (!submitData.image) {
        submitData.image = 'https://i.ibb.co/zWSDrsBx/ae10a4719f321f9123ab1a3b7e02fa2b.jpg';
      }
    }

    let result;
    if (editItem) {
      // Update
      // If there is an existing first care profile, enforce its name for updates to non-first profiles
      if (Array.isArray(careProfiles) && careProfiles.length > 0) {
        const existingName = (careProfiles[0].profileName || careProfiles[0].ProfileName || '').toString().trim();
        const existingDOB = (careProfiles[0].dateOfBirth || careProfiles[0].DateOfBirth || careProfiles[0].dateofbirth || '').toString().trim();
        const firstCareId = careProfiles[0].careProfileID || careProfiles[0].CareProfileID || careProfiles[0].careprofileID;
        const editId = editItem.careProfileID || editItem.CareProfileID || editItem.careprofileID;
        if (existingName && firstCareId && editId && firstCareId.toString() !== editId.toString()) {
          submitData.profileName = existingName;
        }
        if (existingDOB && firstCareId && editId && firstCareId.toString() !== editId.toString()) {
          submitData.dateOfBirth = existingDOB;
        }
      }

      result = await careProfileService.updateCareProfile(
        editItem.careProfileID || editItem.CareProfileID,
        submitData
      );

      return { success: true, message: 'Cập nhật hồ sơ thành công!' };
    } else {
      // When creating a new care profile, if there is already at least one care profile,
      // automatically assign the new profile's name to match the first profile's name (server expects this).
      if (Array.isArray(careProfiles) && careProfiles.length > 0) {
        const existingName = (careProfiles[0].profileName || careProfiles[0].ProfileName || '').toString().trim();
        const existingDOB = (careProfiles[0].dateOfBirth || careProfiles[0].DateOfBirth || careProfiles[0].dateofbirth || '').toString().trim();
        if (existingName) {
          submitData.profileName = existingName;
        }
        if (existingDOB) {
          submitData.dateOfBirth = existingDOB;
        }
      }
      // Create
      result = await careProfileService.createCareProfile(submitData);
      
      // Return success, let caller handle data refresh
      return { success: true, message: 'Tạo hồ sơ thành công!' };
    }
  };

  const deleteCareProfile = async (id) => {
    // Kiểm tra xem hồ sơ có booking nào không
    const bookings = await bookingService.getAllByCareProfile(id).catch(() => []);
    if (Array.isArray(bookings) && bookings.length > 0) {
      // Kiểm tra xem có booking nào đang active không (chưa hoàn thành hoặc hủy)
      const activeBookings = bookings.filter(booking => {
        const status = booking.status || booking.Status;
        return status && !['completed', 'cancelled', 'Completed', 'Cancelled'].includes(status);
      });
      
      if (activeBookings.length > 0) {
        throw new Error(`Không thể xóa hồ sơ này vì đang có ${activeBookings.length} booking chưa hoàn thành. Vui lòng hoàn thành hoặc hủy các booking trước khi xóa.`);
      }
      
      // Nếu chỉ có booking đã hoàn thành/hủy, vẫn không cho phép xóa để bảo toàn lịch sử
      throw new Error(`Hồ sơ này có ${bookings.length} lịch sử booking nên không thể xóa để bảo toàn dữ liệu.`);
    }

    await careProfileService.deleteCareProfile(id);
    return { success: true, message: 'Xóa hồ sơ thành công!' };
  };

  // CRUD operations for Relative
  const saveRelative = async (data, editItem, currentCareID) => {
    // Validate
    const errors = validateRelative(data);
    if (errors.length) {
      const error = new Error(errors.join('\n'));
      error.validationErrors = errors;
      throw error;
    }

    // Prepare
    const submitData = prepareRelativeData({ ...data }, currentCareID);

    // If creating (not editing) and no image provided, set default relative avatar
    if (!editItem) {
      if (!submitData.image) {
        submitData.image = 'https://i.ibb.co/MXjZs9F/4e2bc1c91a903b5b33e423c8ec64eaf3.jpg';
      }
    }

    if (editItem) {
      const editId = editItem.relativeID || editItem.RelativeID || editItem.relativeid;
      const result = await relativesService.updateRelative(editId, submitData);

      clearServicesCache(); // Clear cache sau khi cập nhật
      return { success: true, message: 'Cập nhật người thân thành công!' };
    } else {
      const result = await relativesService.createRelative(submitData);

      clearServicesCache(); // Clear cache sau khi thêm
      return { success: true, message: 'Thêm người thân thành công!' };
    }
  };

  const deleteRelative = async (id) => {
    // Tìm relative để lấy careProfileID
    const relative = relativesList.find(r => 
      (r.relativeID || r.RelativeID || r.relativeid) === id
    );
    
    if (relative) {
      // Kiểm tra xem care profile của relative có booking nào không
      const careProfileId = relative.careProfileID || relative.CareProfileID || relative.careprofileID;
      const bookings = await bookingService.getAllByCareProfile(careProfileId).catch(() => []);
      
      if (Array.isArray(bookings) && bookings.length > 0) {
        // Kiểm tra xem có booking nào đang active không (chưa hoàn thành hoặc hủy)
        const activeBookings = bookings.filter(booking => {
          const status = booking.status || booking.Status;
          return status && !['completed', 'cancelled', 'Completed', 'Cancelled'].includes(status);
        });
        
        if (activeBookings.length > 0) {
          throw new Error(`Không thể xóa người thân này vì hồ sơ đang có lịch hẹn chưa hoàn thành. Vui lòng hoàn thành hoặc hủy các lịch hẹn trước khi xóa.`);
        }
      }
    }

    await relativesService.deleteRelative(id);
    clearServicesCache(); // Clear cache sau khi xóa
    return { success: true, message: 'Xóa người thân thành công!' };
  };

  // Load data on user change
  useEffect(() => {
    loadData();
  }, [user]);

  return {
    // Data states
    loading,
    careProfiles,
    relativesList,
    zones,
    zonedetailsList,
    careProfileFilter,
    setCareProfileFilter,
    relativesFilter,
    setRelativesFilter,

    // Functions
    loadData,
    saveCareProfile,
    deleteCareProfile,
    saveRelative,
    deleteRelative
  };
};
