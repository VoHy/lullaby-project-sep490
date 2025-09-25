import React, { useState, useEffect } from 'react';
import zoneDetailService from '@/services/api/zoneDetailService';
import zoneService from '@/services/api/zoneService';
import { formatDateToDDMMYYYY } from '../../utils/dateUtils';

export default function CareProfileDetailModal({ open, onClose, care, zones, zoneDetails, successMessage }) {
  const [detailedZoneDetail, setDetailedZoneDetail] = useState(null);
  const [detailedZone, setDetailedZone] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Fetch detailed zone information if not found in local data
  useEffect(() => {
    if (!open || !care) return;
    
    const fetchZoneDetails = async () => {
      if (!care.zoneDetailID && !care.zonedetailid && !care.ZonedetailID) return;
      
      const zoneDetailId = care.zoneDetailID || care.zonedetailid || care.ZonedetailID;
      
      // Lấy zonedetail và zone đúng với logic cải thiện
      const zonedetail = Array.isArray(zoneDetails) 
        ? zoneDetails.find(z => {
            const zoneDetailId = z.zonedetailid || z.ZonedetailID || z.zoneDetailID;
            const careZoneDetailId = care.zonedetailid || care.ZonedetailID || care.zoneDetailID;
            return Number(zoneDetailId) === Number(careZoneDetailId);
          })
        : null;
      
      if (!zonedetail && zoneDetailId) {
        setLoadingDetails(true);
        try {
          const zoneDetailData = await zoneDetailService.getZoneDetailById(zoneDetailId);
          setDetailedZoneDetail(zoneDetailData);
          
          if (zoneDetailData.zoneID || zoneDetailData.ZoneID) {
            const zoneId = zoneDetailData.zoneID || zoneDetailData.ZoneID;
            const zoneData = await zoneService.getZoneById(zoneId);
            setDetailedZone(zoneData);
          }
        } catch (error) {
          console.error('Error fetching zone details:', error);
        } finally {
          setLoadingDetails(false);
        }
      }
    };

    fetchZoneDetails();
  }, [open, care, zoneDetails]);

  if (!open || !care) return null;
  
  // Lấy zonedetail và zone đúng với logic cải thiện
  const zonedetail = Array.isArray(zoneDetails) 
    ? zoneDetails.find(z => {
        const zoneDetailId = z.zonedetailid || z.ZonedetailID || z.zoneDetailID;
        const careZoneDetailId = care.zonedetailid || care.ZonedetailID || care.zoneDetailID;
        return Number(zoneDetailId) === Number(careZoneDetailId);
      })
    : null;
    
  const zone = zonedetail && Array.isArray(zones) 
    ? zones.find(z => {
        const zoneId = z.zoneID || z.ZoneID || z.zoneID;
        const zoneDetailZoneId = zonedetail.zoneID || zonedetail.ZoneID || zonedetail.zoneID;
        return Number(zoneId) === Number(zoneDetailZoneId);
      })
    : null;

  // Tạo chuỗi hiển thị khu vực
  const getZoneDisplayText = () => {
    // Sử dụng detailed data nếu có
    const finalZoneDetail = detailedZoneDetail || zonedetail;
    const finalZone = detailedZone || zone;
    
    if (loadingDetails) {
      return 'Đang tải...';
    }
    
    if (finalZone && finalZoneDetail) {
      const zoneName = finalZone.zoneName || finalZone.zoneName || 'N/A';
      const zoneDetailName = finalZoneDetail.name || finalZoneDetail.zoneDetailName || finalZoneDetail.zoneDetailName || 'N/A';
      return `${zoneName} - ${zoneDetailName}`;
    } else if (finalZone) {
      return finalZone.zoneName || finalZone.zoneName || 'N/A';
    } else if (finalZoneDetail) {
      return finalZoneDetail.name || finalZoneDetail.zoneDetailName || finalZoneDetail.zoneDetailName || 'N/A';
    } else {
      return 'N/A';
    }
  };

  // Use default care profile avatar when image is missing
  const careImageSrc = ((care.image || care.Image) && (care.image || care.Image).toString().trim() !== '')
    ? (care.image || care.Image)
    : 'https://i.ibb.co/zWSDrsBx/ae10a4719f321f9123ab1a3b7e02fa2b.jpg';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-0 w-full max-w-xl relative scale-95 animate-popup-open">
        <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl" onClick={onClose}>&times;</button>
        <div className="flex flex-col md:flex-row gap-8 p-8">
          <div className="flex-shrink-0 flex flex-col items-center gap-2">
            <img src={careImageSrc} alt="avatar" className="w-32 h-32 rounded-full object-cover border-2 border-blue-200" />
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${(care.status || '').toLowerCase() === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{(care.status || '').toLowerCase() === 'active' ? 'Đang hoạt động' : 'Ngừng hoạt động'}</span>
          </div>
          <div className="flex-1 space-y-3">
            {successMessage && (
              <div className="text-green-600 bg-green-50 p-2 rounded mb-2 text-center">
                {successMessage}
              </div>
            )}
            <h2 className="text-2xl font-bold text-purple-700 mb-2">{care.profileName}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-gray-500">Ngày sinh</div>
                <div className="font-medium text-gray-800">{formatDateToDDMMYYYY(care.dateOfBirth) || 'N/A'}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Số điện thoại</div>
                <div className="font-medium text-gray-800">{care.phoneNumber || 'N/A'}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Địa chỉ</div>
                <div className="font-medium text-gray-800">{care.address || 'N/A'}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Khu vực</div>
                <div className="font-medium text-gray-800">
                  {getZoneDisplayText()}
                </div>
              </div>
            </div>
            {care.note && (
              <div>
                <div className="text-xs text-gray-500">Ghi chú</div>
                <div className="font-medium text-gray-800">{care.note}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 