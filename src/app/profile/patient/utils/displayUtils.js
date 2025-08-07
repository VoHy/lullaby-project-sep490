// Display utilities - Tập trung các hàm hiển thị UI
import { normalizeFieldNames } from './formUtils';

// Status display utilities
export const getStatusConfig = (status) => {
  const normalizedStatus = (status || '').toLowerCase();
  const isActive = normalizedStatus === 'active';
  
  return {
    isActive,
    className: isActive 
      ? 'bg-green-100 text-green-700' 
      : 'bg-red-100 text-red-700',
    text: isActive ? 'Hoạt động' : 'Ngừng hoạt động',
    activeText: isActive ? 'Đang hoạt động' : 'Ngừng hoạt động'
  };
};

// Zone display utilities
export const getZoneDisplayText = (care, zones, zoneDetails, detailedZone, detailedZoneDetail, isLoading) => {
  if (isLoading) return 'Đang tải...';
  
  const normalized = normalizeFieldNames(care);
  
  // Find zone detail
  const zoneDetail = detailedZoneDetail || (Array.isArray(zoneDetails) 
    ? zoneDetails.find(z => {
        const zoneDetailId = z.zonedetailid || z.ZonedetailID || z.zoneDetailID;
        return Number(zoneDetailId) === Number(normalized.zoneDetailID);
      })
    : null);
    
  // Find zone
  const zone = detailedZone || (zoneDetail && Array.isArray(zones) 
    ? zones.find(z => {
        const zoneId = z.zoneID || z.ZoneID || z.zoneID;
        const zoneDetailZoneId = zoneDetail.zoneID || zoneDetail.ZoneID || zoneDetail.zoneID;
        return Number(zoneId) === Number(zoneDetailZoneId);
      })
    : null);

  if (zone && zoneDetail) {
    const zoneName = zone.zoneName || zone.ZoneName || 'N/A';
    const zoneDetailName = zoneDetail.name || zoneDetail.zoneDetailName || zoneDetail.ZoneDetailName || 'N/A';
    return `${zoneName} - ${zoneDetailName}`;
  } else if (zone) {
    return zone.zoneName || zone.ZoneName || 'N/A';
  } else if (zoneDetail) {
    return zoneDetail.name || zoneDetail.zoneDetailName || zoneDetail.ZoneDetailName || 'N/A';
  }
  
  return 'N/A';
};

// Filter utilities
export const filterItems = (items, filter, statusField = 'status') => {
  if (filter === 'all') return items;
  
  return items.filter(item => {
    const normalized = normalizeFieldNames(item);
    return normalized[statusField]?.toLowerCase() === filter.toLowerCase();
  });
};

// Get item ID utility
export const getItemId = (item, idFields = ['id', 'ID']) => {
  for (const field of idFields) {
    if (item[field]) return item[field];
  }
  return null;
};

// Common field getters
export const getCareProfileId = (care) => {
  return care.careProfileID || care.CareProfileID;
};

export const getRelativeId = (relative) => {
  return relative.relativeID || relative.RelativeID || relative.relativeid;
};
