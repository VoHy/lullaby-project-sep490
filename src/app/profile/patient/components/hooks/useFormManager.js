// Form Manager Hook - Quản lý forms, validation và avatars
import { useState } from 'react';

// Utility function
const formatDateForInput = (dateStr) => {
  if (!dateStr) return '';
  if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
    const [d, m, y] = dateStr.split('-');
    return `${y}-${m}-${d}`;
  }
  if (/^\d{4}-\d{2}-\d{2}T/.test(dateStr)) {
    return dateStr.slice(0, 10);
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return dateStr;
  }
  return '';
};

// Initial form states
const INITIAL_CARE_PROFILE = {
  profileName: '', dateOfBirth: '', phoneNumber: '', address: '', 
  zoneDetailID: '', note: '', status: 'Active', image: ''
};

const INITIAL_RELATIVE = {
  relativeName: '', dateOfBirth: '', gender: '', note: '', status: 'Active', image: ''
};

export const useFormManager = () => {
  // Form data states
  const [forms, setForms] = useState({
    careProfile: INITIAL_CARE_PROFILE,
    relative: INITIAL_RELATIVE
  });

  // Edit items
  const [editItems, setEditItems] = useState({
    careProfile: null,
    relative: null
  });

  // Loading states
  const [loadingStates, setLoadingStates] = useState({
    careProfile: false,
    relative: false,
    delete: false
  });

  const [currentCareID, setCurrentCareID] = useState(null);

  // Generic form handlers
  const openForm = (type, item = null, extraData = null) => {
    setEditItems(prev => ({ ...prev, [type]: item }));
    
    if (type === 'relative' && extraData) {
      setCurrentCareID(extraData);
    }

    if (item) {
      const formData = { 
        ...item, 
        dateOfBirth: formatDateForInput(item.dateOfBirth) 
      };
      setForms(prev => ({ ...prev, [type]: formData }));
    } else {
      const initialData = type === 'careProfile' ? INITIAL_CARE_PROFILE : INITIAL_RELATIVE;
      setForms(prev => ({ ...prev, [type]: initialData }));
    }
  };

  const handleInputChange = (type, e) => {
    const { name, value, checked } = e.target;
    setForms(prev => ({ 
      ...prev, 
      [type]: {
        ...prev[type],
        [name]: e.target.type === 'checkbox' ? checked : value
      }
    }));
  };

  const handleAvatarChange = (type, e) => {
    // Now handles URL input instead of file upload
    const { value } = e.target;
    setForms(prev => ({ 
      ...prev, 
      [type]: {
        ...prev[type],
        image: value
      }
    }));
  };

  const updateLoading = (type, isLoading) => {
    setLoadingStates(prev => ({ ...prev, [type]: isLoading }));
  };

  const resetForm = (type) => {
    const initialData = type === 'careProfile' ? INITIAL_CARE_PROFILE : INITIAL_RELATIVE;
    setForms(prev => ({ ...prev, [type]: initialData }));
    setEditItems(prev => ({ ...prev, [type]: null }));
  };

  return {
    // States
    forms,
    editItems,
    loadingStates,
    currentCareID,
    
    // Functions
    openForm,
    handleInputChange,
    handleAvatarChange,
    updateLoading,
    resetForm,
    setCurrentCareID
  };
};
