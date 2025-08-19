import React from 'react';
import BaseModal from './shared/BaseModal';
import { FormField, AvatarUpload, FormActions } from './shared/FormComponents';
import ZoneSelector from './ZoneSelector';
import { validateCareProfile, prepareCareProfileData, normalizeFieldNames } from '../utils/formUtils';

export default function CareProfileFormModal({ open, onClose, onSave, formData, onChange, loading, isEdit, zones = [], zoneDetails = [], user }) {
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation using utility function
    const errors = validateCareProfile(formData);
    if (errors.length > 0) {
      alert(errors[0]);
      return;
    }

    // Prepare data using utility function
    const submitData = prepareCareProfileData(formData, user);
    onSave(submitData);
  };

  const normalized = normalizeFieldNames(formData);

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
                label="Số điện thoại"
                name="phoneNumber"
                value={normalized.phoneNumber || ''}
                onChange={onChange}
                required={true}
              />

              <ZoneSelector
                zones={zones}
                zoneDetails={zoneDetails}
                selectedZoneDetailID={normalized.zoneDetailID || ''}
                onChange={onChange}
                required={false}
                label="Khu vực"
              />

              <FormField
                label="Địa chỉ"
                name="address"
                type="textarea"
                value={normalized.address || ''}
                onChange={onChange}
                required={true}
              />

              <FormField
                label="Ghi chú"
                name="note"
                type="textarea"
                value={normalized.note || ''}
                onChange={onChange}
              />
            </div>

            {/* Cột phải: Ảnh đại diện */}
            <div className="flex flex-col items-center justify-start gap-4 pt-2">
              <AvatarUpload
                currentImage={formData.image}
                onImageChange={onChange}
                size="w-32 h-32"
                name="image"
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