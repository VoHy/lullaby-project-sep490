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

// Helpers
const isValidPhone = (phone) => {
    if (!phone) return false;
    // Accept numbers with optional leading +, 8-15 digits total
    const generic = /^\+?\d{8,15}$/;
    // Or local VN style 0XXXXXXXXX (9-10 digits after 0)
    const vn = /^0\d{9,10}$/;
    return generic.test(phone) || vn.test(phone);
};

const isValidPastDate = (value) => {
    if (!value) return false;
    const d = new Date(value);
    if (isNaN(d.getTime())) return false;
    const now = new Date();
    // Normalize to date-only comparison
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const day = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    // Must not be in the future and not older than 130 years
    const min = new Date(today.getFullYear() - 130, today.getMonth(), today.getDate());
    return day <= today && day >= min;
};

// Common validation functions
export const validateCareProfile = (formData) => {
    const errors = [];

    const profileName = formData.profileName || formData.ProfileName;
    const dateOfBirth = formData.dateOfBirth || formData.DateOfBirth;
    const phoneNumber = formData.phoneNumber || formData.PhoneNumber;
    const address = formData.address || formData.Address;
    const status = (formData.status || '').toString().toLowerCase();
    const image = formData.image || formData.Image;

    if (!profileName || profileName.trim().length < 2) {
        errors.push('Vui lòng nhập tên hồ sơ (tối thiểu 2 ký tự)');
    }

    if (!dateOfBirth) {
        errors.push('Vui lòng nhập ngày sinh');
    } else if (!isValidPastDate(dateOfBirth)) {
        errors.push('Ngày sinh không hợp lệ');
    }

    if (!phoneNumber) {
        errors.push('Vui lòng nhập số điện thoại');
    } else if (!isValidPhone(phoneNumber)) {
        errors.push('Số điện thoại không hợp lệ');
    }

    if (!address || address.trim().length < 5) {
        errors.push('Vui lòng nhập địa chỉ (tối thiểu 5 ký tự)');
    }

    if (image && image !== 'string' && image.trim() !== '' && !/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(image)) {
        errors.push('URL ảnh đại diện không hợp lệ.');
    }

    if (status && !['active', 'inactive'].includes(status)) {
        errors.push('Trạng thái không hợp lệ');
    }

    return errors;
};

export const validateRelative = (formData) => {
    const errors = [];

    const relativeName = formData.relativeName || formData.RelativeName;
    const dateOfBirth = formData.dateOfBirth || formData.DateOfBirth;
    const gender = (formData.gender || formData.Gender || '').toString().toLowerCase();
    const status = (formData.status || '').toString().toLowerCase();
    const image = formData.image || formData.Image;

    if (!relativeName || relativeName.trim().length < 2) {
        errors.push('Vui lòng nhập tên người thân (tối thiểu 2 ký tự)');
    }

    if (!dateOfBirth) {
        errors.push('Vui lòng nhập ngày sinh người thân');
    } else if (!isValidPastDate(dateOfBirth)) {
        errors.push('Ngày sinh người thân không hợp lệ');
    }

    if (gender && !['male', 'female', 'other'].includes(gender)) {
        errors.push('Giới tính không hợp lệ');
    }

    if (image && image !== 'string' && image.trim() !== '' && !/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(image)) {
        errors.push('URL ảnh đại diện không hợp lệ.');
    }

    if (status && !['active', 'inactive'].includes(status)) {
        errors.push('Trạng thái không hợp lệ');
    }

    return errors;
};

// Field name normalization utilities
export const normalizeFieldNames = (data) => {
    const d = data || {};
    return {
        // Care Profile fields
        careProfileID: d.careProfileID || d.CareProfileID || d.careprofileid,
        profileName: d.profileName || d.ProfileName,
        dateOfBirth: d.dateOfBirth || d.DateOfBirth,
        phoneNumber: d.phoneNumber || d.PhoneNumber,
        address: d.address || d.Address,
        image: d.image || d.Image,
        note: d.note || d.Note,
        status: d.status || d.Status,
        zoneDetailID: d.zoneDetailID || d.ZoneDetailID || d.ZonedetailID || d.zonedetailid,

        // Relative fields
        relativeID: d.relativeID || d.RelativeID || d.relativeid,
        relativeName: d.relativeName || d.RelativeName,
        gender: d.gender || d.Gender,

        // Common fields
        accountID: d.accountID || d.AccountID,
        createdAt: d.createdAt || d.CreatedAt,
        updatedAt: d.updatedAt || d.UpdatedAt
    };
};

// Prepare data for API submission
export const prepareCareProfileData = (formData, user) => {
    const normalized = normalizeFieldNames(formData);
    // Keep empty string as is for database compatibility
    const imageUrl = normalized.image && normalized.image !== 'string'
        ? normalized.image.trim()
        : null;

    return {
        accountID: user?.accountID ?? null,
        zoneDetailID: normalized.zoneDetailID ? parseInt(normalized.zoneDetailID) : null,
        profileName: normalized.profileName ?? null,
        dateOfBirth: normalized.dateOfBirth ? formatDateForAPI(normalized.dateOfBirth) : null,
        phoneNumber: normalized.phoneNumber ?? null,
        address: normalized.address ?? null,
        image: imageUrl,
        note: (typeof normalized.note === 'string' ? normalized.note : '') ?? '',
        status: normalized.status
            ? normalized.status.toString().toLowerCase()
            : 'active'
    };
};

export const prepareRelativeData = (formData, careProfileID) => {
    const normalized = normalizeFieldNames(formData);
    // Keep empty string as is for database compatibility
    const imageUrl = normalized.image && normalized.image !== 'string'
        ? normalized.image.trim()
        : null;

    return {
        careProfileID: careProfileID ?? null,
        relativeName: normalized.relativeName ?? null,
        dateOfBirth: normalized.dateOfBirth ? formatDateForAPI(normalized.dateOfBirth) : null,
        gender: normalized.gender
            ? normalized.gender.toString().toLowerCase()
            : 'male',
        note: (typeof normalized.note === 'string' ? normalized.note : '') ?? '',
        createdAt: new Date().toISOString(),
        status: normalized.status
            ? normalized.status.toString().toLowerCase()
            : 'active',
        image: imageUrl
    };
};
