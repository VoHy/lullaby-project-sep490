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
    // Remove all spaces and non-digit characters
    const cleanPhone = phone.replace(/[\s\-\(\)\.]/g, '');
    
    // Check if phone starts with 0 and has 9-10 digits total
    const vietnamesePhone = /^0\d{8,10}$/;
    
    return vietnamesePhone.test(cleanPhone);
};

const isValidName = (name) => {
    if (!name || name.trim().length < 2) return false;
    // Allow Vietnamese characters, spaces, and common punctuation
    const namePattern = /^[a-zA-ZÀ-ỹĐđ\s\-\.]{2,50}$/;
    return namePattern.test(name.trim());
};

const isValidAddress = (address) => {
    if (!address || typeof address !== 'string') return false;
    const trimmedAddress = address.trim();
    
    // Check length constraints
    if (trimmedAddress.length < 5 || trimmedAddress.length > 200) return false;
    
    // Check for minimum meaningful content (at least some letters and/or numbers)
    const meaningfulChars = /[a-zA-ZÀ-ỹ0-9]/g;
    const matches = trimmedAddress.match(meaningfulChars);
    if (!matches || matches.length < 3) return false;
    
    // Address should not be just numbers or just special characters
    const hasLetters = /[a-zA-ZÀ-ỹ]/;
    const hasNumbers = /[0-9]/;
    
    return hasLetters.test(trimmedAddress) || hasNumbers.test(trimmedAddress);
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

// Field-specific validation function
export const validateCareProfileFields = (formData) => {
    const fieldErrors = {};

    const profileName = formData.profileName || formData.ProfileName;
    const dateOfBirth = formData.dateOfBirth || formData.DateOfBirth;
    const phoneNumber = formData.phoneNumber || formData.PhoneNumber;
    const address = formData.address || formData.Address;
    const status = (formData.status || '').toString().toLowerCase();
    const note = formData.note || formData.Note;
    const zoneDetailID = formData.zoneDetailID || formData.ZoneDetailID || formData.ZonedetailID || formData.zonedetailid;

    // Validate profile name
    if (!profileName || !profileName.trim()) {
        fieldErrors.profileName = 'Tên hồ sơ không được để trống';
    } else if (!isValidName(profileName)) {
        fieldErrors.profileName = 'Tên hồ sơ không hợp lệ (2-50 ký tự, chỉ chứa chữ cái, dấu cách, dấu gạch ngang và dấu chấm)';
    }

    // Validate date of birth
    if (!dateOfBirth) {
        fieldErrors.dateOfBirth = 'Ngày sinh không được để trống';
    } else if (!isValidPastDate(dateOfBirth)) {
        const inputDate = new Date(dateOfBirth);
        const now = new Date();
        if (isNaN(inputDate.getTime())) {
            fieldErrors.dateOfBirth = 'Ngày sinh không đúng định dạng';
        } else if (inputDate > now) {
            fieldErrors.dateOfBirth = 'Ngày sinh không thể trong tương lai';
        } else {
            fieldErrors.dateOfBirth = 'Ngày sinh không hợp lệ (không quá 130 năm)';
        }
    }

    // Validate phone number
    if (!phoneNumber || !phoneNumber.trim()) {
        fieldErrors.phoneNumber = 'Số điện thoại không được để trống';
    } else if (!isValidPhone(phoneNumber)) {
        fieldErrors.phoneNumber = 'Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại từ 9-10 chữ số bắt đầu bằng số 0 (VD: 0901234567)';
    }

    // Validate address
    if (!address || !address.trim()) {
        fieldErrors.address = 'Địa chỉ không được để trống';
    } else if (!isValidAddress(address)) {
        fieldErrors.address = 'Địa chỉ không hợp lệ (5-200 ký tự)';
    }

    // Validate zone detail ID
    if (!zoneDetailID) {
        fieldErrors.zoneDetailID = 'Vui lòng chọn khu vực phục vụ';
    } else if (isNaN(parseInt(zoneDetailID))) {
        fieldErrors.zoneDetailID = 'Khu vực phục vụ không hợp lệ';
    }

    // Validate note length (optional)
    if (note && typeof note === 'string' && note.trim().length > 500) {
        fieldErrors.note = 'Ghi chú không được vượt quá 500 ký tự';
    }

    // Validate status
    if (status && !['active', 'inactive'].includes(status)) {
        fieldErrors.status = 'Trạng thái không hợp lệ. Chỉ chấp nhận: active hoặc inactive';
    }

    return fieldErrors;
};

// Common validation functions (backward compatibility)
export const validateCareProfile = (formData) => {
    const errors = {};
    const errorList = [];

    const profileName = formData.profileName || formData.ProfileName;
    const dateOfBirth = formData.dateOfBirth || formData.DateOfBirth;
    const phoneNumber = formData.phoneNumber || formData.PhoneNumber;
    const address = formData.address || formData.Address;
    const status = (formData.status || '').toString().toLowerCase();
    const image = formData.image || formData.Image;
    const note = formData.note || formData.Note;
    const zoneDetailID = formData.zoneDetailID || formData.ZoneDetailID || formData.ZonedetailID || formData.zonedetailid;

    // Validate profile name
    if (!profileName || !profileName.trim()) {
        errors.profileName = 'Tên hồ sơ không được để trống';
        errorList.push('Tên hồ sơ không được để trống');
    } else if (!isValidName(profileName)) {
        errors.profileName = 'Tên hồ sơ không hợp lệ (2-50 ký tự, chỉ chứa chữ cái, dấu cách, dấu gạch ngang và dấu chấm)';
        errorList.push('Tên hồ sơ không hợp lệ (2-50 ký tự, chỉ chứa chữ cái, dấu cách, dấu gạch ngang và dấu chấm)');
    }

    // Validate date of birth
    if (!dateOfBirth) {
        errors.dateOfBirth = 'Ngày sinh không được để trống';
        errorList.push('Ngày sinh không được để trống');
    } else if (!isValidPastDate(dateOfBirth)) {
        const inputDate = new Date(dateOfBirth);
        const now = new Date();
        if (isNaN(inputDate.getTime())) {
            errors.dateOfBirth = 'Ngày sinh không đúng định dạng';
            errorList.push('Ngày sinh không đúng định dạng');
        } else if (inputDate > now) {
            errors.dateOfBirth = 'Ngày sinh không thể trong tương lai';
            errorList.push('Ngày sinh không thể trong tương lai');
        } else {
            errors.dateOfBirth = 'Ngày sinh không hợp lệ (không quá 130 năm)';
            errorList.push('Ngày sinh không hợp lệ (không quá 130 năm)');
        }
    }

    // Validate phone number
    if (!phoneNumber || !phoneNumber.trim()) {
        errors.phoneNumber = 'Số điện thoại không được để trống';
        errorList.push('Số điện thoại không được để trống');
    } else if (!isValidPhone(phoneNumber)) {
        errors.phoneNumber = 'Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại từ 9-11 chữ số bắt đầu bằng số 0 (VD: 0901234567)';
        errorList.push('Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại từ 9-11 chữ số bắt đầu bằng số 0 (VD: 0901234567)');
    }

    // Validate address
    if (!address || !address.trim()) {
        errors.address = 'Địa chỉ không được để trống';
        errorList.push('Địa chỉ không được để trống');
    } else if (!isValidAddress(address)) {
        errors.address = 'Địa chỉ không hợp lệ (5-200 ký tự)';
        errorList.push('Địa chỉ không hợp lệ (5-200 ký tự)');
    }

    // Validate zone detail ID
    if (!zoneDetailID) {
        errors.zoneDetailID = 'Vui lòng chọn khu vực phục vụ';
        errorList.push('Vui lòng chọn khu vực phục vụ');
    } else if (isNaN(parseInt(zoneDetailID))) {
        errors.zoneDetailID = 'Khu vực phục vụ không hợp lệ';
        errorList.push('Khu vực phục vụ không hợp lệ');
    }

    // Validate image URL (optional)
    if (image && image !== 'string' && image.trim() !== '') {
        const imageUrl = image.trim();
        if (!/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(imageUrl)) {
            errors.push('URL ảnh đại diện không hợp lệ. Chỉ chấp nhận định dạng: JPG, JPEG, PNG, GIF, WEBP, BMP, SVG');
        }
    }

    // Validate note length (optional)
    if (note && typeof note === 'string' && note.trim().length > 500) {
        errors.push('Ghi chú không được vượt quá 500 ký tự');
    }

    // Validate status
    if (status && !['active', 'inactive'].includes(status)) {
        errors.push('Trạng thái không hợp lệ. Chỉ chấp nhận: active hoặc inactive');
    }

    return errors;
};

// Field-specific validation for relatives
export const validateRelativeFields = (formData) => {
    const fieldErrors = {};

    const relativeName = formData.relativeName || formData.RelativeName;
    const dateOfBirth = formData.dateOfBirth || formData.DateOfBirth;
    const gender = (formData.gender || formData.Gender || '').toString().toLowerCase();
    const note = formData.note || formData.Note;

    // Validate relative name
    if (!relativeName || !relativeName.trim()) {
        fieldErrors.relativeName = 'Tên người thân không được để trống';
    } else if (!isValidName(relativeName)) {
        fieldErrors.relativeName = 'Tên người thân không hợp lệ (2-50 ký tự, chỉ chứa chữ cái, dấu cách, dấu gạch ngang và dấu chấm)';
    }

    // Validate date of birth
    if (!dateOfBirth) {
        fieldErrors.dateOfBirth = 'Ngày sinh người thân không được để trống';
    } else if (!isValidPastDate(dateOfBirth)) {
        const inputDate = new Date(dateOfBirth);
        const now = new Date();
        if (isNaN(inputDate.getTime())) {
            fieldErrors.dateOfBirth = 'Ngày sinh người thân không đúng định dạng';
        } else if (inputDate > now) {
            fieldErrors.dateOfBirth = 'Ngày sinh người thân không thể trong tương lai';
        } else {
            fieldErrors.dateOfBirth = 'Ngày sinh người thân không hợp lệ (không quá 130 năm)';
        }
    }

    // Validate gender
    if (!gender) {
        fieldErrors.gender = 'Vui lòng chọn giới tính';
    } else if (!['male', 'female', 'other'].includes(gender)) {
        fieldErrors.gender = 'Giới tính không hợp lệ. Chỉ chấp nhận: Nam, Nữ, hoặc Khác';
    }

    // Validate note length (optional)
    if (note && typeof note === 'string' && note.trim().length > 500) {
        fieldErrors.note = 'Ghi chú không được vượt quá 500 ký tự';
    }

    return fieldErrors;
};

export const validateRelative = (formData) => {
    const errors = [];

    const relativeName = formData.relativeName || formData.RelativeName;
    const dateOfBirth = formData.dateOfBirth || formData.DateOfBirth;
    const gender = (formData.gender || formData.Gender || '').toString().toLowerCase();
    const image = formData.image || formData.Image;
    const note = formData.note || formData.Note;

    // Validate relative name
    if (!relativeName || !relativeName.trim()) {
        errors.push('Tên người thân không được để trống');
    } else if (!isValidName(relativeName)) {
        errors.push('Tên người thân không hợp lệ (2-50 ký tự, chỉ chứa chữ cái, dấu cách, dấu gạch ngang và dấu chấm)');
    }

    // Validate date of birth
    if (!dateOfBirth) {
        errors.push('Ngày sinh người thân không được để trống');
    } else if (!isValidPastDate(dateOfBirth)) {
        const inputDate = new Date(dateOfBirth);
        const now = new Date();
        if (isNaN(inputDate.getTime())) {
            errors.push('Ngày sinh người thân không đúng định dạng');
        } else if (inputDate > now) {
            errors.push('Ngày sinh người thân không thể trong tương lai');
        } else {
            errors.push('Ngày sinh người thân không hợp lệ (không quá 130 năm)');
        }
    }

    // Validate gender
    if (!gender) {
        errors.push('Vui lòng chọn giới tính');
    } else if (!['male', 'female', 'other'].includes(gender)) {
        errors.push('Giới tính không hợp lệ. Chỉ chấp nhận: Nam, Nữ, hoặc Khác');
    }

    // Validate image URL (optional)
    if (image && image !== 'string' && image.trim() !== '') {
        const imageUrl = image.trim();
        if (!/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(imageUrl)) {
            errors.push('URL ảnh đại diện không hợp lệ. Chỉ chấp nhận định dạng: JPG, JPEG, PNG, GIF, WEBP, BMP, SVG');
        }
    }

    // Validate note length (optional)
    if (note && typeof note === 'string' && note.trim().length > 500) {
        errors.push('Ghi chú không được vượt quá 500 ký tự');
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
        image: imageUrl
    };
};
