'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from "framer-motion";
import customerPackageService from '@/services/api/customerPackageService';
import serviceTypeService from '@/services/api/serviceTypeService';
import serviceTypes from '@/mock/ServiceType';
import serviceTasks from '@/mock/ServiceTask';
import feedbacks from '@/mock/Feedback';

export default function ServicesPage() {
  const [packages, setPackages] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [packageServiceTypes, setPackageServiceTypes] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const [packageDetail, setPackageDetail] = useState(null);

  useEffect(() => {
    customerPackageService.getCustomerPackages().then(setPackages);
    serviceTypeService.getServiceTypes().then(setServiceTypes);
  }, []);

  // Khi chọn package thì reset chọn service lẻ
  const handleSelectPackage = (pkgId) => {
    if (selectedPackage === pkgId) {
      setSelectedPackage(null); // Bỏ chọn nếu bấm lại vào gói đang chọn
    } else {
      setSelectedPackage(pkgId);
      setSelectedServices([]);
    }
  };

  // Khi chọn service lẻ thì reset chọn package
  const handleToggleService = (serviceId) => {
    if (selectedPackage) setSelectedPackage(null);
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  // Lấy các ServiceID thuộc package đã chọn
  const serviceIds = packageServiceTypes
    .filter(pst => pst.PackageID === selectedPackage)
    .map(pst => pst.ServiceID);

  // Lấy danh sách serviceType thuộc package
  const currentServiceTypes = serviceTypes.filter(st => serviceIds.includes(st.ServiceID));

  // Lấy danh sách service lẻ (không thuộc package nào đang chọn)
  const serviceIdsInPackages = packageServiceTypes.map(pst => pst.ServiceID);
  const availableServices = serviceTypes.filter(st => st.Status === 'active');

  // Xử lý booking
  const handleBooking = () => {
    if (selectedPackage) {
      router.push(`/booking?package=${selectedPackage}`);
    }
  };

  // Modal xem chi tiết dịch vụ lẻ
  const [serviceDetail, setServiceDetail] = useState(null);

  // Tách dịch vụ lẻ và package
  const singleServices = serviceTypes.filter(s => !s.IsPackage && s.Status === 'active');
  const servicePackages = serviceTypes.filter(s => s.IsPackage && s.Status === 'active');

  // Lấy dịch vụ lẻ thuộc về 1 package
  function getServicesOfPackage(packageId) {
    const tasks = serviceTasks.filter(t => t.Package_ServiceID === packageId);
    return tasks.map(task => serviceTypes.find(s => s.ServiceID === task.Child_ServiceID)).filter(Boolean);
  }

  // State cho expand/collapse package
  const [expandedPackage, setExpandedPackage] = useState(null);
  const handleToggleExpand = (pkgId) => {
    setExpandedPackage(expandedPackage === pkgId ? null : pkgId);
  };

  // Search/filter logic
  const filterService = (item) => {
    const text = searchText.toLowerCase();
    return (
      item.ServiceName.toLowerCase().includes(text) ||
      (item.Description || '').toLowerCase().includes(text)
    );
  };
  const filteredServicePackages = servicePackages.filter(filterService);
  const filteredSingleServices = singleServices.filter(filterService);

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dịch vụ</h1>
        <p className="text-gray-600 mb-8">Chọn gói dịch vụ hoặc chọn các dịch vụ lẻ để đặt lịch</p>
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <input
            type="text"
            placeholder="Tìm kiếm dịch vụ..."
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 min-w-[220px]"
          />
        </div>
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Gói dịch vụ</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServicePackages.map(pkg => (
              <motion.div
                key={pkg.ServiceID}
                className={`bg-white rounded-xl shadow p-6 flex flex-col items-center transition relative group ${selectedServices.length > 0 ? 'opacity-40 pointer-events-none' : 'hover:shadow-lg'}`}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              >
                <div className="absolute top-2 right-2">
                  {selectedPackage === pkg.ServiceID && <span className="inline-block px-2 py-0.5 bg-pink-500 text-white text-xs rounded-full">Đã chọn</span>}
                </div>
                <h3 className="text-xl font-semibold text-pink-700 mb-2">{pkg.ServiceName}</h3>
                <p className="text-gray-600 text-center text-sm mb-2">{pkg.Description}</p>
                <span className="text-pink-600 font-bold mb-2">{pkg.Price.toLocaleString('vi-VN')}đ</span>
                <div className="text-sm text-gray-500 mb-2">Thời gian: {pkg.Duration}</div>
                {/* Hiển thị rating nếu có feedback */}
                <div className="flex items-center gap-1 mb-2">
                  <span className="text-yellow-400 text-lg">★</span>
                  <span className="text-sm font-semibold text-gray-700">{(
                    (() => {
                      const fb = feedbacks.filter(f => f.ServiceID === pkg.ServiceID);
                      if (!fb.length) return '5.0';
                      return (fb.reduce((sum, f) => sum + (f.Rating || 5), 0) / fb.length).toFixed(1);
                    })()
                  )}</span>
                  <span className="text-xs text-gray-400">({feedbacks.filter(f => f.ServiceID === pkg.ServiceID).length} đánh giá)</span>
                </div>
                <button
                  className={`mt-2 px-4 py-2 rounded font-semibold ${selectedServices.length > 0 ? 'bg-gray-300 text-gray-400 cursor-not-allowed' : 'bg-purple-500 text-white hover:bg-purple-600'}`}
                  onClick={() => handleSelectPackage(pkg.ServiceID)}
                  disabled={selectedServices.length > 0}
                >
                  {selectedPackage === pkg.ServiceID ? 'Bỏ chọn' : 'Chọn gói này'}
                </button>
                <button
                  className={`mt-2 px-6 py-2 rounded bg-pink-500 text-white font-semibold text-lg shadow hover:bg-pink-600 ${selectedPackage && selectedPackage !== pkg.ServiceID ? 'opacity-40 pointer-events-none' : ''}`}
                  onClick={() => router.push(`/booking?package=${pkg.ServiceID}`)}
                  disabled={selectedPackage && selectedPackage !== pkg.ServiceID}
                >
                  Đặt gói này
                </button>
                <button
                  className="mt-2 px-4 py-2 rounded bg-pink-100 text-pink-700 font-semibold hover:bg-pink-200"
                  onClick={() => setPackageDetail(pkg)}
                >
                  Xem chi tiết
                </button>
                {expandedPackage === pkg.ServiceID && (
                  <div className="mt-4 w-full">
                    <h4 className="font-semibold text-purple-600 mb-2">Dịch vụ trong gói:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {getServicesOfPackage(pkg.ServiceID).map(child => (
                        <li key={child.ServiceID} className="text-gray-700">
                          <span className="font-medium text-blue-700">{child.ServiceName}</span> - {child.Description} <span className="text-pink-600 font-bold">({child.Price.toLocaleString('vi-VN')}đ)</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Dịch vụ lẻ</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSingleServices.map((stype) => (
              <motion.div
                key={stype.ServiceID}
                className={`bg-white rounded-xl shadow p-6 flex flex-col items-center transition relative group ${selectedPackage ? 'opacity-40 pointer-events-none' : 'hover:shadow-lg'}`}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              >
                <div className="absolute top-2 right-2">
                  {selectedServices.includes(stype.ServiceID) && <span className="inline-block px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">Đã chọn</span>}
                </div>
                <h3 className="text-xl font-semibold text-blue-700 mb-2">{stype.ServiceName}</h3>
                <p className="text-gray-600 text-center text-sm mb-2">{stype.Description}</p>
                <span className="text-pink-600 font-bold mb-2">{stype.Price.toLocaleString('vi-VN')}đ</span>
                <div className="text-sm text-gray-500 mb-2">Thời gian: {stype.Duration}</div>
                {/* Hiển thị rating nếu có feedback */}
                <div className="flex items-center gap-1 mb-2">
                  <span className="text-yellow-400 text-lg">★</span>
                  <span className="text-sm font-semibold text-gray-700">{(
                    (() => {
                      const fb = feedbacks.filter(f => f.ServiceID === stype.ServiceID);
                      if (!fb.length) return '5.0';
                      return (fb.reduce((sum, f) => sum + (f.Rating || 5), 0) / fb.length).toFixed(1);
                    })()
                  )}</span>
                  <span className="text-xs text-gray-400">({feedbacks.filter(f => f.ServiceID === stype.ServiceID).length} đánh giá)</span>
                </div>
                <button
                  className={`mt-2 px-4 py-2 rounded font-semibold ${selectedPackage ? 'bg-gray-300 text-gray-400 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                  onClick={() => handleToggleService(stype.ServiceID)}
                  disabled={!!selectedPackage}
                >
                  {selectedServices.includes(stype.ServiceID) ? 'Bỏ chọn' : 'Chọn dịch vụ này'}
                </button>
                <button
                  className={`mt-2 px-4 py-2 rounded bg-pink-100 text-pink-700 font-semibold hover:bg-pink-200 ${selectedServices.length > 1 ? 'opacity-40 pointer-events-none' : ''}`}
                  onClick={() => setServiceDetail(stype)}
                  disabled={selectedServices.length > 1}
                >
                  Xem chi tiết
                </button>
                <button
                  className={`mt-2 px-4 py-2 rounded bg-pink-500 text-white font-semibold hover:bg-pink-600 ${selectedServices.length > 1 ? 'opacity-40 pointer-events-none' : ''}`}
                  onClick={() => router.push(`/booking?service=${stype.ServiceID}`)}
                  disabled={selectedServices.length > 1}
                >
                  Đặt dịch vụ này
                </button>
              </motion.div>
            ))}
          </div>
        </div>
        {/* Nút đặt lịch chung cho nhiều dịch vụ lẻ */}
        {selectedServices.length > 1 && (
          <div className="flex justify-end mt-6">
            <button
              className="px-8 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-pink-500 text-white font-bold text-lg shadow hover:scale-105 transition"
              onClick={() => router.push(`/booking?service=${selectedServices.join(',')}`)}
            >
              Đặt lịch các dịch vụ đã chọn
            </button>
          </div>
        )}
        {serviceDetail && (
          <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-8 max-w-lg w-full relative">
              <button className="absolute top-2 right-2 text-xl" onClick={() => setServiceDetail(null)}>&times;</button>
              <h2 className="text-2xl font-bold text-pink-600 mb-4">Chi tiết dịch vụ</h2>
              <div className="mb-2"><span className="font-semibold">Tên dịch vụ: </span>{serviceDetail.ServiceName}</div>
              <div className="mb-2"><span className="font-semibold">Giá: </span><span className="text-pink-600 font-bold">{serviceDetail.Price.toLocaleString('vi-VN')}đ</span></div>
              <div className="mb-2"><span className="font-semibold">Thời gian: </span>{serviceDetail.Duration}</div>
              <div className="mb-2"><span className="font-semibold">Mô tả: </span>{serviceDetail.Description}</div>
            </div>
          </div>
        )}
        {packageDetail && (
          <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-8 max-w-lg w-full relative">
              <button className="absolute top-2 right-2 text-xl" onClick={() => setPackageDetail(null)}>&times;</button>
              <h2 className="text-2xl font-bold text-pink-600 mb-4">Chi tiết gói dịch vụ</h2>
              <div className="mb-2"><span className="font-semibold">Tên gói: </span>{packageDetail.ServiceName}</div>
              <div className="mb-2"><span className="font-semibold">Giá: </span><span className="text-pink-600 font-bold">{packageDetail.Price.toLocaleString('vi-VN')}đ</span></div>
              <div className="mb-2"><span className="font-semibold">Thời gian: </span>{packageDetail.Duration}</div>
              <div className="mb-2"><span className="font-semibold">Mô tả: </span>{packageDetail.Description}</div>
              <div className="mb-2"><span className="font-semibold">Dịch vụ trong gói:</span></div>
              <ul className="list-disc pl-5 space-y-1 mb-2">
                {getServicesOfPackage(packageDetail.ServiceID).map(child => (
                  <li key={child.ServiceID} className="text-gray-700">
                    <span className="font-medium text-blue-700">{child.ServiceName}</span> - {child.Description} <span className="text-pink-600 font-bold">({child.Price.toLocaleString('vi-VN')}đ)</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex justify-end">
                <button
                  className="px-6 py-2 rounded bg-pink-500 text-white font-semibold text-lg shadow hover:bg-pink-600"
                  onClick={() => { setPackageDetail(null); router.push(`/booking?package=${packageDetail.ServiceID}`); }}
                >
                  Đặt gói này
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 