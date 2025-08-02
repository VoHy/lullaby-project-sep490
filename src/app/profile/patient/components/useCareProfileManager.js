import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import relativesService from '@/services/api/relativesService';
import zoneService from '@/services/api/zoneService';
import zoneDetailService from '@/services/api/zoneDetailService';
import careProfileService from '@/services/api/careProfileService';

export default function useCareProfileManager(router) {
  // Get user from AuthContext first
  const { user } = useContext(AuthContext);
  
  // State
  const [loading, setLoading] = useState(true);
  const [relativesList, setRelativesList] = useState([]);
  const [careProfiles, setCareProfiles] = useState([]);
  const [zones, setZones] = useState([]);
  const [zonedetailsList, setZonedetailsList] = useState([]);
  const [careProfileFilter, setCareProfileFilter] = useState('all');
  const [relativesFilter, setRelativesFilter] = useState({});
  const [careProfileSuccess, setCareProfileSuccess] = useState('');

  // Auto-hide success message after 3 seconds
  useEffect(() => {
    if (careProfileSuccess) {
      const timer = setTimeout(() => {
        setCareProfileSuccess('');
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [careProfileSuccess]);

  // Modal/form state
  const [showCareProfileForm, setShowCareProfileForm] = useState(false);
  const [editCareProfile, setEditCareProfile] = useState(null);
  const [careProfileForm, setCareProfileForm] = useState({
    profileName: '', dateOfBirth: '', phoneNumber: '', address: '', zonedetailid: '', customZoneName: '', note: '', status: 'active', image: '',
  });
  const [careProfileAvatarFile, setCareProfileAvatarFile] = useState(null);
  const [careProfileAvatar, setCareProfileAvatar] = useState('');
  const [careProfileLoading, setCareProfileLoading] = useState(false);

  const [showRelativeForm, setShowRelativeForm] = useState(false);
  const [editRelative, setEditRelative] = useState(null);
  const [currentCareID, setCurrentCareID] = useState(null);
  const [relativeForm, setRelativeForm] = useState({
    relativeName: '', dateOfBirth: '', gender: '', note: '', status: 'active', image: '',
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [relativeLoading, setRelativeLoading] = useState(false);

  // Modal chi tiết CareProfile
  const [showCareProfileDetail, setShowCareProfileDetail] = useState(false);
  const [detailCareProfile, setDetailCareProfile] = useState(null);
  const handleOpenCareProfileDetail = (care) => {
    setDetailCareProfile(care);
    setShowCareProfileDetail(true);
  };
  const handleCloseCareProfileDetail = () => {
    setShowCareProfileDetail(false);
    setDetailCareProfile(null);
  };
  // Modal chi tiết Relative
  const [showRelativeDetail, setShowRelativeDetail] = useState(false);
  const [detailRelative, setDetailRelative] = useState(null);
  const handleOpenRelativeDetail = (relative) => {
    setDetailRelative(relative);
    setShowRelativeDetail(true);
  };
  const handleCloseRelativeDetail = () => {
    setShowRelativeDetail(false);
    setDetailRelative(null);
  };

  // Delete modals
  const [showDeleteCareProfile, setShowDeleteCareProfile] = useState(false);
  const [deleteCareProfileId, setDeleteCareProfileId] = useState(null);
  const [showDeleteRelative, setShowDeleteRelative] = useState(false);
  const [deleteRelativeId, setDeleteRelativeId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Load data
  useEffect(() => {
    const loadData = async () => {
      if (!user) {
        router.push('/auth/login');
        return;
      }
      
      try {
        // Gọi từng API riêng biệt để tránh fail toàn bộ nếu một API lỗi
        let careProfilesData = [];
        let relativesData = [];
        let zonesData = [];
        let zoneDetailsData = [];

        // Load care profiles
        try {
          careProfilesData = await careProfileService.getCareProfiles();
        } catch (error) {
          console.error('Error loading care profiles:', error);
        }

        // Load relatives
        try {
          relativesData = await relativesService.getRelatives();
        } catch (error) {
          console.error('Error loading relatives:', error);
        }

        // Load zones
        try {
          zonesData = await zoneService.getZones();
        } catch (error) {
          console.error('Error loading zones:', error);
        }

        // Load zone details
        try {
          zoneDetailsData = await zoneDetailService.getAll();
        } catch (error) {
          console.error('Error loading zone details:', error);
        }

        // Process care profiles
        const safeCareProfiles = Array.isArray(careProfilesData) ? careProfilesData : [];
        const myCareProfiles = safeCareProfiles.filter(
          c => (c.accountID || c.AccountID) === (user.accountID || user.AccountID)
        );
        // Loại bỏ trùng careProfileID
        const uniqueCareProfiles = [];
        const seen = new Set();
        for (const c of myCareProfiles) {
          const id = c.careProfileID || c.CareProfileID;
          if (!seen.has(id)) {
            uniqueCareProfiles.push(c);
            seen.add(id);
          }
        }
        setCareProfiles(uniqueCareProfiles);
        
        // Set other data
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

    loadData();
  }, [router, user]);

  // CareProfile handlers
  const handleOpenCareProfileForm = (care = null) => {
    setEditCareProfile(care);
    setShowCareProfileForm(true);
    if (care) {
      setCareProfileForm({
        ...care,
        dateOfBirth: formatDateForInput(care.dateOfBirth),
      });
      setCareProfileAvatar(care.image || '');
    } else {
      setCareProfileForm({ profileName: '', dateOfBirth: '', phoneNumber: '', address: '', zonedetailid: '', customZoneName: '', note: '', status: 'Active', image: '' });
      setCareProfileAvatar('');
    }
    setCareProfileAvatarFile(null);
  };
  const handleCareProfileInputChange = e => {
    const { name, value } = e.target;
    setCareProfileForm(prev => ({ ...prev, [name]: value }));
  };
  const handleCareProfileAvatarChange = e => {
    const file = e.target.files[0];
    if (file) {
      setCareProfileAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setCareProfileAvatar(reader.result);
      reader.readAsDataURL(file);
    }
  };
  const handleSaveCareProfile = async (dataOrEvent) => {
    let data = dataOrEvent;
    // Nếu là event form thì lấy formData từ state và truyền avatar
    if (dataOrEvent && typeof dataOrEvent.preventDefault === 'function') {
      dataOrEvent.preventDefault();
      data = { ...careProfileForm, image: careProfileAvatar };
    } else {
      // Nếu là submitData từ modal thì merge avatar
      data = { ...data, image: careProfileAvatar };
    }
    
    setCareProfileLoading(true);
    setCareProfileSuccess('');
    try {
      if (editCareProfile) {
        await careProfileService.updateCareProfile(editCareProfile.careProfileID || editCareProfile.CareProfileID, data);
        setCareProfileSuccess('Cập nhật hồ sơ thành công!');
      } else {
        // Create
        await careProfileService.createCareProfile(data);
        setCareProfileSuccess('Tạo hồ sơ thành công!');
      }
      const updatedList = await careProfileService.getCareProfiles();
      const safeCareProfiles = Array.isArray(updatedList) ? updatedList : [];
      const myCareProfiles = safeCareProfiles.filter(
        c => (c.accountID || c.AccountID) === (user.accountID || user.AccountID)
      );
      const uniqueCareProfiles = [];
      const seen = new Set();
      for (const c of myCareProfiles) {
        const id = c.careProfileID || c.CareProfileID;
        if (!seen.has(id)) {
          uniqueCareProfiles.push(c);
          seen.add(id);
        }
      }
      setCareProfiles(uniqueCareProfiles);
      setShowCareProfileForm(false);
          } catch (err) {
        console.error('Error saving care profile:', err);
        setCareProfileSuccess(err.message || 'Có lỗi khi xử lý hồ sơ.');
      } finally {
        setCareProfileLoading(false);
      }
  };

  // Relative handlers
  const handleOpenRelativeForm = (relative = null, careProfileID = null) => {
    setEditRelative(relative);
    setShowRelativeForm(true);
    setCurrentCareID(careProfileID);
    if (relative) {
      setRelativeForm({
        ...relative,
        dateOfBirth: formatDateForInput(relative.dateOfBirth),
      });
      setAvatarPreview(relative.image || '');
    } else {
      setRelativeForm({ relativeName: '', dateOfBirth: '', gender: '', note: '', status: 'Active', image: '' });
      setAvatarPreview('');
    }
    setAvatarFile(null);
  };
  const handleRelativeInputChange = e => {
    const { name, value, type, checked } = e.target;
    setRelativeForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };
  const handleRelativeAvatarChange = e => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };
  const handleSaveRelative = async (dataOrEvent) => {
    let data = dataOrEvent;
    // Nếu là event form thì lấy formData từ state và truyền avatar
    if (dataOrEvent && typeof dataOrEvent.preventDefault === 'function') {
      dataOrEvent.preventDefault();
      data = { ...relativeForm, image: avatarPreview };
    } else {
      // Nếu là submitData từ modal thì merge avatar
      data = { ...data, image: avatarPreview };
    }
    
    setRelativeLoading(true);
    try {
      const submitData = {
        ...data,
        careProfileID: currentCareID,
        relativeName: data.relativeName,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender || 'male',
        note: data.note || '',
        status: data.status || 'active'
      };
      
      // Loại bỏ các ID fields khác nhưng giữ lại relativeID
      if (editRelative) {
        delete submitData.RelativeID;
        delete submitData.relativeid;
        delete submitData.id;
        delete submitData.ID;
        delete submitData.relative_id;
        delete submitData.Relative_ID;
      }
      
      if (editRelative) {
        const relativeId = editRelative.relativeID || editRelative.RelativeID || editRelative.relativeid;
        const updateData = { 
          ...submitData,
          relativeID: relativeId  // Thêm relativeID để khớp với ID trong URL
        };
        
        // Thêm createdAt nếu có trong editRelative
        if (editRelative.createdAt) {
          updateData.createdAt = editRelative.createdAt;
        }
        
        // Thử format khác - có thể backend mong đợi format khác
        const alternativeUpdateData = {
          relativeID: parseInt(relativeId),
          careProfileID: parseInt(updateData.careProfileID),
          relativeName: updateData.relativeName,
          dateOfBirth: updateData.dateOfBirth,
          gender: updateData.gender || 'male',
          note: updateData.note || '',
          status: updateData.status || 'Active',
          image: updateData.image || ''
        };
        
        // Thử với alternative format
        const updateResult = await relativesService.updateRelative(relativeId, alternativeUpdateData);
        
        // Kiểm tra relative cụ thể sau khi update
        try {
          const specificRelative = await relativesService.getRelative(relativeId);
        } catch (error) {
        }
        
        setCareProfileSuccess('Cập nhật người thân thành công!');
      } else {
        await relativesService.createRelative(submitData);
        setCareProfileSuccess('Thêm người thân thành công!');
      }
      
      // Refresh relatives list
      const updatedRelatives = await relativesService.getRelatives();
      setRelativesList(updatedRelatives);
      
      setShowRelativeForm(false);
    } catch (err) {
      console.error('Error saving relative:', err);
      setCareProfileSuccess(err.message || 'Có lỗi khi xử lý người thân.');
    } finally {
      setRelativeLoading(false);
    }
  };

  // Delete handlers
  const handleDeleteCareProfile = id => {
    setDeleteCareProfileId(id);
    setShowDeleteCareProfile(true);
  };
  const confirmDeleteCareProfile = async () => {
    setDeleteLoading(true);
    try {
      await careProfileService.deleteCareProfile(deleteCareProfileId);
      setCareProfileSuccess('Xóa hồ sơ thành công!');
      
      // Refresh care profiles list
      const updatedList = await careProfileService.getCareProfiles();
      const safeCareProfiles = Array.isArray(updatedList) ? updatedList : [];
      const myCareProfiles = safeCareProfiles.filter(
        c => (c.accountID || c.AccountID) === (user.accountID || user.AccountID)
      );
      const uniqueCareProfiles = [];
      const seen = new Set();
      for (const c of myCareProfiles) {
        const id = c.careProfileID || c.CareProfileID;
        if (!seen.has(id)) {
          uniqueCareProfiles.push(c);
          seen.add(id);
        }
      }
      setCareProfiles(uniqueCareProfiles);
      
      setShowDeleteCareProfile(false);
      setDeleteCareProfileId(null);
    } catch (err) {
      setCareProfileSuccess(err.message || 'Có lỗi khi xóa hồ sơ.');
    } finally {
      setDeleteLoading(false);
    }
  };
  const handleDeleteRelative = id => {
    setDeleteRelativeId(id);
    setShowDeleteRelative(true);
  };
  const confirmDeleteRelative = async () => {
    setDeleteLoading(true);
    try {
      await relativesService.deleteRelative(deleteRelativeId);
      setCareProfileSuccess('Xóa người thân thành công!');
      
      // Refresh relatives list
      const updatedRelatives = await relativesService.getRelatives();
      setRelativesList(updatedRelatives);
      
      setShowDeleteRelative(false);
      setDeleteRelativeId(null);
    } catch (err) {
      setCareProfileSuccess(err.message || 'Có lỗi khi xóa người thân.');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Hàm đóng modal form
  const handleCloseCareProfileForm = () => setShowCareProfileForm(false);
  const handleCloseRelativeForm = () => setShowRelativeForm(false);

  return {
    user, loading, relativesList, careProfiles, zones, zoneDetails: zonedetailsList, careProfileFilter, setCareProfileFilter, relativesFilter, setRelativesFilter,
    showCareProfileForm, editCareProfile, careProfileForm, careProfileAvatar, careProfileAvatarFile, careProfileLoading,
    handleOpenCareProfileForm, handleCareProfileInputChange, handleCareProfileAvatarChange, handleSaveCareProfile,
    showRelativeForm, editRelative, currentCareID, relativeForm, avatarFile, avatarPreview, relativeLoading,
    handleOpenRelativeForm, handleRelativeInputChange, handleRelativeAvatarChange, handleSaveRelative,
    showDeleteCareProfile, deleteCareProfileId, deleteLoading, handleDeleteCareProfile, confirmDeleteCareProfile,
    showDeleteRelative, deleteRelativeId, handleDeleteRelative, confirmDeleteRelative,
    setShowDeleteCareProfile, setShowDeleteRelative,
    handleCloseCareProfileForm,
    handleCloseRelativeForm,
    showCareProfileDetail, detailCareProfile, handleOpenCareProfileDetail, handleCloseCareProfileDetail,
    showRelativeDetail, detailRelative, handleOpenRelativeDetail, handleCloseRelativeDetail,
    careProfileSuccess,
  };
}

// Hàm chuyển đổi ngày sang định dạng input type="date" (YYYY-MM-DD)
// Hỗ trợ cả định dạng DD-MM-YYYY và định dạng ISO như 2025-07-29T07:10:37.656
function formatDateForInput(dateStr) {
  if (!dateStr) return '';
  // Nếu là dạng DD-MM-YYYY thì convert
  if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
    const [d, m, y] = dateStr.split('-');
    return `${y}-${m}-${d}`;
  }
  // Nếu là dạng ISO 2025-07-29T07:10:37.656 hoặc 2025-07-29T07:10:37Z
  if (/^\d{4}-\d{2}-\d{2}T/.test(dateStr)) {
    // Cắt lấy phần ngày
    return dateStr.slice(0, 10);
  }
  // Nếu là dạng YYYY-MM-DD thì trả về luôn
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return dateStr;
  }
  // Nếu là dạng khác, trả về rỗng
  return '';
} 