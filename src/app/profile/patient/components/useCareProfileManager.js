import { useState, useEffect } from 'react';
import authService from '@/services/auth/authService';
import relativesService from '@/services/api/relativesService';
import zoneService from '@/services/api/zoneService';
import careProfileService from '@/services/api/careProfileService';
import zoneDetails from '@/mock/Zone_Detail';

export default function useCareProfileManager(router) {
  // State
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relativesList, setRelativesList] = useState([]);
  const [careProfiles, setCareProfiles] = useState([]);
  const [zones, setZones] = useState([]);
  const [zoneDetailsList, setZoneDetailsList] = useState(zoneDetails);
  const [careProfileFilter, setCareProfileFilter] = useState('all');
  const [relativesFilter, setRelativesFilter] = useState({});

  // Modal/form state
  const [showCareProfileForm, setShowCareProfileForm] = useState(false);
  const [editCareProfile, setEditCareProfile] = useState(null);
  const [careProfileForm, setCareProfileForm] = useState({
    ProfileName: '', DateOfBirth: '', PhoneNumber: '', Address: '', ZoneDetailID: '', CustomZoneName: '', Note: '', Status: 'active', Image: '',
  });
  const [careProfileAvatarFile, setCareProfileAvatarFile] = useState(null);
  const [careProfileAvatar, setCareProfileAvatar] = useState('');
  const [careProfileLoading, setCareProfileLoading] = useState(false);

  const [showRelativeForm, setShowRelativeForm] = useState(false);
  const [editRelative, setEditRelative] = useState(null);
  const [currentCareID, setCurrentCareID] = useState(null);
  const [relativeForm, setRelativeForm] = useState({
    Relative_Name: '', DateOfBirth: '', Gender: '', Note: '', Status: 'active', Image: '',
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
    if (!authService.isAuthenticated()) {
      router.push('/auth/login');
      return;
    }
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    careProfileService.getCareProfiles().then(careProfiles => {
      const myCareProfiles = careProfiles.filter(c => c.AccountID === currentUser.AccountID);
      setCareProfiles(myCareProfiles);
      relativesService.getRelatives().then(relatives => {
        setRelativesList(relatives);
      });
    });
    zoneService.getZones().then(setZones);
    setLoading(false);
  }, [router]);

  // CareProfile handlers
  const handleOpenCareProfileForm = (care = null) => {
    setEditCareProfile(care);
    setShowCareProfileForm(true);
    if (care) {
      setCareProfileForm({
        ...care,
        DateOfBirth: formatDateForInput(care.DateOfBirth),
      });
      setCareProfileAvatar(care.Image || '');
    } else {
      setCareProfileForm({ ProfileName: '', DateOfBirth: '', PhoneNumber: '', Address: '', ZoneDetailID: '', CustomZoneName: '', Note: '', Status: 'active', Image: '' });
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
  const handleSaveCareProfile = e => {
    e.preventDefault();
    setCareProfileLoading(true);
    // ... logic thêm/sửa careProfile (mock)
    setTimeout(() => {
      setShowCareProfileForm(false);
      setCareProfileLoading(false);
    }, 800);
  };

  // Relative handlers
  const handleOpenRelativeForm = (relative = null, careProfileID = null) => {
    setEditRelative(relative);
    setShowRelativeForm(true);
    setCurrentCareID(careProfileID);
    if (relative) {
      setRelativeForm({
        ...relative,
        DateOfBirth: formatDateForInput(relative.DateOfBirth),
      });
      setAvatarPreview(relative.Image || '');
    } else {
      setRelativeForm({ Relative_Name: '', DateOfBirth: '', Gender: '', Note: '', Status: 'active', Image: '' });
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
  const handleSaveRelative = e => {
    e.preventDefault();
    setRelativeLoading(true);
    // ... logic thêm/sửa relative (mock)
    setTimeout(() => {
      setShowRelativeForm(false);
      setRelativeLoading(false);
    }, 800);
  };

  // Delete handlers
  const handleDeleteCareProfile = id => {
    setDeleteCareProfileId(id);
    setShowDeleteCareProfile(true);
  };
  const confirmDeleteCareProfile = () => {
    setDeleteLoading(true);
    // ... logic xoá (mock)
    setTimeout(() => {
      setShowDeleteCareProfile(false);
      setDeleteCareProfileId(null);
      setDeleteLoading(false);
    }, 800);
  };
  const handleDeleteRelative = id => {
    setDeleteRelativeId(id);
    setShowDeleteRelative(true);
  };
  const confirmDeleteRelative = () => {
    setDeleteLoading(true);
    // ... logic xoá (mock)
    setTimeout(() => {
      setShowDeleteRelative(false);
      setDeleteRelativeId(null);
      setDeleteLoading(false);
    }, 800);
  };

  // Hàm đóng modal form
  const handleCloseCareProfileForm = () => setShowCareProfileForm(false);
  const handleCloseRelativeForm = () => setShowRelativeForm(false);

  return {
    user, loading, relativesList, careProfiles, zones, zoneDetails: zoneDetailsList, careProfileFilter, setCareProfileFilter, relativesFilter, setRelativesFilter,
    showCareProfileForm, editCareProfile, careProfileForm, careProfileAvatar, careProfileAvatarFile, careProfileLoading,
    handleOpenCareProfileForm, handleCareProfileInputChange, handleCareProfileAvatarChange, handleSaveCareProfile,
    showRelativeForm, editRelative, currentCareID, relativeForm, avatarFile, avatarPreview, relativeLoading,
    handleOpenRelativeForm, handleRelativeInputChange, handleRelativeAvatarChange, handleSaveRelative,
    showDeleteCareProfile, deleteCareProfileId, deleteLoading, handleDeleteCareProfile, confirmDeleteCareProfile,
    showDeleteRelative, deleteRelativeId, handleDeleteRelative, confirmDeleteRelative,
    handleCloseCareProfileForm,
    handleCloseRelativeForm,
    showCareProfileDetail, detailCareProfile, handleOpenCareProfileDetail, handleCloseCareProfileDetail,
    showRelativeDetail, detailRelative, handleOpenRelativeDetail, handleCloseRelativeDetail,
  };
}

function formatDateForInput(dateStr) {
  if (!dateStr) return '';
  // Nếu là dạng DD-MM-YYYY thì convert
  if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
    const [d, m, y] = dateStr.split('-');
    return `${y}-${m}-${d}`;
  }
  // Nếu là dạng khác, trả về rỗng
  return '';
} 