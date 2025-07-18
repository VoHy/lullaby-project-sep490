"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useMemo, useEffect, useState } from "react";
import customerPackageService from '@/services/api/customerPackageService';
import serviceTypeService from '@/services/api/serviceTypeService';
import nursingSpecialistService from '@/services/api/nursingSpecialistService';
import walletService from '@/services/api/walletService';

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const packageId = searchParams.get("package");
  const services = searchParams.get("services");
  const datetime = searchParams.get("datetime");
  const note = searchParams.get("note");
  const nurses = searchParams.get("nurses"); // dạng "1,2"

  const [packages, setPackages] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [nursingSpecialists, setNursingSpecialists] = useState([]);
  const [wallets, setWallets] = useState([]);

  useEffect(() => {
    customerPackageService.getCustomerPackages().then(setPackages);
    serviceTypeService.getServiceTypes().then(setServiceTypes);
    nursingSpecialistService.getNursingSpecialists().then(setNursingSpecialists);
    walletService.getWallets().then(setWallets);
  }, []);

  let selectedPackage = null;
  let selectedServices = [];
  let selectedNurses = [];

  if (packageId) {
    selectedPackage = packages.find((pkg) => pkg.package_id === Number(packageId));
  }

  if (services) {
    const serviceIds = services.split(",").map(Number);
    selectedServices = serviceTypes.filter((st) => serviceIds.includes(st.servicetype_id));
  }

  if (nurses) {
    const nurseIds = nurses.split(",").map(Number);
    selectedNurses = nursingSpecialists.filter(n => nurseIds.includes(n.nursing_id));
  }

  // Tổng tiền
  const total = useMemo(() => {
    if (selectedPackage) {
      return selectedPackage.price * (1 - selectedPackage.discount / 100);
    }
    return selectedServices.reduce((sum, s) => sum + s.price, 0);
  }, [selectedPackage, selectedServices]);

  // Xử lý xác nhận thanh toán (giả lập)
  const handleConfirm = () => {
    // Lưu lịch hẹn vào localStorage
    const data = localStorage.getItem("appointments");
    let arr = [];
    if (data) arr = JSON.parse(data);
    arr.push({
      package: packageId,
      services,
      datetime,
      note,
      nurses
    });
    localStorage.setItem("appointments", JSON.stringify(arr));
    alert("Thanh toán thành công! (Demo)");
    router.push("/appointments");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-3xl mx-auto px-4 bg-white rounded-xl shadow p-8">
        <h1 className="text-3xl font-bold text-pink-600 mb-6">Thanh toán dịch vụ</h1>
        {selectedPackage && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2 text-blue-700">Gói dịch vụ</h2>
            <p className="font-bold text-lg mb-1">{selectedPackage.package_name}</p>
            <p className="mb-1">{selectedPackage.description}</p>
            <p className="mb-1">Giá: <span className="text-pink-600 font-semibold">{selectedPackage.price.toLocaleString()}đ</span></p>
            <p className="mb-1">Giảm giá: <span className="text-green-600 font-semibold">{selectedPackage.discount}%</span></p>
          </div>
        )}
        {selectedServices.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2 text-blue-700">Các dịch vụ lẻ</h2>
            <ul className="list-disc pl-6">
              {selectedServices.map((s) => (
                <li key={s.servicetype_id} className="mb-1">
                  <span className="font-bold">{s.servicetype_name}</span> - {s.price.toLocaleString()}đ
                  <div className="text-gray-500 text-sm">{s.description}</div>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="mb-4">
          <span className="font-semibold">Ngày giờ sử dụng dịch vụ: </span>
          <span>{datetime ? new Date(datetime).toLocaleString() : "-"}</span>
        </div>
        <div className="mb-4">
          <span className="font-semibold">Nurse được chọn: </span>
          {selectedNurses.length === 0 ? (
            <span>Không chọn</span>
          ) : (
            <ul className="list-disc pl-6">
              {selectedNurses.map(n => (
                <li key={n.nursing_id}>{n.full_name} ({n.major})</li>
              ))}
            </ul>
          )}
        </div>
        <div className="mb-4">
          <span className="font-semibold">Ghi chú: </span>
          <span>{note || "-"}</span>
        </div>
        <div className="mb-6 flex items-center justify-between">
          <span className="text-lg font-semibold">Tổng tiền:</span>
          <span className="text-2xl text-pink-600 font-bold">{total.toLocaleString()}đ</span>
        </div>
        <button
          className="w-full py-3 rounded-full bg-pink-500 text-white font-bold text-lg shadow hover:bg-pink-600 transition"
          onClick={handleConfirm}
        >
          Xác nhận thanh toán
        </button>
      </div>
    </div>
  );
} 