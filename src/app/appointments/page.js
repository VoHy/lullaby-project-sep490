"use client";
import React, { useEffect, useState, useContext, useMemo, useCallback } from "react";
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaCalendar, FaPlus, FaSync } from 'react-icons/fa';
import { AuthContext } from '@/context/AuthContext';
import { useWalletContext } from '@/context/WalletContext';
import bookingService from '@/services/api/bookingService';
import serviceTypeService from '@/services/api/serviceTypeService';
import nursingSpecialistService from '@/services/api/nursingSpecialistService';
import serviceTaskService from '@/services/api/serviceTaskService';
import invoiceService from '@/services/api/invoiceService';
import transactionHistoryService from '@/services/api/transactionHistoryService';
import zoneDetailService from '@/services/api/zoneDetailService';
import customizePackageService from '@/services/api/customizePackageService';
import customizeTaskService from '@/services/api/customizeTaskService';
import {
  AppointmentCard,
  AppointmentDetailModal,
  SearchFilter,
  EmptyState
} from './components';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import {
  getServiceNames,
  getNurseNames,
  getStatusColor,
  getStatusText,
  formatDate,
  filterAppointments
} from './utils/appointmentUtils';
import careProfileService from "@/services/api/careProfileService";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [serviceTasks, setServiceTasks] = useState([]);
  const [nursingSpecialists, setNursingSpecialists] = useState([]);
  const [zoneDetails, setZoneDetails] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [customizePackages, setCustomizePackages] = useState([]);
  const [customizeTasks, setCustomizeTasks] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(8); // Số lịch hẹn mỗi trang

  const router = useRouter();
  const { user } = useContext(AuthContext);
  const { refreshWalletData } = useWalletContext();

  // Optimized data fetching with enhanced information
  const fetchData = useCallback(async (isRefresh = false) => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      // Fetch bookings (GetAll) và tự join theo accountID đang login
      const bookings = await bookingService.getAllBookings();

      const careProfiles = await careProfileService.getCareProfiles();

      const services = await serviceTypeService.getServiceTypes();

      const tasks = await serviceTaskService.getServiceTasks();

      const specialists = await nursingSpecialistService.getAllNursingSpecialists();

      const zones = await zoneDetailService.getZoneDetails();

  const invoiceData = await invoiceService.getAllInvoices();

      const packages = await customizePackageService.getAllCustomizePackages();

  const customizeTasksRaw = await customizeTaskService.getAllCustomizeTasks();

      // Lọc care profiles theo account hiện tại
      const currentAccountId = user.accountID || user.AccountID;
      const myCareProfiles = (Array.isArray(careProfiles) ? careProfiles : []).filter(cp => {
        const accId = cp.accountID ?? cp.AccountID;
        return accId === currentAccountId;
      });

      const myCareProfileIds = new Set(myCareProfiles.map(cp => cp.careProfileID ?? cp.CareProfileID));

      // Tạo map careProfile để join nhanh + chuẩn hóa field cho UI
      const careProfileMap = new Map((Array.isArray(careProfiles) ? careProfiles : []).map(cp => {
        const id = cp.careProfileID ?? cp.CareProfileID;
        const normalized = {
          ...cp,
          profileName: cp.profileName ?? cp.ProfileName ?? cp.fullName ?? cp.Full_Name ?? cp.name ?? 'Không xác định',
          phoneNumber: cp.phoneNumber ?? cp.PhoneNumber ?? cp.phone_Number ?? cp.Phone ?? cp.phone,
          address: cp.address ?? cp.Address,
          zoneDetailID: cp.zoneDetailID ?? cp.zoneDetail_ID ?? cp.ZoneDetailID ?? cp.Zone_DetailID ?? cp.Zone_Detail_ID
        };
        return [id, normalized];
      }));

      // Lọc bookings theo careProfileID thuộc user và gắn careProfile
      // Build invoice map: bookingId -> status
      const invoiceByBooking = new Map((Array.isArray(invoiceData) ? invoiceData : []).map(inv => {
        const bid = inv.bookingID ?? inv.BookingID ?? inv.booking_Id;
        const status = String(inv.status ?? inv.Status ?? '').toLowerCase();
        return [bid, status];
      }));

      const userAppointments = (Array.isArray(bookings) ? bookings : [])
        .filter(b => {
          const bCareId = b.careProfileID ?? b.CareProfileID;
          return myCareProfileIds.has(bCareId);
        })
        .map(b => {
          const bCareId = b.careProfileID ?? b.CareProfileID;
          const bookingId = b.bookingID ?? b.BookingID ?? b.id;
          

          const baseAmount = b.amount || b.totalAmount || b.total_Amount || 0;
          const extra = b.extra;
          const finalAmount = (() => {
            if (!extra || extra === null) {
              return baseAmount;
            }
            const extraPercentage = extra > 1 ? extra / 100 : extra;
            return baseAmount + (baseAmount * extraPercentage);
          })();
          

          
          // Normalize/override status from invoice if needed
          const rawStatus = b.status || b.Status;
          const invoiceStatus = invoiceByBooking.get(bookingId);
          const normalizedStatus = invoiceStatus === 'paid' ? 'paid' : rawStatus;

          return {
            ...b,
            careProfile: b.careProfile ?? careProfileMap.get(bCareId) ?? null,
            status: normalizedStatus,
          };
        });

      // Set all data
      setAppointments(userAppointments);
      setServiceTypes(services);
      setServiceTasks(tasks);
      setNursingSpecialists(specialists);
      setZoneDetails(zones);

      
      setInvoices(invoiceData);
      setCustomizePackages(packages);
      // Normalize customize tasks (ids + nursingID + status)
      const normalizedTasks = (Array.isArray(customizeTasksRaw) ? customizeTasksRaw : []).map(t => ({
        ...t,
        customizeTaskID: t.customizeTaskID ?? t.CustomizeTaskID ?? t.id ?? t.ID,
        serviceID: t.serviceID ?? t.ServiceID ?? t.service_ID,
        bookingID: t.bookingID ?? t.BookingID ?? t.booking_ID,
        nursingID: t.nursingID ?? t.NursingID ?? t.nursing_Id ?? t.nursingId ?? null,
        status: t.status ?? t.Status ?? 'pending',
      }));
      setCustomizeTasks(normalizedTasks);

      // Refresh wallet context để đảm bảo wallet data được update
      if (!isRefresh) {
        try {
          await refreshWalletData();
          console.log('Wallet context refreshed');
        } catch (walletError) {
          console.warn('Could not refresh wallet context:', walletError);
        }
      }

    } catch (error) {
      console.error('Error fetching appointments:', error);
      setError(`Không thể tải dữ liệu: ${error.message}`);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user, router]);

  useEffect(() => {
    if (!user) return;
    fetchData();
  }, [fetchData]);

  // Optimized memoized functions for better performance
  // Sắp xếp trạng thái theo thứ tự yêu cầu
  const statusOrder = ["pending", "isScheduled", "paid", "completed", "cancelled"];
  const filteredAppointments = useMemo(() => {
    if (!Array.isArray(appointments)) return [];
    const filtered = filterAppointments(appointments, searchText, statusFilter, dateFilter);
    // Sắp xếp theo trạng thái
    return filtered.slice().sort((a, b) => {
      const aStatus = String(a.status).toLowerCase();
      const bStatus = String(b.status).toLowerCase();
      const aIdx = statusOrder.indexOf(aStatus);
      const bIdx = statusOrder.indexOf(bStatus);
      // Nếu không tìm thấy thì cho xuống cuối
      return (aIdx === -1 ? 99 : aIdx) - (bIdx === -1 ? 99 : bIdx);
    });
  }, [appointments, searchText, statusFilter, dateFilter]);

  // Phân trang
  const totalPages = Math.ceil(filteredAppointments.length / pageSize);
  const paginatedAppointments = filteredAppointments.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Handle actions
  const handleRefresh = () => {
    fetchData(true);
  };

  const handleNewAppointment = () => {
    router.push('/services');
  };

  // Handle invoice payment
  const handleInvoicePayment = async (invoiceId) => {
    try {
      // Call payment API
      await transactionHistoryService.invoicePayment(invoiceId);
      
      // Show success message
      alert('Thanh toán thành công! Hóa đơn đã được thanh toán.');
      
      // Refresh data to show updated payment status
      await fetchData(true);
      
      // Refresh wallet context to show updated balance
      await refreshWalletData();
      
    } catch (error) {
      console.error('Error processing payment:', error);
      alert(`Có lỗi xảy ra khi thanh toán: ${error.message}`);
    }
  };

  // Handle booking cancellation
  const handleBookingCancel = async (appointment) => {
    try {
      const bookingId = appointment.bookingID || appointment.BookingID;
      
      // First, get the invoice for this booking
      const invoice = invoices.find(inv => 
        (inv.bookingID === bookingId || inv.BookingID === bookingId)
      );
      
      if (!invoice) {
        throw new Error('Không tìm thấy hóa đơn cho booking này');
      }
      
      const invoiceId = invoice.invoiceID || invoice.invoice_ID;
      
      // Call refund API
      await transactionHistoryService.refundMoneyToWallet(invoiceId);
      
      // Update booking status to 'cancelled'
      // await bookingService.updateStatus(bookingId, 'cancelled');
      
      // Show success message
      alert('Đã hủy booking thành công! Tiền đã được hoàn vào tài khoản của bạn.');
      
      // Refresh data to show updated status
      await fetchData(true);
      
      // Refresh wallet context to show updated balance
      await refreshWalletData();
      
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert(`Có lỗi xảy ra khi hủy booking: ${error.message}`);
    }
  };

  // Handle nurse assignment
  const handleNurseAssignment = async (service, nurseId) => {
    try {

      // Get booking ID
      const bookingId = selectedAppointment?.bookingID || selectedAppointment?.BookingID;
      if (!bookingId) {
        throw new Error('Không tìm thấy booking ID');
      }

      // Case 1: If service has customizeTaskId, update that task directly
      if (service.customizeTaskId) {
        
        await customizeTaskService.updateNursing(service.customizeTaskId, nurseId);
      }
      // Case 2: Package service with taskId (từ service task)
      else if (service.taskId) {
        // Directly use the taskId from service task
        const customizeTaskId = service.taskId;
        await customizeTaskService.updateNursing(customizeTaskId, nurseId);
      }
      // Case 3: Individual service - need to find corresponding CustomizeTask
      else {


        // Get all customize packages for this booking
        const customizePackagesData = await customizePackageService.getAllByBooking(bookingId);

        // Find the customize package that matches the service
        const serviceId = service.serviceID || service.serviceTypeID || service.ServiceID;
        const matchingPackage = customizePackagesData.find(pkg =>
          (pkg.serviceID === serviceId) ||
          (pkg.service_ID === serviceId) ||
          (pkg.Service_ID === serviceId)
        );

        if (!matchingPackage) {
          throw new Error('Không tìm thấy customize package tương ứng');
        }

        // Get all customize tasks for this package
        const customizePackageId = matchingPackage.customizePackageID || matchingPackage.customize_PackageID;
        const customizeTasksData = await customizeTaskService.getTasksByPackage(customizePackageId);

        if (customizeTasksData.length === 0) {
          throw new Error('Không tìm thấy customize task nào');
        }

        // For individual service, update the first available task
        // You might want to add more logic here to select the right task
        const taskToUpdate = customizeTasksData[0];
        const customizeTaskId = taskToUpdate.customizeTaskID || taskToUpdate.customize_TaskID;

        await customizeTaskService.updateNursing(customizeTaskId, nurseId);
      }

      // Success notification
      alert('Đã phân công nurse thành công!');

      // Refresh data to show updated assignment
      await fetchData(true);
    } catch (error) {
      console.error('Error assigning nurse:', error);
      alert(`Có lỗi xảy ra khi phân công nurse: ${error.message}`);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Đang tải lịch hẹn..." fullScreen={true} />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Có lỗi xảy ra</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => fetchData()}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
              Lịch hẹn của bạn
            </h1>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors disabled:opacity-50"
              title="Làm mới dữ liệu"
            >
              {refreshing ? '🔄' : <FaSync />}
            </button>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Quản lý và theo dõi tất cả lịch hẹn chăm sóc sức khỏe của bạn
          </p>
        </motion.div>

        {/* Search and Filter Section */}
        <SearchFilter
          searchText={searchText}
          setSearchText={setSearchText}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
        />

        {/* Results Count */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <p className="text-gray-600">
            Tìm thấy <span className="font-semibold text-purple-600">{filteredAppointments.length}</span> lịch hẹn
            {searchText && ` cho "${searchText}"`}
            {statusFilter !== 'all' && ` với trạng thái "${getStatusText(statusFilter)}"`}
          </p>
        </motion.div>

        {/* Appointments List */}
        {!Array.isArray(filteredAppointments) || filteredAppointments.length === 0 ? (
          <EmptyState onNewAppointment={handleNewAppointment} />
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {paginatedAppointments.map((appointment, idx) => {
                if (!appointment) return null;
                const bookingKey = appointment.bookingID || appointment.BookingID || `appointment-${idx}`;
                return (
                  <AppointmentCard
                    key={bookingKey}
                    appointment={appointment}
                    index={idx + (currentPage - 1) * pageSize}
                    serviceTypes={serviceTypes || []}
                    onSelect={setSelectedAppointment}
                    onCancel={handleBookingCancel}
                    getStatusColor={getStatusColor}
                    getStatusText={getStatusText}
                    formatDate={formatDate}
                  />
                );
              })}
            </div>
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  className="px-3 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Trang trước
                </button>
                <span className="mx-2 text-gray-600">Trang {currentPage} / {totalPages}</span>
                <button
                  className="px-3 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Trang sau
                </button>
              </div>
            )}
          </>
        )}

        {/* New Appointment Button */}
        {filteredAppointments.length > 0 && (
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <button
              onClick={handleNewAppointment}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              <FaPlus className="inline mr-2" />
              Đặt lịch hẹn mới
            </button>
          </motion.div>
        )}

        {/* Appointment Detail Modal */}
        {selectedAppointment && (
          <AppointmentDetailModal
            appointment={selectedAppointment}
            onClose={() => setSelectedAppointment(null)}
            serviceTypes={serviceTypes}
            serviceTasks={serviceTasks}
            nursingSpecialists={nursingSpecialists}
            zoneDetails={zoneDetails}
            invoices={invoices}
            customizePackages={customizePackages}
            customizeTasks={customizeTasks}
            getStatusColor={getStatusColor}
            getStatusText={getStatusText}
            formatDate={formatDate}
            onAssignNursing={handleNurseAssignment}
            onPayment={handleInvoicePayment}
          />
        )}
      </div>
    </div>
  );
}
