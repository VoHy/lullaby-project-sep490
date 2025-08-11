// Data Manager Hook - Quản lý API calls và data states
import { useState, useEffect } from 'react';
import relativesService from '@/services/api/relativesService';
import zoneService from '@/services/api/zoneService';
import zoneDetailService from '@/services/api/zoneDetailService';
import careProfileService from '@/services/api/careProfileService';
import { validateCareProfile, validateRelative, prepareCareProfileData, prepareRelativeData } from '../../utils/formUtils';

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
      throw new Error(errors[0]);
    }

    // Normalize and prepare
    const submitData = prepareCareProfileData({ ...data }, user);

    let result;
    if (editItem) {
      // Update
  result = await careProfileService.updateCareProfile(
        editItem.careProfileID || editItem.CareProfileID,
        submitData
      );

      // Update state optimistically
      setCareProfiles(prevProfiles =>
        prevProfiles.map(profile => {
          const profileId = profile.careProfileID || profile.CareProfileID;
          const editId = editItem.careProfileID || editItem.CareProfileID;
          return profileId === editId
            ? { ...profile, ...submitData, careProfileID: profileId }
            : profile;
        })
      );

      return { success: true, message: 'Cập nhật hồ sơ thành công!' };
    } else {
      // Create
  result = await careProfileService.createCareProfile(submitData);

      // Add to state optimistically
      if (result && (result.careProfileID || result.CareProfileID)) {
        setCareProfiles(prevProfiles => [
          ...prevProfiles,
          { ...submitData, ...result }
        ]);
      }

      return { success: true, message: 'Tạo hồ sơ thành công!' };
    }
  };

  const deleteCareProfile = async (id) => {
    await careProfileService.deleteCareProfile(id);
    // Remove from state optimistically
    setCareProfiles(prev =>
      prev.filter(profile =>
        (profile.careProfileID || profile.CareProfileID) !== id
      )
    );
    return { success: true, message: 'Xóa hồ sơ thành công!' };
  };

  // CRUD operations for Relative
  const saveRelative = async (data, editItem, currentCareID) => {
    // Validate
    const errors = validateRelative(data);
    if (errors.length) {
      throw new Error(errors[0]);
    }

    // Prepare
    const submitData = prepareRelativeData({ ...data }, currentCareID);

    if (editItem) {
      const editId = editItem.relativeID || editItem.RelativeID || editItem.relativeid;
  const result = await relativesService.updateRelative(editId, submitData);

      // Update state optimistically
      setRelativesList(prevRelatives =>
        prevRelatives.map(relative => {
          const relativeId = relative.relativeID || relative.RelativeID || relative.relativeid;
          return relativeId === editId
            ? { ...relative, ...submitData, ...(result || {}), relativeID: relativeId }
            : relative;
        })
      );

      return { success: true, message: 'Cập nhật người thân thành công!' };
    } else {
  const result = await relativesService.createRelative(submitData);

      // Add to state optimistically
      setRelativesList(prevRelatives => [
        ...prevRelatives,
        { ...submitData, ...(result || {}) }
      ]);

      return { success: true, message: 'Thêm người thân thành công!' };
    }
  };

  const deleteRelative = async (id) => {
    await relativesService.deleteRelative(id);
    // Remove from state optimistically
    setRelativesList(prevRelatives =>
      prevRelatives.filter(relative =>
        (relative.relativeID || relative.RelativeID || relative.relativeid) !== id
      )
    );
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
