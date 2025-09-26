import React from 'react';
import BaseModal from './shared/BaseModal';
import { FormField, AvatarUpload, FormActions, CARE_PROFILE_DEFAULT_AVATAR } from './shared/FormComponents';
import ErrorDisplay from './shared/ErrorDisplay';
import ZoneSelector from './ZoneSelector';
import { validateCareProfile, validateCareProfileFields, prepareCareProfileData, normalizeFieldNames } from '../utils/formUtils';

export default function CareProfileFormModal({ 
  open, 
  onClose, 
  onSave, 
  formData, 
  onChange, 
  loading, 
  isEdit, 
  zones = [], 
  zoneDetails = [], 
  user,
  validationErrors = [],
  onClearErrors,
  careProfileCreateReadonly = false
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const normalized = normalizeFieldNames(formData);
  
  // Get field-specific errors
  const fieldErrors = validateCareProfileFields(formData);

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Chỉnh sửa hồ sơ' : 'Tạo hồ sơ mới'}
      maxWidth="max-w-4xl"
    >
      <div className="max-h-[70vh] overflow-y-auto pr-2">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Cột trái: Thông tin */}
            <div className="space-y-4">
              <FormField
                label="Tên hồ sơ"
                name="profileName"
                value={normalized.profileName || ''}
                onChange={onChange}
                required={true}
                error={fieldErrors.profileName}
                disabled={careProfileCreateReadonly && !isEdit}
              />

              <FormField
                label="Ngày sinh"
                name="dateOfBirth"
                type="date"
                value={normalized.dateOfBirth || ''}
                onChange={onChange}
                required={true}
                error={fieldErrors.dateOfBirth}
                disabled={careProfileCreateReadonly && !isEdit}
              />

              <FormField
                label="Số điện thoại"
                name="phoneNumber"
                value={normalized.phoneNumber || ''}
                onChange={onChange}
                required={true}
                error={fieldErrors.phoneNumber}
              />

              <ZoneSelector
                zones={zones}
                zoneDetails={zoneDetails}
                selectedZoneDetailID={normalized.zoneDetailID || ''}
                onChange={onChange}
                required={true}
                label="Khu vực"
                error={fieldErrors.zoneDetailID}
              />

              <FormField
                label="Địa chỉ"
                name="address"
                type="textarea"
                value={normalized.address || ''}
                onChange={onChange}
                required={true}
                error={fieldErrors.address}
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

            {/* Cột phải: Thông tin bổ sung */}
            <div className="flex flex-col items-center justify-start gap-4 pt-2">
              <AvatarUpload
                currentImage={formData.image}
                defaultImage={CARE_PROFILE_DEFAULT_AVATAR}
                onImageChange={onChange}
                size="w-32 h-32"
                name="image"
                error={fieldErrors.image}
              />
            </div>
          </div>

          <FormActions
            onCancel={onClose}
            loading={loading}
            submitText={isEdit ? 'Cập nhật' : 'Tạo hồ sơ'}
          />
        </form>
      </div>
    </BaseModal>
  );
} 