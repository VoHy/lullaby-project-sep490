// Form utilities - Tập trung các hàm xử lý form và validation
export const formatDateForInput = (dateStr) => {
    if (!dateStr) return '';

    // Handle DD-MM-YYYY format
    if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
        const [d, m, y] = dateStr.split('-');
        return `${y}-${m}-${d}`;
    }

    // Handle ISO format
    if (/^\d{4}-\d{2}-\d{2}T/.test(dateStr)) {
        return dateStr.slice(0, 10);
    }

    // Already in YYYY-MM-DD format
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        return dateStr;
    }

    return '';
};

export const formatDateForAPI = (dateStr) => {
    if (!dateStr) return '';

    // Convert YYYY-MM-DD to ISO string
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        return new Date(dateStr).toISOString();
    }

    return dateStr;
};

// Common validation functions
export const validateCareProfile = (formData) => {
    const errors = [];

    if (!formData.profileName && !formData.ProfileName) {
        errors.push('Vui lòng nhập tên hồ sơ');
    }

    if (!formData.dateOfBirth && !formData.DateOfBirth) {
        errors.push('Vui lòng nhập ngày sinh');
    }

    if (!formData.phoneNumber && !formData.PhoneNumber) {
        errors.push('Vui lòng nhập số điện thoại');
    }

    if (!formData.address && !formData.Address) {
        errors.push('Vui lòng nhập địa chỉ');
    }

    return errors;
};

export const validateRelative = (formData) => {
    const errors = [];

    if (!formData.relativeName) {
        errors.push('Vui lòng nhập tên người thân');
    }

    return errors;
};

// Field name normalization utilities
export const normalizeFieldNames = (data) => {
    return {
        // Care Profile fields
        careProfileID: data.careProfileID,
        profileName: data.profileName,
        dateOfBirth: data.dateOfBirth,
        phoneNumber: data.phoneNumber,
        address: data.address,
        image: data.image,
        note: data.note,
        status: data.status,
        zoneDetailID: data.zoneDetailID,

        // Relative fields
        relativeID: data.relativeID,
        relativeName: data.relativeName,
        gender: data.gender || data.Gender,

        // Common fields
        accountID: data.accountID,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
    };
};

// Prepare data for API submission
export const prepareCareProfileData = (formData, user) => {
    const normalized = normalizeFieldNames(formData);

    return {
        accountID: user?.accountID,
        zoneDetailID: parseInt(normalized.zoneDetailID) || 1,
        profileName: normalized.profileName,
        dateOfBirth: formatDateForAPI(normalized.dateOfBirth),
        phoneNumber: normalized.phoneNumber,
        address: normalized.address,
        image: normalized.image || '/images/hero-bg.jpg',
        note: normalized.note || '',
        status: normalized.status || 'active'
    };
};

export const prepareRelativeData = (formData, careProfileID) => {
    const normalized = normalizeFieldNames(formData);

    return {
        careProfileID: careProfileID,
        relativeName: normalized.relativeName,
        dateOfBirth: formatDateForAPI(normalized.dateOfBirth),
        gender: normalized.gender || 'male',
        note: normalized.note || '',
        createdAt: new Date().toISOString(),
        status: normalized.status || 'active',
        image: normalized.image || '/images/hero-bg.jpg'
    };
};
