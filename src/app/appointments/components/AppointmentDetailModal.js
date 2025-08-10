'use client';

import React, { useState } from 'react';
import { FaTimes, FaCalendar, FaUser, FaUserCircle, FaBox, FaStethoscope, FaMoneyBillWave, FaUserMd, FaPlus, FaFileInvoice, FaCreditCard } from 'react-icons/fa';
import NurseSelectionModal from './NurseSelectionModal';
import nursingSpecialistServiceTypeService from '@/services/api/nursingSpecialistServiceTypeService';


const AppointmentDetailModal = ({
  appointment,
  onClose,
  serviceTypes,
  serviceTasks,
  nursingSpecialists,
  zoneDetails,
  invoices,
  customizePackages,
  customizeTasks,
  getStatusColor,
  getStatusText,
  formatDate,
  onAssignNursing,
  onPayment
}) => {
  const [showNurseModal, setShowNurseModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  if (!appointment) {
    return null;
  }

  const bookingId = appointment.bookingID || appointment.BookingID;
  const careProfile = appointment.careProfile;
  const baseAmount = appointment.amount || appointment.totalAmount || appointment.total_Amount || 0;
  const extra = appointment.extra;

  // Calculate final amount including extra fees
  const finalAmount = (() => {
    if (!extra || extra === null) {
      return baseAmount;
    }
    // Convert extra to decimal percentage if it's a whole number
    const extraPercentage = extra > 1 ? extra / 100 : extra;
    return baseAmount + (baseAmount * extraPercentage);
  })();

  // Calculate extra fee amount
  const extraAmount = finalAmount - baseAmount;

  // Lấy invoice cho booking này
  const bookingInvoice = invoices.find(inv =>
    inv.bookingID === bookingId || inv.BookingID === bookingId
  );

  // Tính toán thông tin dịch vụ và service tasks
  const getServiceDetails = () => {
    const bookingId = appointment.bookingID || appointment.BookingID;

    // Get customize tasks for this booking
    const bookingCustomizeTasks = customizeTasks?.filter(task => {
      const match = task.bookingID === bookingId ||
        task.BookingID === bookingId ||
        task.booking_ID === bookingId;
      return match;
    }) || [];

    // Get customize packages for this booking
    const bookingPackages = customizePackages?.filter(pkg => {
      const match = pkg.bookingID === bookingId ||
        pkg.BookingID === bookingId ||
        pkg.booking_ID === bookingId;
      return match;
    }) || [];

    // Determine if we have true packages (isPackage: true) or individual services
    let hasRealPackages = false;
    let packageServices = [];
    let individualServices = [];

    // Check packages to see if any are real packages (isPackage: true)
    bookingPackages.forEach((pkg) => {
      const serviceId = pkg.serviceID || pkg.service_ID || pkg.Service_ID;
      const service = serviceTypes.find(s =>
        s.serviceID === serviceId ||
        s.serviceTypeID === serviceId ||
        s.ServiceID === serviceId
      );

      if (service) {
        // Check if this is a real package
        const isPackage = service.isPackage === true || service.IsPackage === true;

        if (isPackage) {
          hasRealPackages = true;
          packageServices.push({
            ...service,
            customizePackage: pkg,
            quantity: pkg.quantity || 1
          });
        } else {
          // This is an individual service with quantity
          const quantity = pkg.quantity || 1;
          for (let i = 0; i < quantity; i++) {
            individualServices.push({
              ...service,
              customizePackageId: pkg.customizePackageID,
              instanceNumber: i + 1,
              totalQuantity: quantity,
              serviceInstanceKey: `${pkg.customizePackageID || pkg.customize_PackageID}-${i + 1}`,
              isIndividualWithQuantity: true
            });
          }
        }
      }
    });

    // Case 1: Real package booking (isPackage: true)
    if (hasRealPackages && packageServices.length > 0) {
      const mainPackageService = packageServices[0]; // Assume one main package

      // Get service tasks (child services) for this package
      // Use package_ServiceID from ServiceTasks to match with the main package service ID
      const packageServiceTasks = serviceTasks?.filter(task => {
        const packageServiceId = task.package_ServiceID || task.packageServiceID || task.Package_ServiceID;
        const mainServiceId = mainPackageService.serviceID || mainPackageService.serviceTypeID || mainPackageService.ServiceID;
        return packageServiceId === mainServiceId;
      }) || [];

      // Map service tasks to actual services with customize task info
      const childServices = [];
      packageServiceTasks.forEach((serviceTask) => {
        const childServiceId = serviceTask.child_ServiceID || serviceTask.childServiceID || serviceTask.Child_ServiceID;
        const childService = serviceTypes.find(s =>
          s.serviceID === childServiceId ||
          s.serviceTypeID === childServiceId ||
          s.ServiceID === childServiceId
        );

        if (childService) {
          // Find corresponding customize task for this child service
          const correspondingTask = bookingCustomizeTasks.find(task => {
            const taskServiceId = task.serviceID || task.service_ID || task.Service_ID;
            return taskServiceId === childServiceId;
          });



          childServices.push({
            ...childService,
            serviceTask: serviceTask,
            customizeTask: correspondingTask,
            customizeTaskId: correspondingTask?.customizeTaskID || correspondingTask?.customize_TaskID,
            nursingID: correspondingTask?.nursingID,
            status: correspondingTask?.status || 'pending',
            taskOrder: serviceTask.taskOrder || serviceTask.task_Order || serviceTask.Task_Order || 1,
            serviceInstanceKey: `package-child-${childServiceId}-${serviceTask.taskOrder || 0}`,
            isPackageChild: true
          });
        }
      });

      return {
        type: 'package',
        mainService: mainPackageService,
        mainPackage: mainPackageService.customizePackage,
        tasks: packageServiceTasks,
        services: childServices,
        customizeTasks: bookingCustomizeTasks
      };
    }

    // Case 2: Individual services with tasks (from customize tasks)
    if (bookingCustomizeTasks.length > 0) {
      const taskBasedServices = [];

      bookingCustomizeTasks.forEach((task) => {
        const serviceId = task.serviceID || task.service_ID || task.Service_ID;
        const customizeTaskId = task.customizeTaskID || task.customize_TaskID;
        const taskOrder = task.taskOrder || task.task_Order || task.Task_Order;

        const service = serviceTypes.find(s => {
          const match = s.serviceID === serviceId ||
            s.serviceTypeID === serviceId ||
            s.ServiceID === serviceId;
          return match;
        });

        if (service) {
          taskBasedServices.push({
            ...service,
            customizeTaskId: customizeTaskId,
            nursingID: task.nursingID,
            status: task.status,
            taskOrder: taskOrder,
            serviceInstanceKey: `task-${customizeTaskId}`,
            isTaskBased: true
          });
        }
      });

      return {
        type: 'individual_services',
        mainService: null,
        tasks: [],
        services: taskBasedServices,
        customizeTasks: bookingCustomizeTasks
      };
    }

    // Case 3: Individual services with quantity (from customize packages)
    if (individualServices.length > 0) {
      return {
        type: 'individual_services_with_quantity',
        mainService: null,
        tasks: [],
        services: individualServices,
        customizePackages: bookingPackages
      };
    }

    return { type: 'unknown', mainService: null, tasks: [], services: [] };
  };

  const serviceDetails = getServiceDetails();

  // Get service-specific nurses
  const getServiceSpecificNurses = async (serviceId) => {
    try {
      // Use the new API to get nurses who can perform this specific service
      const serviceNurses = await nursingSpecialistServiceTypeService.getByService(serviceId);

      // Also filter by zone if care profile has zone info
      const careProfileZoneId = careProfile?.zoneDetailID || careProfile?.zoneDetail_ID;

      if (careProfileZoneId) {
        return serviceNurses.filter(nurse => {
          const nurseZoneId = nurse.zoneID || nurse.zone_ID || nurse.Zone_ID;
          return nurseZoneId === careProfileZoneId;
        });
      }

      return serviceNurses;
    } catch (error) {
      console.error('Error fetching service-specific nurses:', error);
      // Fallback to zone-based filtering
      return getAvailableNurses();
    }
  };

  // Lọc nurses theo zone (fallback method)
  const getAvailableNurses = () => {
    if (!careProfile?.zoneDetailID && !careProfile?.zoneDetail_ID) return nursingSpecialists;

    const careProfileZoneId = careProfile.zoneDetailID || careProfile.zoneDetail_ID;

    return nursingSpecialists.filter(nurse => {
      const nurseZoneId = nurse.zoneID || nurse.zone_ID || nurse.Zone_ID;
      return nurseZoneId === careProfileZoneId;
    });
  };

  const availableNurses = getAvailableNurses();

  // Helper function to get nurse info by ID
  const getNurseInfo = (nursingId) => {
    if (!nursingId) return null;

    const nurse = nursingSpecialists.find(n =>
      n.nursingID === nursingId ||
      n.nursing_ID === nursingId ||
      n.Nursing_ID === nursingId
    );

    return nurse ? {
      id: nursingId,
      name: nurse.fullName || nurse.full_Name || nurse.Full_Name || 'Không có tên',
      phone: nurse.phoneNumber || nurse.phone_Number,
      experience: nurse.experience
    } : {
      id: nursingId,
      name: 'Nurse không xác định',
      phone: null,
      experience: null
    };
  };

  const handleAddNurse = async (service) => {
    try {
      setSelectedService(service);

      // Get service-specific nurses if we have a service ID
      const serviceId = service.serviceID || service.serviceTypeID || service.ServiceID;
      if (serviceId) {
        const specificNurses = await getServiceSpecificNurses(serviceId);
        setSelectedService({
          ...service,
          availableNurses: specificNurses
        });
      }

      setShowNurseModal(true);
    } catch (error) {
      console.error('Error loading nurses for service:', error);
      // Still show modal with fallback nurses
      setSelectedService(service);
      setShowNurseModal(true);
    }
  };

  const handleNurseAssignment = async (nurseId) => {
    try {
      if (selectedService) {
        await onAssignNursing?.(selectedService, nurseId);
        setShowNurseModal(false);
        setSelectedService(null);
      }
    } catch (error) {
      console.error('Error assigning nurse:', error);
    }
  };

  const handlePayment = async () => {
    if (!bookingInvoice) {
      alert('Không tìm thấy hóa đơn để thanh toán');
      return;
    }

    const invoiceId = bookingInvoice.invoiceID || bookingInvoice.invoice_ID;
    const amount = bookingInvoice.totalAmount || bookingInvoice.total_amount;

    const confirmPayment = window.confirm(
      `Bạn có chắc chắn muốn thanh toán hóa đơn #${invoiceId}?\n\nSố tiền: ${amount?.toLocaleString('vi-VN')}₫`
    );

    if (confirmPayment && onPayment) {
      try {
        await onPayment(invoiceId);
      } catch (error) {
        console.error('Error processing payment:', error);
      }
    }
  };

  // Check if invoice is eligible for payment
  const isInvoiceUnpaid = () => {
    if (!bookingInvoice) return false;
    const raw = bookingInvoice.status || bookingInvoice.Status || '';
    const status = String(raw).toLowerCase().trim();
    // Disallow paying if already paid or refunded/cancelled/void
    const disallowed = new Set([
      'paid', 'completed', 'refunded', 'refund', 'cancelled', 'canceled', 'void', 'failed'
    ]);
    if (disallowed.has(status)) return false;
    // Require positive amount
    const amount = bookingInvoice.totalAmount || bookingInvoice.total_amount || 0;
    return amount > 0;
  };

  return (
    <div
      className="fixed inset-0  backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-7xl w-full relative max-h-[95vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white rounded-t-3xl p-8 relative">
          <button
            className="absolute top-6 right-6 text-white hover:bg-white hover:bg-opacity-20 p-3 rounded-full transition-colors"
            onClick={onClose}
          >
            <FaTimes className="text-xl" />
          </button>

          <div className="pr-16">
            <h1 className="text-4xl font-bold mb-2">
              Chi tiết lịch hẹn #{bookingId}
            </h1>
            <p className="text-purple-100 text-lg">
              {formatDate(appointment.workdate || appointment.Workdate)}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

            {/* Left Column - Care Profile Info */}
            <div className="xl:col-span-1 space-y-6">

              {/* Status */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <FaCalendar className="text-white" />
                  </div>
                  Trạng thái
                </h3>
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(appointment.status || appointment.Status)}`}>
                  {getStatusText(appointment.status)}
                </span>
              </div>
              {/* Care Profile */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <div className="p-2 bg-green-500 rounded-lg">
                    <FaUserCircle className="text-white" />
                  </div>
                  Thông tin người được chăm sóc
                </h3>
                <div className="space-y-3 text-gray-700">
                  <div className="flex items-center gap-3">
                    <FaUser className="text-green-500" />
                    <span className="font-semibold">{careProfile?.profileName || 'Không xác định'}</span>
                  </div>
                  {careProfile?.dateOfBirth && (
                    <div className="text-sm text-gray-600">
                      <strong>Ngày sinh:</strong> {new Date(careProfile.dateOfBirth).toLocaleDateString('vi-VN')}
                    </div>
                  )}
                  {careProfile?.phoneNumber && (
                    <div className="text-sm text-gray-600">
                      <strong>Số điện thoại:</strong> {careProfile.phoneNumber}
                    </div>
                  )}
                  {careProfile?.address && (
                    <div className="text-sm text-gray-600">
                      <strong>Địa chỉ:</strong> {careProfile.address}
                    </div>
                  )}
                </div>
              </div>

              {/* Total Amount */}
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <div className="p-2 bg-yellow-500 rounded-lg">
                    <FaMoneyBillWave className="text-white" />
                  </div>
                  Tổng tiền
                </h3>
                <div className="text-3xl font-bold text-yellow-600">
                  {finalAmount.toLocaleString('vi-VN')}₫
                </div>
                <div className="text-sm text-gray-600 mt-2">
                  <strong>Số tiền cơ bản:</strong> {baseAmount.toLocaleString('vi-VN')}₫
                  {extraAmount > 0 && (
                    <>
                      <br />
                      <strong>Phí thêm:</strong> {extraAmount.toLocaleString('vi-VN')}₫
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Middle Column - Services */}
            <div className="xl:col-span-1 space-y-6">
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6">
                  <h3 className="text-xl font-bold flex items-center gap-3">
                    {serviceDetails.type === 'package' ? (
                      <><FaBox />Gói dịch vụ</>
                    ) : serviceDetails.type === 'individual_services' ? (
                      <><FaStethoscope />Dịch vụ lẻ</>
                    ) : serviceDetails.type === 'individual_services_with_quantity' ? (
                      <><FaStethoscope />Dịch vụ lẻ</>
                    ) : (
                      <><FaStethoscope />Dịch vụ đã đặt</>
                    )}
                  </h3>
                </div>
                <div className="p-6 space-y-4">
                  {/* Package Display */}
                  {serviceDetails.type === 'package' && serviceDetails.mainService && (
                    <div className="mb-6">
                      {/* Main Package Info */}
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-purple-500 p-4 rounded-lg mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <FaBox className="text-purple-600" />
                          <div className="font-bold text-lg text-purple-900">
                            {serviceDetails.mainService.serviceName || serviceDetails.mainService.ServiceName}
                          </div>
                        </div>
                        {serviceDetails.mainService.description && (
                          <div className="text-sm text-purple-700 mb-2">
                            {serviceDetails.mainService.description}
                          </div>
                        )}
                        <div className="text-xs text-purple-600">
                          Gói dịch vụ • {serviceDetails.services.length} dịch vụ con
                        </div>
                      </div>

                      {/* Child Services */}
                      {serviceDetails.services.length > 0 ? (
                        <div className="space-y-3">
                          <h4 className="font-medium text-gray-800 border-b pb-2 flex items-center gap-2">
                            <FaStethoscope className="text-blue-500" />
                            Dịch vụ trong gói:
                          </h4>
                          {serviceDetails.services.map((service, index) => {
                            const hasNurse = !!service.nursingID;
                            const isCompleted = service.status === 'completed';
                            const nurseInfo = hasNurse ? getNurseInfo(service.nursingID) : null;

                            return (
                              <div key={service.serviceInstanceKey || `service-${index}`}
                                className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <div className="flex-1">
                                  <div className="font-medium text-gray-800 flex items-center gap-2">
                                    <span className="text-blue-600 font-bold text-sm">#{service.taskOrder || index + 1}</span>
                                    {service.serviceName || service.ServiceName}
                                    {hasNurse && (
                                      <span className="ml-2 text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                                        Đã có nurse
                                      </span>
                                    )}
                                  </div>
                                  {service.description && (
                                    <div className="text-sm text-gray-600 mt-1">
                                      {service.description}
                                    </div>
                                  )}
                                  <div className="text-xs text-blue-600 mt-1">
                                    Trạng thái: {service.status || 'Chờ xử lý'}
                                  </div>
                                  {hasNurse && nurseInfo && (
                                    <div className="text-sm text-green-600 mt-2 bg-green-50 p-2 rounded border border-green-200">
                                      <div className="font-medium">Điều dưỡng: {nurseInfo.name}</div>
                                      <div className="text-xs text-green-700">
                                        ID: {nurseInfo.id}
                                        {nurseInfo.phone && ` | SĐT: ${nurseInfo.phone}`}
                                        {nurseInfo.experience && ` | Kinh nghiệm: ${nurseInfo.experience}`}
                                      </div>
                                    </div>
                                  )}
                                </div>
                                {!hasNurse && !isCompleted && (
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      handleAddNurse({
                                        ...service,
                                        customizeTaskId: service.customizeTaskId
                                      });
                                    }}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                                    style={{ pointerEvents: 'auto', zIndex: 10 }}
                                  >
                                    <FaUserMd className="text-xs" />
                                    Chọn điều dưỡng
                                  </button>
                                )}
                                {isCompleted && (
                                  <div className="text-sm text-gray-500 font-medium">
                                    🎉 Hoàn thành
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-6 bg-gray-50 rounded-lg">
                          <p className="text-gray-500">Không có dịch vụ con nào trong gói này</p>
                        </div>
                      )}
                    </div>
                  )}
                  {serviceDetails.type === 'individual_services' && serviceDetails.services.length > 0 && (
                    <div className="space-y-3">
                      {serviceDetails.services.map((service, index) => {
                        const hasNurse = !!service.nursingID;
                        const isCompleted = service.status === 'completed';
                        const nurseInfo = hasNurse ? getNurseInfo(service.nursingID) : null;

                        return (
                          <div key={service.serviceInstanceKey || `task-${index}`}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex-1">
                              <div className="font-medium text-gray-800">
                                {service.serviceName || service.ServiceName}
                                {hasNurse && (
                                  <span className="ml-2 text-sm bg-green-100 text-green-600 px-2 py-1 rounded-full">
                                    Đã có nurse
                                  </span>
                                )}
                              </div>
                              {service.description && (
                                <div className="text-sm text-gray-600 mt-1">
                                  {service.description}
                                </div>
                              )}
                              <div className="text-xs text-gray-500 mt-1">
                                Status: {service.status}
                              </div>
                              {hasNurse && nurseInfo && (
                                <div className="text-sm text-green-600 mt-2 bg-green-50 p-2 rounded border border-green-200">
                                  <div className="font-medium">Điều dưỡng: {nurseInfo.name}</div>
                                  <div className="text-xs text-green-700">
                                    ID: {nurseInfo.id}
                                    {nurseInfo.phone && ` | SĐT: ${nurseInfo.phone}`}
                                    {nurseInfo.experience && ` | Kinh nghiệm: ${nurseInfo.experience}`}
                                  </div>
                                </div>
                              )}
                            </div>
                            {!hasNurse && !isCompleted && (
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleAddNurse({
                                    ...service,
                                    customizeTaskId: service.customizeTaskId
                                  });
                                }}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                                style={{ pointerEvents: 'auto', zIndex: 10 }}
                              >
                                <FaUserMd className="text-xs" />
                                Chọn điều dưỡng
                              </button>
                            )}
                            {isCompleted && (
                              <div className="text-sm text-gray-500 font-medium">
                                🎉 Hoàn thành
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Individual Services with Quantity */}
                  {serviceDetails.type === 'individual_services_with_quantity' && serviceDetails.services.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-800 border-b pb-2">Dịch vụ lẻ: ({serviceDetails.services.length} lần thực hiện)</h4>
                      {serviceDetails.services.map((service, index) => (
                        <div key={service.serviceInstanceKey || `service-${index}`} className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
                          <div className="flex-1">
                            <div className="font-medium text-gray-800">
                              {service.serviceName || service.ServiceName}
                              {service.totalQuantity > 1 && (
                                <span className="ml-2 text-sm bg-orange-100 text-orange-600 px-2 py-1 rounded-full">
                                  Lần #{service.instanceNumber}/{service.totalQuantity}
                                </span>
                              )}
                            </div>
                            {service.description && (
                              <div className="text-sm text-gray-600 mt-1">
                                {service.description}
                              </div>
                            )}
                            <div className="text-xs text-orange-600 mt-1">
                              Service ID: {service.serviceID || service.serviceTypeID || service.ServiceID}
                              {service.customizePackageId && ` | Package ID: ${service.customizePackageId}`}
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleAddNurse({
                                ...service,
                                customizePackageId: service.customizePackageId,
                                instanceNumber: service.instanceNumber
                              });
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm"
                            style={{ pointerEvents: 'auto', zIndex: 10 }}
                          >
                            <FaUserMd className="text-xs" />
                            Chọn điều dưỡng
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {serviceDetails.type === 'legacy_services' && serviceDetails.services.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-800 border-b pb-2">Dịch vụ lẻ: ({serviceDetails.services.length} services)</h4>
                      {serviceDetails.services.map((service, index) => (
                        <div key={service.serviceInstanceKey || `service-${index}`} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex-1">
                            <div className="font-medium text-gray-800">
                              {service.serviceName || service.ServiceName}
                              {service.totalQuantity > 1 && (
                                <span className="ml-2 text-sm bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                                  #{service.instanceNumber}/{service.totalQuantity}
                                </span>
                              )}
                            </div>
                            {service.description && (
                              <div className="text-sm text-gray-600 mt-1">
                                {service.description}
                              </div>
                            )}
                            <div className="text-xs text-gray-500 mt-1">
                              Service ID: {service.serviceID || service.serviceTypeID || service.ServiceID}
                              {service.customizePackageId && ` | Package ID: ${service.customizePackageId}`}
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleAddNurse({
                                ...service,
                                customizePackageId: service.customizePackageId,
                                instanceNumber: service.instanceNumber
                              });
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                            style={{ pointerEvents: 'auto', zIndex: 10 }}
                          >
                            <FaUserMd className="text-xs" />
                            Chọn điều dưỡng
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {serviceDetails.type === 'unknown' && (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <FaStethoscope className="mx-auto text-4xl text-gray-300 mb-4" />
                      <p className="text-gray-500">Không thể xác định loại dịch vụ</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Invoice */}
            <div className="xl:col-span-1">
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-6">
                  <h3 className="text-xl font-bold flex items-center gap-3">
                    <FaFileInvoice />
                    Hóa đơn
                  </h3>
                </div>
                <div className="p-6">
                  {bookingInvoice ? (
                    <div className="space-y-4">
                      <div className="text-lg font-semibold text-gray-900">
                        Hóa đơn #{bookingInvoice.invoiceID || bookingInvoice.invoice_ID}
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Ngày tạo:</span>
                          <span className="font-medium">
                            {formatDate(bookingInvoice.paymentDate)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Trạng thái:</span>
                          <span className={`font-medium ${(bookingInvoice.status || bookingInvoice.Status) === 'Hoàn thành'
                            ? 'text-green-600'
                            : 'text-orange-600'
                            }`}>
                            {bookingInvoice.status || bookingInvoice.Status || 'Chưa thanh toán'}
                          </span>
                        </div>
                        <div className="flex justify-between text-lg font-bold border-t pt-2">
                          <span>Tổng tiền:</span>
                          <span className="text-green-600">
                            {(bookingInvoice.totalAmount || bookingInvoice.total_amount || finalAmount).toLocaleString('vi-VN')}₫
                          </span>
                        </div>
                      </div>

                      {/* Payment Button for Unpaid Invoices */}
                      {isInvoiceUnpaid() && (
                        <div className="mt-4 pt-4 border-t">
                          <button
                            onClick={handlePayment}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                          >
                            <FaCreditCard className="text-lg" />
                            Thanh toán ngay
                          </button>
                          <p className="text-xs text-gray-500 text-center mt-2">
                            Thanh toán để kích hoạt dịch vụ
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      <FaFileInvoice className="mx-auto text-4xl mb-4 opacity-50" />
                      <p>Chưa có hóa đơn</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Nurse Selection Modal */}
        {showNurseModal && selectedService && (
          <NurseSelectionModal
            isOpen={showNurseModal}
            onClose={() => {
              setShowNurseModal(false);
              setSelectedService(null);
            }}
            service={selectedService}
            availableNurses={selectedService?.availableNurses || availableNurses}
            onAssign={handleNurseAssignment}
            bookingDate={appointment.workdate || appointment.Workdate || appointment.BookingDate}
            bookingId={appointment.bookingID || appointment.BookingID}
            customizeTasks={customizeTasks?.filter(t => (t.bookingID || t.BookingID) === (appointment.bookingID || appointment.BookingID)) || []}
          />
        )}
      </div>
    </div>
  );
};

export default AppointmentDetailModal;
