import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { useModalManager } from './hooks/useModalManager';
import { useDataManager } from './hooks/useDataManager';
import { useFormManager } from './hooks/useFormManager';

export default function useCareProfileManager(router) {
  const { user } = useContext(AuthContext);
  const [successMessage, setSuccessMessage] = useState('');
  const [showMedicalNotesModal, setShowMedicalNotesModal] = useState(false);
  const [selectedCareProfile, setSelectedCareProfile] = useState(null);
  const [careProfileCreateReadonly, setCareProfileCreateReadonly] = useState(false);

  // Use custom hooks
  const modalManager = useModalManager();
  const dataManager = useDataManager(user, router);
  const formManager = useFormManager();

  // Auto-hide success message
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Integrated handlers
  const handleOpenCareProfileForm = (item = null) => {
    // Reset readonly flag by default
    setCareProfileCreateReadonly(false);
    formManager.openForm('careProfile', item);

    // If creating new (no item) and there is already at least one care profile,
    // prefill the profileName to match and make profileName readonly
    if (!item && Array.isArray(dataManager.careProfiles) && dataManager.careProfiles.length > 0) {
      const first = dataManager.careProfiles[0];
      const existingName = (first.profileName || first.ProfileName || '').toString().trim();
      const existingDOBRaw = (first.dateOfBirth || first.DateOfBirth || first.dateofbirth || '').toString().trim();

      if (existingName) {
        formManager.setFormField('careProfile', 'profileName', existingName);
        setCareProfileCreateReadonly(true);
      }

      // Prefill dateOfBirth formatted as yyyy-mm-dd for the date input
      if (existingDOBRaw) {
        try {
          const d = new Date(existingDOBRaw);
          if (!isNaN(d)) {
            const y = d.getFullYear();
            const m = ('' + (d.getMonth() + 1)).padStart(2, '0');
            const dd = ('' + d.getDate()).padStart(2, '0');
            const formatted = `${y}-${m}-${dd}`;
            formManager.setFormField('careProfile', 'dateOfBirth', formatted);
          } else {
            // fallback: if raw looks like dd-mm-yyyy, try to convert
            const dm = existingDOBRaw.match(/(\d{2})[-\/](\d{2})[-\/](\d{4})/);
            if (dm) {
              formManager.setFormField('careProfile', 'dateOfBirth', `${dm[3]}-${dm[2]}-${dm[1]}`);
            }
          }
        } catch (e) {
          // ignore formatting errors
        }
      }
    }

    // If editing an existing item, disallow editing name if the item is not the first care profile
    if (item && Array.isArray(dataManager.careProfiles) && dataManager.careProfiles.length > 0) {
      const firstCareId = dataManager.careProfiles[0].careProfileID || dataManager.careProfiles[0].CareProfileID || dataManager.careProfiles[0].careprofileID;
      const editId = item.careProfileID || item.CareProfileID || item.careprofileID;
      if (firstCareId && editId && firstCareId.toString() !== editId.toString()) {
        // Not the first profile -> name should be readonly
        setCareProfileCreateReadonly(true);
      }
    }

    modalManager.openModal('careProfileForm');
  };

  const handleOpenRelativeForm = (item = null, careProfileID = null) => {
    formManager.openForm('relative', item, careProfileID);
    modalManager.openModal('relativeForm');
  };

  const handleViewMedicalNotes = (careProfile) => {
    setSelectedCareProfile(careProfile);
    setShowMedicalNotesModal(true);
  };

  const handleCloseMedicalNotesModal = () => {
    setShowMedicalNotesModal(false);
    setSelectedCareProfile(null);
  };

  const handleSaveCareProfile = async (dataOrEvent) => {
    let data = dataOrEvent;
    if (dataOrEvent && typeof dataOrEvent.preventDefault === 'function') {
      dataOrEvent.preventDefault();
      data = formManager.forms.careProfile;
    }

    formManager.updateLoading('careProfile', true);
    setSuccessMessage('');

    try {
      const result = await dataManager.saveCareProfile(data, formManager.editItems.careProfile, user);
      setSuccessMessage(result.message);
      modalManager.closeModal('careProfileForm');
      formManager.resetForm('careProfile');
      // Reload data after successful save to ensure UI is updated
      await dataManager.loadData();
    } catch (err) {
      console.error('Error saving care profile:', err);
      if (err.validationErrors && err.validationErrors.length > 0) {
        // Set validation errors to form manager
        formManager.setFormValidationErrors('careProfile', err.validationErrors);
      } else {
        setSuccessMessage(err.message || 'Có lỗi khi xử lý hồ sơ.');
      }
    } finally {
      formManager.updateLoading('careProfile', false);
    }
  };

  const handleSaveRelative = async (dataOrEvent) => {
    let data = dataOrEvent;
    if (dataOrEvent && typeof dataOrEvent.preventDefault === 'function') {
      dataOrEvent.preventDefault();
      data = formManager.forms.relative;
    }

    formManager.updateLoading('relative', true);
    setSuccessMessage('');

    try {
      const result = await dataManager.saveRelative(data, formManager.editItems.relative, formManager.currentCareID);
      setSuccessMessage(result.message);
      modalManager.closeModal('relativeForm');
      formManager.resetForm('relative');
      // Reload data after successful save to ensure UI is updated
      await dataManager.loadData();
    } catch (err) {
      console.error('Error saving relative:', err);
      if (err.validationErrors && err.validationErrors.length > 0) {
        // Set validation errors to form manager
        formManager.setFormValidationErrors('relative', err.validationErrors);
      } else {
        setSuccessMessage(err.message || 'Có lỗi khi xử lý người thân.');
      }
    } finally {
      formManager.updateLoading('relative', false);
    }
  };

  const handleDeleteCareProfile = (id) => {
    modalManager.openModal('deleteCareProfile', id);
  };

  const confirmDeleteCareProfile = async () => {
    formManager.updateLoading('delete', true);
    try {
      const result = await dataManager.deleteCareProfile(modalManager.deleteIds.careProfile);
      // Đóng modal trước khi hiển thị message
      modalManager.closeModal('deleteCareProfile');
      // Reload data after successful delete
      await dataManager.loadData();
      // Delay một chút để đảm bảo modal đã đóng
      setTimeout(() => {
        setSuccessMessage(result.message);
      }, 100);
    } catch (err) {
      // Đóng modal ngay cả khi có lỗi
      modalManager.closeModal('deleteCareProfile');
      setTimeout(() => {
        setSuccessMessage(err.message || 'Có lỗi khi xóa hồ sơ.');
      }, 100);
    } finally {
      formManager.updateLoading('delete', false);
    }
  };

  const handleDeleteRelative = (id) => {
    modalManager.openModal('deleteRelative', id);
  };

  const confirmDeleteRelative = async () => {
    formManager.updateLoading('delete', true);
    try {
      const result = await dataManager.deleteRelative(modalManager.deleteIds.relative);
      // Đóng modal trước khi hiển thị message
      modalManager.closeModal('deleteRelative');
      // Reload data after successful delete
      await dataManager.loadData();
      // Delay một chút để đảm bảo modal đã đóng
      setTimeout(() => {
        setSuccessMessage(result.message);
      }, 100);
    } catch (err) {
      // Đóng modal ngay cả khi có lỗi
      modalManager.closeModal('deleteRelative');
      setTimeout(() => {
        setSuccessMessage(err.message || 'Có lỗi khi xóa người thân.');
      }, 100);
    } finally {
      formManager.updateLoading('delete', false);
    }
  };

  return {
    // User & data
    user,
    loading: dataManager.loading,
    careProfiles: dataManager.careProfiles,
    relativesList: dataManager.relativesList,
    zones: dataManager.zones,
    zoneDetails: dataManager.zonedetailsList,
    
    // Filters
    careProfileFilter: dataManager.careProfileFilter,
    setCareProfileFilter: dataManager.setCareProfileFilter,
    relativesFilter: dataManager.relativesFilter,
    setRelativesFilter: dataManager.setRelativesFilter,
    
    // Modals
    showCareProfileForm: modalManager.modals.careProfileForm,
    showRelativeForm: modalManager.modals.relativeForm,
    showCareProfileDetail: modalManager.modals.careProfileDetail,
    showRelativeDetail: modalManager.modals.relativeDetail,
    showDeleteCareProfile: modalManager.modals.deleteCareProfile,
    showDeleteRelative: modalManager.modals.deleteRelative,
    showMedicalNotesModal,
    selectedCareProfile,
    
    // Form data
    editCareProfile: formManager.editItems.careProfile,
    editRelative: formManager.editItems.relative,
    careProfileForm: formManager.forms.careProfile,
    relativeForm: formManager.forms.relative,
    currentCareID: formManager.currentCareID,
    
    // Loading states
    careProfileLoading: formManager.loadingStates.careProfile,
    relativeLoading: formManager.loadingStates.relative,
    deleteLoading: formManager.loadingStates.delete,
    
    // Detail items
    detailCareProfile: modalManager.detailItems.careProfile,
    detailRelative: modalManager.detailItems.relative,
    
    // Delete IDs
    deleteCareProfileId: modalManager.deleteIds.careProfile,
    deleteRelativeId: modalManager.deleteIds.relative,
    
    // Messages
    careProfileSuccess: successMessage, // Keep backward compatibility
    successMessage,
    
    // Handlers
    handleOpenCareProfileForm,
    handleOpenRelativeForm,
    handleSaveCareProfile,
    handleSaveRelative,
    handleDeleteCareProfile,
    confirmDeleteCareProfile,
    handleDeleteRelative,
    confirmDeleteRelative,
    handleViewMedicalNotes,
    handleCloseMedicalNotesModal,
    
    // Input handlers
    handleCareProfileInputChange: (e) => formManager.handleInputChange('careProfile', e),
    handleRelativeInputChange: (e) => formManager.handleInputChange('relative', e),
    
    // Modal handlers
  handleCloseCareProfileForm: () => { setCareProfileCreateReadonly(false); modalManager.closeModal('careProfileForm'); },
    handleCloseRelativeForm: () => modalManager.closeModal('relativeForm'),
    handleOpenCareProfileDetail: (item) => modalManager.openModal('careProfileDetail', item),
    handleCloseCareProfileDetail: () => modalManager.closeModal('careProfileDetail'),
    handleOpenRelativeDetail: (item) => modalManager.openModal('relativeDetail', item),
    handleCloseRelativeDetail: () => modalManager.closeModal('relativeDetail'),
    
    // Close delete modals (backward compatibility)
    setShowDeleteCareProfile: (show) => show ? null : modalManager.closeModal('deleteCareProfile'),
    setShowDeleteRelative: (show) => show ? null : modalManager.closeModal('deleteRelative'),
    
    // Validation errors
    careProfileValidationErrors: formManager.validationErrors.careProfile,
    relativeValidationErrors: formManager.validationErrors.relative,
    clearCareProfileErrors: () => formManager.clearValidationErrors('careProfile'),
  // Readonly flags for create form (when second+ profiles are created)
  careProfileCreateReadonly,
    clearRelativeErrors: () => formManager.clearValidationErrors('relative'),
    
    // Utilities
    loadData: dataManager.loadData
  };
}
