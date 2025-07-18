'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from "framer-motion";
import customerPackageService from '@/services/api/customerPackageService';
import serviceTypeService from '@/services/api/serviceTypeService';

export default function ServicesPage() {
  const [packages, setPackages] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [packageServiceTypes, setPackageServiceTypes] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const router = useRouter();

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

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dịch vụ</h1>
        <p className="text-gray-600 mb-8">Chọn gói dịch vụ hoặc chọn các dịch vụ lẻ để đặt lịch</p>
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Gói dịch vụ</h2>
          <div className="flex gap-4 flex-wrap">
            {packages.filter(pkg => pkg.Status === 'active').map(pkg => (
              <button
                key={pkg.PackageID}
                className={`px-4 py-2 rounded-full font-semibold border transition ${selectedPackage === pkg.PackageID ? 'bg-pink-500 text-white border-pink-500' : 'bg-white text-pink-600 border-pink-200 hover:bg-pink-50'}`}
                onClick={() => handleSelectPackage(pkg.PackageID)}
                disabled={selectedServices.length > 0}
              >
                {pkg.PackageName}
                {pkg.Discount > 0 && (
                  <span className="ml-2 text-xs bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded">-{pkg.Discount}%</span>
                )}
              </button>
            ))}
          </div>
        </div>
        {selectedPackage && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-2">Thông tin gói dịch vụ</h3>
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="font-semibold text-blue-700">Gói:</span>
                  <p className="text-sm">{packages.find(p => p.PackageID === selectedPackage)?.PackageName}</p>
                </div>
                <div>
                  <span className="font-semibold text-blue-700">Giảm giá:</span>
                  <p className="text-sm text-green-600">{packages.find(p => p.PackageID === selectedPackage)?.Discount}%</p>
                </div>
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">Các dịch vụ trong gói</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentServiceTypes.map((stype) => (
                <motion.div
                  key={stype.ServiceID}
                  className="bg-white rounded-xl shadow p-6 flex flex-col items-center hover:shadow-lg transition"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                  <h3 className="text-xl font-semibold text-blue-700 mb-2">{stype.ServiceName}</h3>
                  <p className="text-gray-600 text-center text-sm mb-2">{stype.Description}</p>
                  <span className="text-pink-600 font-bold mb-2">{stype.Price.toLocaleString()}đ</span>
                  <div className="text-sm text-gray-500">
                    Thời gian: {Math.floor(stype.Duration / 60)}h {stype.Duration % 60}m
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                className="px-6 py-2 rounded bg-pink-500 text-white font-semibold text-lg shadow hover:bg-pink-600"
                onClick={handleBooking}
              >
                Đặt gói này
              </button>
            </div>
          </div>
        )}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Dịch vụ lẻ</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {availableServices.map((stype) => (
              <motion.div
                key={stype.ServiceID}
                className="bg-white rounded-xl shadow p-6 flex flex-col items-center hover:shadow-lg transition"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              >
                <h3 className="text-xl font-semibold text-blue-700 mb-2">{stype.ServiceName}</h3>
                <p className="text-gray-600 text-center text-sm mb-2">{stype.Description}</p>
                <span className="text-pink-600 font-bold mb-2">{stype.Price.toLocaleString()}đ</span>
                <div className="text-sm text-gray-500 mb-2">
                  Thời gian: {Math.floor(stype.Duration / 60)}h {stype.Duration % 60}m
                </div>
                <button
                  className="mt-2 px-4 py-2 rounded bg-blue-500 text-white font-semibold hover:bg-blue-600"
                  onClick={() => setServiceDetail(stype)}
                >
                  Xem chi tiết
                </button>
              </motion.div>
            ))}
          </div>
        </div>
        {serviceDetail && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-8 max-w-lg w-full relative">
              <button className="absolute top-2 right-2 text-xl" onClick={() => setServiceDetail(null)}>&times;</button>
              <h2 className="text-2xl font-bold text-pink-600 mb-4">Chi tiết dịch vụ</h2>
              <div className="mb-2"><span className="font-semibold">Tên dịch vụ: </span>{serviceDetail.ServiceName}</div>
              <div className="mb-2"><span className="font-semibold">Giá: </span><span className="text-pink-600 font-bold">{serviceDetail.Price.toLocaleString()}đ</span></div>
              <div className="mb-2"><span className="font-semibold">Thời gian: </span>{Math.floor(serviceDetail.Duration / 60)}h {serviceDetail.Duration % 60}m</div>
              <div className="mb-2"><span className="font-semibold">Mô tả: </span>{serviceDetail.Description}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 