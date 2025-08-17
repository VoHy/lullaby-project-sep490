import React, { useState, useEffect } from 'react';

export default function ZoneSelector({
  zones = [],
  zoneDetails = [],
  selectedZoneDetailID,
  onChange,
  required = false,
  label = "Khu vực",
  placeholder = "Chọn khu vực"
}) {
  const [selectedZoneID, setSelectedZoneID] = useState('');
  const [filteredZoneDetails, setFilteredZoneDetails] = useState([]);

  // Initialize selected zone based on selected zone detail
  useEffect(() => {
    if (selectedZoneDetailID && zoneDetails.length > 0) {
      const zoneDetail = zoneDetails.find(zd =>
        (zd.zonedetailid || zd.ZonedetailID || zd.zoneDetailID) == selectedZoneDetailID
      );
      if (zoneDetail) {
        const zoneId = zoneDetail.zoneID || zoneDetail.ZoneID || zoneDetail.zoneId;
        setSelectedZoneID(zoneId || '');
      }
    }
  }, [selectedZoneDetailID, zoneDetails]);

  // Filter zone details based on selected zone
  useEffect(() => {
    if (selectedZoneID) {
      const filtered = zoneDetails.filter(zd => {
        const zoneId = zd.zoneID || zd.ZoneID || zd.zoneId;
        return zoneId == selectedZoneID;
      });
      setFilteredZoneDetails(filtered);
    } else {
      setFilteredZoneDetails([]);
    }
  }, [selectedZoneID, zoneDetails]);

  const handleZoneChange = (e) => {
    const newZoneID = e.target.value;
    setSelectedZoneID(newZoneID);

    // Reset zone detail selection when zone changes
    if (onChange) {
      onChange({ target: { name: 'zoneDetailID', value: '' } });
    }
  };

  const handleZoneDetailChange = (e) => {
    const newZoneDetailID = e.target.value;
    if (onChange) {
      onChange({ target: { name: 'zoneDetailID', value: newZoneDetailID } });
    }
  };

  // Prepare zone options
  const zoneOptions = zones?.map(zone => ({
    value: zone.zoneID || zone.ZoneID || zone.zoneId,
    label: `${zone.zoneName || zone.ZoneName || 'N/A'}${zone.cityName ? ' - ' + zone.cityName : zone.city ? ' - ' + zone.city : ''}`
  })) || [];

  // Prepare zone detail options
  const zoneDetailOptions = filteredZoneDetails.map(zd => ({
    value: zd.zonedetailid || zd.ZonedetailID || zd.zoneDetailID,
    label: zd.name || zd.zoneDetailName || zd.ZoneDetailName || 'N/A'
  }));

  return (
    <div className="space-y-4">
      {/* Zone Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tỉnh/Thành phố {required && <span className="text-red-500">*</span>}
        </label>
        <select
          value={selectedZoneID}
          onChange={handleZoneChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          required={required}
        >
          <option value="">Chọn tỉnh/thành phố</option>
          {zoneOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Zone Detail Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Quận/Huyện {required && <span className="text-red-500">*</span>}
        </label>
        <select
          value={selectedZoneDetailID || ''}
          onChange={handleZoneDetailChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          disabled={!selectedZoneID}
          required={required}
        >
          <option value="">
            {selectedZoneID ? "Chọn quận/huyện" : "Vui lòng chọn tỉnh/thành phố trước"}
          </option>
          {zoneDetailOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
