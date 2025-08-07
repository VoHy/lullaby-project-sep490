// Data Manager Hook - Quản lý API calls và data states
import { useState, useEffect } from 'react';
import relativesService from '@/services/api/relativesService';
import zoneService from '@/services/api/zoneService';
import zoneDetailService from '@/services/api/zoneDetailService';
import careProfileService from '@/services/api/careProfileService';

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
      
      const [careProfilesData, relativesData, zonesData, zoneDetailsData] = await Promise.all([
        careProfileService.getCareProfiles().catch(() => []),
        relativesService.getRelatives().catch(() => []),
        zoneService.getZones().catch(() => []),
        zoneDetailService.getAll().catch(() => [])
      ]);

      setCareProfiles(Array.isArray(careProfilesData) ? careProfilesData : []);
      setRelativesList(Array.isArray(relativesData) ? relativesData : []);
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
    const submitData = {
      accountID: user.accountID,
      zoneDetailID: data.zoneDetailID,
      profileName: data.profileName || '',
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth).toISOString() : null,
      phoneNumber: data.phoneNumber || '',
      address: data.address || '',
      image: data.image || '',
      note: data.note || '',
      status: data.status || 'active'
    };

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
    const submitData = {
      ...data,
      careProfileID: currentCareID,
      relativeName: data.relativeName,
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth).toISOString() : null,
      gender: data.gender || 'male',
      note: data.note || '',
      status: data.status || 'active'
    };

    if (editItem) {
      await relativesService.updateRelative(
        editItem.relativeID || editItem.RelativeID || editItem.relativeid, 
        submitData
      );
      return { success: true, message: 'Cập nhật người thân thành công!' };
    } else {
      await relativesService.createRelative(submitData);
      return { success: true, message: 'Thêm người thân thành công!' };
    }
  };

  const deleteRelative = async (id) => {
    await relativesService.deleteRelative(id);
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
