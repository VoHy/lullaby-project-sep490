import React from 'react';
import BaseModal from './shared/BaseModal';
import { FormField, AvatarUpload, FormActions, RELATIVE_DEFAULT_AVATAR } from './shared/FormComponents';
import ErrorDisplay from './shared/ErrorDisplay';
import { validateRelative, validateRelativeFields, prepareRelativeData, normalizeFieldNames } from '../utils/formUtils';

export default function RelativeFormModal({ 
  open, 
  onClose, 
  onSave, 
  formData, 
  onChange, 
  loading, 
  isEdit, 
  currentCareID,
  validationErrors = [],
  onClearErrors
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const normalized = normalizeFieldNames(formData);
  
  // Get field-specific errors
  const fieldErrors = validateRelativeFields(formData);

  const genderOptions = [
    { value: 'male', label: 'Nam' },
    { value: 'female', label: 'Nữ' },
    { value: 'other', label: 'Khác' }
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
              error={fieldErrors.relativeName}
            />
            
            <FormField
              label="Ngày sinh"
              name="dateOfBirth"
              type="date"
              value={normalized.dateOfBirth || ''}
              onChange={onChange}
              required={true}
              error={fieldErrors.dateOfBirth}
            />
            
            <FormField
              label="Giới tính"
              name="gender"
              type="select"
              value={normalized.gender || ''}
              onChange={onChange}
              placeholder="Chọn giới tính"
              options={genderOptions}
              required={true}
              error={fieldErrors.gender}
            />
          </div>
          
          <div className="col-span-1 flex flex-col gap-4 justify-between">
            <AvatarUpload
              currentImage={formData.image}
              defaultImage={RELATIVE_DEFAULT_AVATAR}
              onImageChange={onChange}
              size="w-24 h-24"
              name="image"
              error={fieldErrors.image}
            />
            
            <FormField
              label="Ghi chú"
              name="note"
              type="textarea"
              value={normalized.note || ''}
              onChange={onChange}
              error={fieldErrors.note}
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