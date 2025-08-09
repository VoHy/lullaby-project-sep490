// Modal Manager Hook - Quản lý tất cả modal states
import { useState } from 'react';

export const useModalManager = () => {
  const [modals, setModals] = useState({
    careProfileForm: false,
    relativeForm: false,
    careProfileDetail: false,
    relativeDetail: false,
    deleteCareProfile: false,
    deleteRelative: false
  });

  const [detailItems, setDetailItems] = useState({
    careProfile: null,
    relative: null
  });

  const [deleteIds, setDeleteIds] = useState({
    careProfile: null,
    relative: null
  });

  // Generic modal handlers
  const openModal = (modalName, data = null) => {
    setModals(prev => ({ ...prev, [modalName]: true }));
    
    // Handle detail modals
    if (modalName.includes('Detail')) {
      const type = modalName.replace('Detail', '');
      setDetailItems(prev => ({ ...prev, [type]: data }));
    }

    // Handle delete modals
    if (modalName.includes('delete')) {
      const type = modalName.replace('delete', '').toLowerCase();
      if (type === 'careprofile') {
        setDeleteIds(prev => ({ ...prev, careProfile: data }));
      } else {
        setDeleteIds(prev => ({ ...prev, [type]: data }));
      }
    }
  };

  const closeModal = (modalName) => {
    setModals(prev => ({ ...prev, [modalName]: false }));
    
    // Clear related data when closing
    if (modalName.includes('Detail')) {
      const type = modalName.replace('Detail', '');
      setDetailItems(prev => ({ ...prev, [type]: null }));
    }

    if (modalName.includes('delete')) {
      const type = modalName.replace('delete', '').toLowerCase();
      if (type === 'careprofile') {
        setDeleteIds(prev => ({ ...prev, careProfile: null }));
      } else {
        setDeleteIds(prev => ({ ...prev, [type]: null }));
      }
    }
  };

  return {
    modals,
    detailItems,
    deleteIds,
    openModal,
    closeModal
  };
};
