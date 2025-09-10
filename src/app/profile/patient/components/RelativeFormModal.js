import React from 'react';
import BaseModal from './shared/BaseModal';
import { FormField, AvatarUpload, FormActions } from './shared/FormComponents';
import { validateRelative, prepareRelativeData, normalizeFieldNames } from '../utils/formUtils';

export default function RelativeFormModal({ open, onClose, onSave, formData, onChange, loading, isEdit, currentCareID }) {
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation using utility function
    const errors = validateRelative(formData);
    if (errors.length > 0) {
      alert(errors[0]);
      return;
    }

    // Prepare data using utility function
    const submitData = prepareRelativeData(formData, currentCareID);
    onSave(submitData);
  };

  const normalized = normalizeFieldNames(formData);

  const genderOptions = [
    { value: 'male', label: 'Nam' },
    { value: 'female', label: 'Nữ' },
    { value: 'other', label: 'Khác' }
  ];

  const statusOptions = [
    { value: 'active', label: 'Hoạt động' },
    { value: 'inactive', label: 'Ngừng hoạt động' }
  ];

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Sửa người thân' : 'Thêm người thân'}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-1 space-y-4">
            <FormField
              label="Tên người thân"
              name="relativeName"
              value={normalized.relativeName || ''}
              onChange={onChange}
              required={true}
            />
            
            <FormField
              label="Ngày sinh"
              name="dateOfBirth"
              type="date"
              value={normalized.dateOfBirth || ''}
              onChange={onChange}
              required={true}
            />
            
            <FormField
              label="Giới tính"
              name="gender"
              type="select"
              value={normalized.gender || ''}
              onChange={onChange}
              placeholder="Chọn giới tính"
              options={genderOptions}
            />
          </div>
          
          <div className="col-span-1 flex flex-col gap-4 justify-between">
            <AvatarUpload
              currentImage={formData.image}
              onImageChange={onChange}
              size="w-24 h-24"
              name="image"
            />
            
            <FormField
              label="Ghi chú"
              name="note"
              value={normalized.note || ''}
              onChange={onChange}
            />
            
            <FormField
              label="Trạng thái"
              name="status"
              type="select"
              value={normalized.status || 'active'}
              onChange={onChange}
              options={statusOptions}
            />
          </div>
        </div>
        
        <FormActions
          onCancel={onClose}
          loading={loading}
          submitText="Lưu"
        />
      </form>
    </BaseModal>
  );
} 