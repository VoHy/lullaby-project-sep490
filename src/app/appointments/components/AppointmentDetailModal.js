'use client';

import React, { useState } from 'react';
import { FaTimes, FaCalendar, FaUser, FaUserCircle, FaBox, FaStethoscope, FaMoneyBillWave, FaUserMd, FaPlus, FaFileInvoice } from 'react-icons/fa';
import NurseSelectionModal from './NurseSelectionModal';

const AppointmentDetailModal = ({
    appointment,
    onClose,
    serviceTypes,
    serviceTasks,
    nursingSpecialists,
    zoneDetails,
    invoices,
    customizePackages,
    getStatusColor,
    getStatusText,
    formatDate,
    onAssignNursing
}) => {
    const [showNurseModal, setShowNurseModal] = useState(false);
    const [selectedService, setSelectedService] = useState(null);

    if (!appointment) return null;

    const bookingId = appointment.bookingID || appointment.BookingID;
    const careProfile = appointment.careProfile;
    const amount = appointment.amount || appointment.totalAmount || appointment.total_Amount || 0;

    // Lấy invoice cho booking này
    const bookingInvoice = invoices.find(inv =>
        inv.bookingID === bookingId || inv.BookingID === bookingId
    );

    // Tính toán thông tin dịch vụ và service tasks
    const getServiceDetails = () => {
        const bookingId = appointment.bookingID || appointment.BookingID;

        // Tìm customize packages theo BookingID
        const bookingPackages = customizePackages?.filter(pkg =>
            pkg.bookingID === bookingId ||
            pkg.BookingID === bookingId ||
            pkg.booking_ID === bookingId
        ) || [];

        if (bookingPackages.length > 0) {
            const services = bookingPackages.map(pkg => {
                const serviceId = pkg.serviceID || pkg.service_ID || pkg.Service_ID;
                const service = serviceTypes.find(s =>
                    s.serviceID === serviceId ||
                    s.serviceTypeID === serviceId ||
                    s.ServiceID === serviceId
                );
                return service;
            }).filter(Boolean);

            // Kiểm tra có package service không dựa trên field isPackage
            const packageService = services.find(service =>
                service.isPackage === true
            );

            if (packageService) {
                // Package booking
                const serviceId = packageService.serviceID || packageService.serviceTypeID || packageService.ServiceID;
                const packageTasks = serviceTasks.filter(task =>
                    task.package_ServiceID === serviceId ||
                    task.packageServiceID === serviceId ||
                    task.Package_ServiceID === serviceId
                );

                return {
                    type: 'package',
                    mainService: packageService,
                    tasks: packageTasks,
                    services: []
                };
            } else {
                // Individual services
                return {
                    type: 'services',
                    mainService: null,
                    tasks: [],
                    services: services
                };
            }
        }

        return { type: 'unknown', mainService: null, tasks: [], services: [] };
    };

    const serviceDetails = getServiceDetails();

    // Lọc nurses theo zone
    const getAvailableNurses = () => {
        if (!careProfile?.zoneDetailID && !careProfile?.zoneDetail_ID) return nursingSpecialists;

        const careProfileZoneId = careProfile.zoneDetailID || careProfile.zoneDetail_ID;

        return nursingSpecialists.filter(nurse => {
            const nurseZoneId = nurse.zoneID || nurse.zone_ID || nurse.Zone_ID;
            return nurseZoneId === careProfileZoneId;
        });
    };

    const availableNurses = getAvailableNurses();

    const handleAddNurse = (service) => {
        setSelectedService(service);
        setShowNurseModal(true);
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

    return (
        <div
            className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4"
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
                            {formatDate(appointment.workdate || appointment.Workdate || appointment.BookingDate)}
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
                                    {getStatusText(appointment.status || appointment.Status)}
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
                                    {amount.toLocaleString('vi-VN')}₫
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
                                        ) : (
                                            <><FaStethoscope />Dịch vụ</>
                                        )}
                                    </h3>
                                </div>
                                <div className="p-6 space-y-4">
                                    {serviceDetails.type === 'package' && serviceDetails.mainService && (
                                        <div className="mb-6">
                                            <div className="font-semibold text-lg text-gray-900 mb-2">
                                                {serviceDetails.mainService.serviceName || serviceDetails.mainService.ServiceName}
                                            </div>
                                            {serviceDetails.mainService.description && (
                                                <div className="text-sm text-gray-600 mb-4">
                                                    {serviceDetails.mainService.description}
                                                </div>
                                            )}

                                            {/* Service Tasks of Package */}
                                            {serviceDetails.tasks.length > 0 ? (
                                                <div className="space-y-3">
                                                    <h4 className="font-medium text-gray-800 border-b pb-2">Dịch vụ trong gói:</h4>
                                                    {serviceDetails.tasks.map((task, index) => {
                                                        const childService = serviceTypes.find(s =>
                                                            s.serviceID === (task.childServiceID || task.child_ServiceID || task.Child_ServiceID) ||
                                                            s.serviceTypeID === (task.childServiceID || task.child_ServiceID || task.Child_ServiceID)
                                                        );

                                                        return (
                                                            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                                                                <div className="flex-1">
                                                                    <div className="font-medium text-gray-800">
                                                                        Tên: {childService?.serviceName || childService?.ServiceName || 'Dịch vụ không xác định'}
                                                                    </div>
                                                                    {childService?.description && (
                                                                        <div className="text-sm text-gray-600 mt-1">
                                                                            Mô tả: {childService.description}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <button
                                                                    onClick={() => handleAddNurse({ ...childService, taskId: task.taskID || task.task_ID })}
                                                                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                                                                >
                                                                    <FaUserMd className="text-xs" />
                                                                    Add Nurse
                                                                </button>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            ) : (
                                                <div className="text-center py-6 bg-gray-50 rounded-lg">
                                                    <p className="text-gray-500">Không có service tasks nào cho gói này</p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {serviceDetails.type === 'services' && serviceDetails.services.length > 0 && (
                                        <div className="space-y-3">
                                            <h4 className="font-medium text-gray-800 border-b pb-2">Dịch vụ lẻ:</h4>
                                            {serviceDetails.services.map((service, index) => (
                                                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                                                    <div className="flex-1">
                                                        <div className="font-medium text-gray-800">
                                                            {service.serviceName || service.ServiceName}
                                                        </div>
                                                        {service.description && (
                                                            <div className="text-sm text-gray-600 mt-1">
                                                                {service.description}
                                                            </div>
                                                        )}
                                                        <div className="text-xs text-gray-500 mt-1">
                                                            Service ID: {service.serviceID || service.serviceTypeID || service.ServiceID}
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => handleAddNurse(service)}
                                                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                                                    >
                                                        <FaUserMd className="text-xs" />
                                                        Add Nurse
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
                                                    <span className={`font-medium ${(bookingInvoice.status || bookingInvoice.Status) === 'paid'
                                                        ? 'text-green-600'
                                                        : 'text-orange-600'
                                                        }`}>
                                                        {bookingInvoice.status || bookingInvoice.Status || 'Chưa thanh toán'}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between text-lg font-bold border-t pt-2">
                                                    <span>Tổng tiền:</span>
                                                    <span className="text-green-600">
                                                        {(bookingInvoice.totalAmount || bookingInvoice.total_amount || amount).toLocaleString('vi-VN')}₫
                                                    </span>
                                                </div>
                                            </div>
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
                        availableNurses={availableNurses}
                        onAssign={handleNurseAssignment}
                    />
                )}
            </div>
        </div>
    );
};

export default AppointmentDetailModal;