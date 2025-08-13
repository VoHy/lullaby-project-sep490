'use client';

import React, { useEffect, useState } from 'react';
import { FaTimes, FaCalendar, FaUser, FaUserCircle, FaBox, FaStethoscope, FaMoneyBillWave, FaUserMd, FaPlus, FaFileInvoice, FaCreditCard } from 'react-icons/fa';
// Customer view only: hide interactive nurse selection on appointments page
// import NurseSelectionModal from './NurseSelectionModal';
import nursingSpecialistServiceTypeService from '@/services/api/nursingSpecialistServiceTypeService';
import feedbackService from '@/services/api/feedbackService';
import FeedbackForm from './FeedbackForm';


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
  const [feedbackInputs, setFeedbackInputs] = useState({}); // { [customizeTaskId]: { rate, content } }
  const [feedbackSubmitting, setFeedbackSubmitting] = useState({}); // { [customizeTaskId]: boolean }
  const [feedbackSubmitted, setFeedbackSubmitted] = useState({}); // { [customizeTaskId]: boolean }
  const [feedbackByTask, setFeedbackByTask] = useState({}); // { [customizeTaskId]: feedback }

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

  // Get nurses for a service using per-nurse mapping and zone filter
  const getServiceSpecificNurses = async (serviceId) => {
    try {
      const zoneId = careProfile?.zoneDetailID || careProfile?.zoneDetail_ID;
      const candidatePool = Array.isArray(nursingSpecialists)
        ? nursingSpecialists.filter(n => !zoneId || (n.zoneID || n.zone_ID || n.Zone_ID) === zoneId)
        : [];

      // For each candidate nurse, verify they can perform this service via getByNursing
      const checks = await Promise.all(
        candidatePool.map(async (nurse) => {
          const nid = nurse.nursingID || nurse.nursing_ID || nurse.Nursing_ID;
          try {
            const mappings = await nursingSpecialistServiceTypeService.getByNursing(nid);
            const canDo = Array.isArray(mappings)
              ? mappings.some(m => (m.serviceID || m.ServiceID) === serviceId)
              : false;
            return canDo ? nurse : null;
          } catch {
            return null;
          }
        })
      );

      return checks.filter(Boolean);
    } catch (error) {
      console.error('Error fetching nurses by nursing mapping:', error);
      // Fallback: zone filter only
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

    const nurse = nursingSpecialists.find(n => {
      const id = n.nursingID ?? n.nursing_ID ?? n.Nursing_ID ?? n.NursingID;
      return String(id) === String(nursingId);
    });

    return nurse ? {
      id: nursingId,
      name: nurse.fullName || nurse.full_Name || nurse.Full_Name || nurse.FullName || 'Không có tên',
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

  // Helpers for feedback
  const getCustomizeTaskId = (service) => (
    service?.customizeTaskId || service?.customizeTaskID || service?.customize_TaskID
  );

  // Load existing feedbacks per task when services are ready
  useEffect(() => {
    const services = Array.isArray(serviceDetails?.services) ? serviceDetails.services : [];
    const ids = Array.from(new Set(
      services
        .map((s) => getCustomizeTaskId(s))
        .filter(Boolean)
    ));
    if (ids.length === 0) return;

    let isCancelled = false;
    const load = async () => {
      try {
        const results = await Promise.all(
          ids.map((id) => feedbackService.getByCustomizeTask(id).catch(() => null))
        );
        if (isCancelled) return;
        const map = {};
        results.forEach((fb, idx) => {
          const id = ids[idx];
          if (fb) {
            map[id] = fb;
            // Seed default input values from existing feedback
            setFeedbackInputs((prev) => ({
              ...prev,
              [id]: {
                rate: Number(fb.rate || fb.Rate || 0),
                content: fb.content || fb.Content || '',
              },
            }));
          }
        });
        setFeedbackByTask((prev) => ({ ...prev, ...map }));
      } catch (e) {
        // ignore
      }
    };
    load();
    return () => { isCancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointment?.bookingID, appointment?.BookingID, serviceDetails?.type]);

  const handleFeedbackRate = (taskId, rate) => {
    setFeedbackInputs((prev) => ({
      ...prev,
      [taskId]: {
        ...(prev[taskId] || {}),
        rate,
      },
    }));
  };

  const handleFeedbackContent = (taskId, content) => {
    setFeedbackInputs((prev) => ({
      ...prev,
      [taskId]: {
        ...(prev[taskId] || {}),
        content,
      },
    }));
  };

  const submitFeedback = async (taskId) => {
    try {
      if (!taskId) return;
      const payload = {
        customizeTaskID: taskId,
        rate: Number(feedbackInputs?.[taskId]?.rate || 0),
        content: feedbackInputs?.[taskId]?.content || '',
      };
      if (!payload.rate && !payload.content) {
        alert('Vui lòng chọn sao hoặc nhập nội dung đánh giá.');
        return;
      }
      setFeedbackSubmitting((s) => ({ ...s, [taskId]: true }));
      const existing = feedbackByTask[taskId];
      if (existing) {
        const fid = existing.feedbackID || existing.FeedbackID || existing.id || existing.ID;
        await feedbackService.updateFeedback(fid, {
          rate: payload.rate,
          content: payload.content,
        });
        setFeedbackByTask((prev) => ({
          ...prev,
          [taskId]: { ...existing, rate: payload.rate, content: payload.content },
        }));
        setFeedbackSubmitted((s) => ({ ...s, [taskId]: true }));
      } else {
        await feedbackService.createFeedback(payload);
        const fb = await feedbackService.getByCustomizeTask(taskId).catch(() => null);
        if (fb) setFeedbackByTask((prev) => ({ ...prev, [taskId]: fb }));
        setFeedbackSubmitted((s) => ({ ...s, [taskId]: true }));
      }
    } catch (e) {
      console.error('Gửi feedback thất bại', e);
      alert('Gửi feedback thất bại. Vui lòng thử lại.');
    } finally {
      setFeedbackSubmitting((s) => ({ ...s, [taskId]: false }));
    }
  };

  const renderFeedbackForm = (service) => {
    const taskId = getCustomizeTaskId(service);
    if (!taskId) return null;
    return <FeedbackForm customizeTaskId={taskId} />;
  };

  const renderServiceItem = (service, index, isDone, hasNurse, nurseInfo) => (
    <div key={service.serviceInstanceKey || `service-${index}`}
      className="bg-white rounded-lg border border-gray-200 shadow-sm mb-4">
      {/* Service Header */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <div className="font-medium text-gray-900 flex items-center gap-2 mb-2">
              {service.taskOrder && (
                <span className="text-gray-500 font-medium text-sm">#{service.taskOrder}</span>
              )}
              <span className="truncate">{service.serviceName || service.ServiceName}</span>
              {hasNurse && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full whitespace-nowrap">
                  Đã có nhân viên
                </span>
              )}
            </div>
            {service.description && (
              <div className="text-sm text-gray-600 mb-2">
                {service.description}
              </div>
            )}
            <div className="text-xs text-gray-500">
              Trạng thái: {service.status || 'Chờ xử lý'}
            </div>
          </div>
          <div className="ml-4 flex-shrink-0">
            {/* Hidden nurse selection button for customer view */}
            {isDone && (
              <div className="text-sm text-gray-600 font-medium whitespace-nowrap">
                {String(service.status || '').toLowerCase() === 'completed' ? '✓ Hoàn thành' : '✗ Đã hủy'}
              </div>
            )}
          </div>
        </div>

        {/* Nurse Info */}
        {hasNurse && nurseInfo && (
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 mb-3">
            <div className="font-medium text-gray-800 text-sm">Điều dưỡng: {nurseInfo.name}</div>
            <div className="text-xs text-gray-600 mt-1">
              ID: {nurseInfo.id}
              {nurseInfo.phone && ` | SĐT: ${nurseInfo.phone}`}
              {nurseInfo.experience && ` | Kinh nghiệm: ${nurseInfo.experience}`}
            </div>
          </div>
        )}

        {/* Feedback Form */}
        {isDone && (
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <h5 className="font-medium text-gray-800 mb-2">Đánh giá dịch vụ</h5>
            {renderFeedbackForm(service)}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-7xl w-full relative max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg p-6 relative">
          <button
            className="absolute top-4 right-4 text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-colors"
            onClick={onClose}
          >
            <FaTimes className="text-lg" />
          </button>

          <div className="pr-12">
            <h1 className="text-2xl font-bold mb-2">
              Chi tiết lịch hẹn #{bookingId}
            </h1>
            <p className="text-blue-100">
              {formatDate(appointment.workdate || appointment.Workdate)}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* First Row - Basic Info */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Status */}
            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <div className="p-1.5 bg-blue-100 rounded-lg">
                  <FaCalendar className="text-blue-600 text-sm" />
                </div>
                Trạng thái
              </h3>
              <span className={`px-3 py-2 rounded-full text-sm font-medium ${getStatusColor(appointment.status || appointment.Status)}`}>
                {getStatusText(appointment.status || appointment.Status)}
              </span>
            </div>

            {/* Care Profile */}
            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <div className="p-1.5 bg-green-100 rounded-lg">
                  <FaUserCircle className="text-green-600 text-sm" />
                </div>
                Thông tin người được chăm sóc
              </h3>
              <div className="space-y-2 text-gray-700">
                <div className="flex items-center gap-2">
                  <FaUser className="text-gray-500 text-sm" />
                  <span className="font-medium">{careProfile?.profileName || 'Không xác định'}</span>
                </div>
                {careProfile?.dateOfBirth && (
                  <div className="text-sm text-gray-600">
                    <strong>Ngày sinh:</strong> {new Date(careProfile.dateOfBirth).toLocaleDateString('vi-VN')}
                  </div>
                )}
                {careProfile?.phoneNumber && (
                  <div className="text-sm text-gray-600">
                    <strong>SĐT:</strong> {careProfile.phoneNumber}
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
            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <div className="p-1.5 bg-orange-100 rounded-lg">
                  <FaMoneyBillWave className="text-orange-600 text-sm" />
                </div>
                Tổng tiền
              </h3>
              <div className="text-2xl font-bold text-gray-900">
                {finalAmount.toLocaleString('vi-VN')}₫
              </div>
              <div className="text-sm text-gray-600 mt-2">
                <div><strong>Số tiền cơ bản:</strong> {baseAmount.toLocaleString('vi-VN')}₫</div>
                {extraAmount > 0 && (
                  <div><strong>Phí thêm:</strong> {extraAmount.toLocaleString('vi-VN')}₫</div>
                )}
              </div>
            </div>
          </div>

          {/* Second Row - Services and Invoice */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Services Section - Takes 2 columns */}
            <div className="xl:col-span-2">
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    {serviceDetails.type === 'package' ? (
                      <><FaBox />Gói dịch vụ</>
                    ) : (
                      <><FaStethoscope />Dịch vụ</>
                    )}
                  </h3>
                </div>
                <div className="p-4">
                  {/* Package Display */}
                  {serviceDetails.type === 'package' && serviceDetails.mainService && (
                    <div className="mb-4">
                      {/* Main Package Info */}
                      <div className="bg-gray-50 border-l-4 border-purple-600 p-4 rounded-lg mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <FaBox className="text-purple-600" />
                          <div className="font-semibold text-lg text-gray-900">
                            {serviceDetails.mainService.serviceName || serviceDetails.mainService.ServiceName}
                          </div>
                        </div>
                        {serviceDetails.mainService.description && (
                          <div className="text-sm text-gray-600 mb-2">
                            {serviceDetails.mainService.description}
                          </div>
                        )}
                        <div className="text-xs text-gray-500">
                          Gói dịch vụ • {serviceDetails.services.length} dịch vụ con
                        </div>
                      </div>

                      {/* Child Services */}
                      {serviceDetails.services.length > 0 ? (
                        <div>
                          <h4 className="font-medium text-gray-800 mb-4 flex items-center gap-2">
                            <FaStethoscope className="text-gray-500" />
                            Dịch vụ trong gói:
                          </h4>
                          {serviceDetails.services.map((service, index) => {
                            const hasNurse = !!service.nursingID;
                            const statusLc = String(service.status || '').toLowerCase();
                            const isDone = statusLc === 'completed' || statusLc === 'cancelled' || statusLc === 'canceled';
                            const nurseInfo = hasNurse ? getNurseInfo(service.nursingID) : null;

                            return renderServiceItem(service, index, isDone, hasNurse, nurseInfo);
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-6 bg-gray-50 rounded-lg">
                          <p className="text-gray-500">Không có dịch vụ con nào trong gói này</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Individual Services */}
                  {(serviceDetails.type === 'individual_services' || serviceDetails.type === 'individual_services_with_quantity') && serviceDetails.services.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-800 mb-4">
                        Dịch vụ lẻ ({serviceDetails.services.length} dịch vụ)
                      </h4>
                      {serviceDetails.services.map((service, index) => {
                        const hasNurse = !!service.nursingID;
                        const statusLc = String(service.status || '').toLowerCase();
                        const isDone = statusLc === 'completed' || statusLc === 'cancelled' || statusLc === 'canceled';
                        const nurseInfo = hasNurse ? getNurseInfo(service.nursingID) : null;

                        return renderServiceItem(service, index, isDone, hasNurse, nurseInfo);
                      })}
                    </div>
                  )}

                  {serviceDetails.type === 'unknown' && (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <FaStethoscope className="mx-auto text-3xl text-gray-400 mb-3" />
                      <p className="text-gray-500">Không thể xác định loại dịch vụ</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Invoice Section - Takes 1 column */}
            <div className="xl:col-span-1">
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <FaFileInvoice />
                    Hóa đơn
                  </h3>
                </div>
                <div className="p-4">
                  {bookingInvoice ? (
                    <div className="space-y-4">
                      <div className="text-lg font-semibold text-gray-900">
                        Hóa đơn #{bookingInvoice.invoiceID || bookingInvoice.invoice_ID}
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Ngày tạo:</span>
                          <span className="font-medium text-gray-900">
                            {formatDate(bookingInvoice.paymentDate)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Trạng thái:</span>
                          <span
                            className={`font-medium ${String(bookingInvoice.status || bookingInvoice.Status).toLowerCase() === 'paid'
                              ? 'text-green-600'
                              : String(bookingInvoice.status || bookingInvoice.Status).toLowerCase() === 'refunded'
                                ? 'text-red-600'
                                : 'text-orange-600'
                              }`}
                          >
                            {String(bookingInvoice.status || bookingInvoice.Status).toLowerCase() === 'paid'
                              ? 'Đã thanh toán'
                              : String(bookingInvoice.status || bookingInvoice.Status).toLowerCase() === 'refunded'
                                ? 'Hoàn tiền'
                                : bookingInvoice.status || bookingInvoice.Status || 'Chưa thanh toán'}
                          </span>
                        </div>
                        <div className="flex justify-between text-lg font-bold border-t pt-2">
                          <span>Tổng tiền:</span>
                          <span className="text-gray-900">
                            {(bookingInvoice.totalAmount || bookingInvoice.total_amount || finalAmount).toLocaleString('vi-VN')}₫
                          </span>
                        </div>
                      </div>

                      {/* Payment Button for Unpaid Invoices */}
                      {isInvoiceUnpaid() && (
                        <div className="mt-4 pt-4 border-t">
                          <button
                            onClick={handlePayment}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg"
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
                      <FaFileInvoice className="mx-auto text-3xl mb-3 opacity-50" />
                      <p>Chưa có hóa đơn</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Nurse selection modal is disabled in appointment view for customers */}
      </div>
    </div>
  );
};

export default AppointmentDetailModal;
