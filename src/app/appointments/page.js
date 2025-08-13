"use client";
import React, { useEffect, useState, useContext, useMemo, useCallback } from "react";
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaPlus, FaSync, FaSearch } from 'react-icons/fa';
import { AuthContext } from '@/context/AuthContext';
import { useWalletContext } from '@/context/WalletContext';
import {
  bookingService,
  serviceTypeService,
  nursingSpecialistService,
  serviceTaskService,
  invoiceService,
  transactionHistoryService,
  zoneDetailService,
  customizePackageService,
  customizeTaskService,
  careProfileService
} from '@/services/api';
import { AppointmentCard, AppointmentDetailModal, EmptyState } from './components';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

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
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const router = useRouter();
  const { user } = useContext(AuthContext);
  const { refreshWalletData } = useWalletContext();

  // Utility functions
  const normalizeCustomizeTask = (task) => task; // Dummy normalization
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'yellow';
      case 'completed': return 'green';
      case 'cancelled': return 'red';
      default: return 'gray';
    }
  };
  const getStatusText = (status) => {
    // Handle boolean isSchedule
    if (typeof status === 'object' && status !== null) {
      if ('isSchedule' in status) {
        return status.isSchedule ? 'Đã lên lịch' : 'Chưa lên lịch';
      }
    }
    switch (status) {
      case 'pending': return 'Đang chờ';
      case 'completed': return 'Hoàn thành';
      case 'cancelled': return 'Đã hủy';
      case 'isScheduled': return 'Đã lên lịch';
      default: return 'Không xác định';
    }
  };
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('vi-VN');
  };

  // Sort order mapping
  const statusOrder = {
    isScheduled: 1,
    paid_notScheduled: 2,
    pending: 3,
    completed: 4,
    cancelled: 5
  };

  // Helper to get sort value
  function getSortValue(a) {
    if ((a.isSchedule === true || a.status === 'isScheduled') && a.status !== 'cancelled' && a.status !== 'completed') return statusOrder.isScheduled;
    if (a.status === 'paid' && a.isSchedule === false) return statusOrder.paid_notScheduled;
    if (a.status === 'pending') return statusOrder.pending;
    if (a.status === 'completed') return statusOrder.completed;
    if (a.status === 'cancelled') return statusOrder.cancelled;
    return 99;
  }

  // Filter and paginate appointments
  const userAppointments = useMemo(() => {
    if (!appointments || !user) return [];
    // Filter appointments for current user
    return appointments.filter(a => a.userID === user.userID);
  }, [appointments, user]);

  // Sort and filter
  const filteredSortedAppointments = useMemo(() => {
    let filtered = userAppointments;
    if (statusFilter !== 'all') {
      if (statusFilter === 'isScheduled') {
        filtered = filtered.filter(a => (a.isSchedule === true || a.status === 'isScheduled') && a.status !== 'cancelled' && a.status !== 'completed');
      } else if (statusFilter === 'notScheduled') {
        filtered = filtered.filter(a => a.status === 'paid' && a.isSchedule === false);
      } else {
        filtered = filtered.filter(a => a.status === statusFilter);
      }
    }
    if (searchText) {
      filtered = filtered.filter(a =>
        a.serviceName?.toLowerCase().includes(searchText.toLowerCase()) ||
        a.bookingID?.toString().includes(searchText)
      );
    }
    // Sort
    filtered = filtered.slice().sort((a, b) => getSortValue(a) - getSortValue(b));
    return filtered;
  }, [userAppointments, statusFilter, searchText]);

  // Pagination
  const totalFiltered = filteredSortedAppointments.length;
  const totalAll = userAppointments.length;
  const totalPages = Math.ceil(totalFiltered / pageSize);
  const paginatedAppointments = useMemo(() => {
    const startIdx = (currentPage - 1) * pageSize;
    return filteredSortedAppointments.slice(startIdx, startIdx + pageSize);
  }, [filteredSortedAppointments, currentPage, pageSize]);

  const fetchData = useCallback(async (isRefresh = false) => {
    if (!user) return router.push('/auth/login');
    try {
      isRefresh ? setRefreshing(true) : setLoading(true);
      setError(null);

      const [
        bookings, careProfiles, services, tasks,
        specialists, zones, invoiceData,
        packages, customizeTasksRaw
      ] = await Promise.all([
        bookingService.getAllBookings(),
        careProfileService.getCareProfiles(),
        serviceTypeService.getServiceTypes(),
        serviceTaskService.getServiceTasks(),
        nursingSpecialistService.getAllNursingSpecialists(),
        zoneDetailService.getZoneDetails(),
        invoiceService.getAllInvoices(),
        customizePackageService.getAllCustomizePackages(),
        customizeTaskService.getAllCustomizeTasks()
      ]);

      // Map careProfile vào từng booking
      // Map careProfile vào từng booking, hỗ trợ nhiều kiểu tên trường
      const bookingsWithCareProfile = bookings.map(b => {
        const profileId = b.careProfileId || b.careProfileID;
        if (!b.careProfile && profileId) {
          const foundProfile = careProfiles.find(p => p.careProfileID === profileId);
          return { ...b, careProfile: foundProfile };
        }
        return b;
      });
      setAppointments(bookingsWithCareProfile);
      setServiceTypes(services);
      setServiceTasks(tasks);
      setNursingSpecialists(specialists);
      setZoneDetails(zones);
      setInvoices(invoiceData);
      setCustomizePackages(packages);
      setCustomizeTasks(customizeTasksRaw.map(normalizeCustomizeTask));

      if (!isRefresh) await refreshWalletData();
    } catch (err) {
      setError(`Không thể tải dữ liệu: ${err.message}`);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user, router, refreshWalletData]);

  useEffect(() => { if (user) fetchData(); }, [fetchData, user]);

  if (loading) return <LoadingSpinner message="Đang tải lịch hẹn..." fullScreen />;
  if (error) return <div>{error}</div>;

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <motion.div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent leading-tight">Lịch hẹn của bạn</h1>
          <button onClick={() => fetchData(true)} disabled={refreshing}><FaSync /></button>
        </motion.div>

        {/* Search and status filter */}
        <div className="mb-8 flex flex-col lg:flex-row justify-center items-center gap-4">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 pr-10"
              placeholder="Tìm kiếm theo dịch vụ hoặc mã đặt lịch..."
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400 pointer-events-none">
              <FaSearch />
            </span>
          </div>
          <select
            className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Đang chờ</option>
            <option value="completed">Hoàn thành</option>
            <option value="cancelled">Đã hủy</option>
            <option value="isScheduled">Đã lên lịch</option>
            <option value="notScheduled">Chưa lên lịch</option>
          </select>
        </div>

        {/* Tổng số booking và filter */}
        <div className="mb-4 flex flex-col lg:flex-row justify-between items-center gap-4">
          <div className="text-gray-700 text-base">
            Tổng số booking: <span className="font-bold text-purple-600">{totalAll}</span>
            {statusFilter !== 'all' && (
              <span> | Theo filter: <span className="font-bold text-pink-600">{totalFiltered}</span></span>
            )}
          </div>
          {/* Pagination controls */}
          <div className="flex gap-2 items-center">
            <button
              className="px-3 py-1 rounded bg-purple-100 text-purple-700 font-semibold disabled:opacity-50"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            >Trước</button>
            <span className="font-semibold">Trang {currentPage} / {totalPages}</span>
            <button
              className="px-3 py-1 rounded bg-purple-100 text-purple-700 font-semibold disabled:opacity-50"
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            >Sau</button>
          </div>
        </div>

        {paginatedAppointments.length === 0 ? (
          <EmptyState onNewAppointment={() => router.push('/services')} />
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {paginatedAppointments.map((appointment, idx) => (
                <AppointmentCard
                  key={appointment.bookingID || idx}
                  appointment={appointment}
                  index={idx}
                  serviceTypes={serviceTypes}
                  onSelect={setSelectedAppointment}
                  getStatusColor={getStatusColor}
                  getStatusText={getStatusText}
                  formatDate={formatDate}
                />
              ))}
            </div>
          </>
        )}

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
          />
        )}
      </div>
    </div>
  );
}
