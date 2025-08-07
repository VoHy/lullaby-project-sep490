"use client";
import React, { useEffect, useState, useContext, useMemo, useCallback } from "react";
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaCalendar, FaPlus, FaSync } from 'react-icons/fa';
import { AuthContext } from '@/context/AuthContext';
import bookingService from '@/services/api/bookingService';
import serviceTypeService from '@/services/api/serviceTypeService';
import nursingSpecialistService from '@/services/api/nursingSpecialistService';
import serviceTaskService from '@/services/api/serviceTaskService';
import invoiceService from '@/services/api/invoiceService';
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

  const router = useRouter();
  const { user } = useContext(AuthContext);

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

      // Fetch data với thông tin đầy đủ
      const bookings = await bookingService.getAllBookingsWithCareProfile();

      const services = await serviceTypeService.getServiceTypes();

      const tasks = await serviceTaskService.getServiceTasks();

      const specialists = await nursingSpecialistService.getAllNursingSpecialists();

      const zones = await zoneDetailService.getZoneDetails();

      const invoiceData = await invoiceService.getAllInvoices();

      const packages = await customizePackageService.getCustomizePackages();

      const customizeTasks = await customizeTaskService.getAllCustomizeTasks();

      // Get user's care profiles từ booking data
      const userCareProfiles = bookings
        .map(booking => booking.careProfile)
        .filter(cp => cp && (cp.accountID === user.accountID || cp.AccountID === user.accountID));

      const userCareProfileIds = new Set(userCareProfiles.map(cp => cp.careProfileID || cp.CareProfileID));

      // Filter appointments for user's care profiles
      const userAppointments = bookings.filter(booking =>
        userCareProfileIds.has(booking.careProfileID || booking.CareProfileID)
      );


      // Set all data
      setAppointments(userAppointments);
      setServiceTypes(services);
      setServiceTasks(tasks);
      setNursingSpecialists(specialists);
      setZoneDetails(zones);
      setInvoices(invoiceData);
      setCustomizePackages(packages);
      setCustomizeTasks(customizeTasks);

    } catch (error) {
      console.error('❌ Error fetching appointments:', error);
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
  const filteredAppointments = useMemo(() => {
    if (!Array.isArray(appointments)) return [];
    return filterAppointments(appointments, searchText, statusFilter, dateFilter);
  }, [appointments, searchText, statusFilter, dateFilter]);

  // Handle actions
  const handleRefresh = () => {
    fetchData(true);
  };

  const handleNewAppointment = () => {
    router.push('/booking');
  };

  // Handle nurse assignment
  const handleNurseAssignment = async (service, nurseId) => {
    try {
      console.log('🔄 Assigning nurse...', { service, nurseId });
      
      // Get booking ID
      const bookingId = selectedAppointment?.bookingID || selectedAppointment?.BookingID;
      if (!bookingId) {
        throw new Error('Không tìm thấy booking ID');
      }

      // Case 1: If service has customizeTaskId, update that task directly
      if (service.customizeTaskId) {
        console.log('Updating customize task:', service.customizeTaskId);
        
        const { customizeTaskService } = await import('@/services/api');
        await customizeTaskService.updateTaskNursing(service.customizeTaskId, nurseId);
      }
      // Case 2: Package service with taskId (từ service task)
      else if (service.taskId) {
        // Directly use the taskId from service task
        const customizeTaskId = service.taskId;
        console.log('Updating package service task:', customizeTaskId);
        
        const { customizeTaskService } = await import('@/services/api');
        await customizeTaskService.updateTaskNursing(customizeTaskId, nurseId);
      } 
      // Case 3: Individual service - need to find corresponding CustomizeTask
      else {
        console.log('Finding CustomizeTask for individual service...');
        
        // Import customize services
        const { customizeTaskService, customizePackageService } = await import('@/services/api');
        
        // Get all customize packages for this booking
        const customizePackages = await customizePackageService.getAllByBooking(bookingId);
        console.log('Customize packages:', customizePackages);
        
        // Find the customize package that matches the service
        const serviceId = service.serviceID || service.serviceTypeID || service.ServiceID;
        const matchingPackage = customizePackages.find(pkg => 
          (pkg.serviceID === serviceId) || 
          (pkg.service_ID === serviceId) || 
          (pkg.Service_ID === serviceId)
        );
        
        if (!matchingPackage) {
          throw new Error('Không tìm thấy customize package tương ứng');
        }
        
        // Get all customize tasks for this package
        const customizePackageId = matchingPackage.customizePackageID || matchingPackage.customize_PackageID;
        const customizeTasks = await customizeTaskService.getTasksByPackage(customizePackageId);
        console.log('Customize tasks:', customizeTasks);
        
        if (customizeTasks.length === 0) {
          throw new Error('Không tìm thấy customize task nào');
        }
        
        // For individual service, update the first available task
        // You might want to add more logic here to select the right task
        const taskToUpdate = customizeTasks[0];
        const customizeTaskId = taskToUpdate.customizeTaskID || taskToUpdate.customize_TaskID;
        
        console.log('Updating individual service task:', customizeTaskId);
        await customizeTaskService.updateTaskNursing(customizeTaskId, nurseId);
      }

      // Success notification
      alert('Đã phân công nurse thành công!');

      // Refresh data to show updated assignment
      await fetchData(true);
    } catch (error) {
      console.error(' Error assigning nurse:', error);
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredAppointments.map((appointment, idx) => {
              if (!appointment) return null;

              const bookingKey = appointment.bookingID || appointment.BookingID || `appointment-${idx}`;

              return (
                <AppointmentCard
                  key={bookingKey}
                  appointment={appointment}
                  index={idx}
                  serviceTypes={serviceTypes || []}
                  onSelect={setSelectedAppointment}
                  getStatusColor={getStatusColor}
                  getStatusText={getStatusText}
                  formatDate={formatDate}
                />
              );
            })}
          </div>
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
          />
        )}
      </div>
    </div>
  );
}
