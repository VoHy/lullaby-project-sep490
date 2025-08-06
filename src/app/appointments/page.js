"use client";
import { useEffect, useState, useContext, useMemo, useCallback } from "react";
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaCalendar, FaPlus, FaSync } from 'react-icons/fa';
import { AuthContext } from '@/context/AuthContext';
import bookingService from '@/services/api/bookingService';
import serviceTypeService from '@/services/api/serviceTypeService';
import nursingSpecialistService from '@/services/api/nursingSpecialistService';
import customizePackageService from '@/services/api/customizePackageService';
import customizeTaskService from '@/services/api/customizeTaskService';
import invoiceService from '@/services/api/invoiceService';
import transactionHistoryService from '@/services/api/transactionHistoryService';
import {
  AppointmentCard,
  AppointmentDetailModal,
  SearchFilter,
  EmptyState,
  LoadingSpinner,
  NurseSelectionModal
} from './components';
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
  const [nursingSpecialists, setNursingSpecialists] = useState([]);
  const [customizeTasks, setCustomizeTasks] = useState([]);
  const [customizePackages, setCustomizePackages] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [transactionHistories, setTransactionHistories] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  
  // Nurse selection modal state
  const [showNurseModal, setShowNurseModal] = useState(false);
  const [selectedTaskForNursing, setSelectedTaskForNursing] = useState(null);
  
  const router = useRouter();
  const { user } = useContext(AuthContext);

  // Optimized data fetching with caching
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
      
      console.log('🔄 ===== FETCHING APPOINTMENTS DATA =====');
      
      // Fetch data step by step để debug
      console.log('📋 Fetching bookings...');
      const bookings = await bookingService.getAllBookingsWithCareProfile();
      console.log('📋 Bookings result:', bookings);
      
      console.log('🔧 Fetching services...');
      const services = await serviceTypeService.getServiceTypes();
      console.log('🔧 Services result:', services);
      
      console.log('👩‍⚕️ Fetching specialists...');
      const specialists = await nursingSpecialistService.getNursingSpecialists();
      console.log('👩‍⚕️ Specialists result:', specialists);
      
      console.log('📦 Fetching packages...');
      const packageData = await customizePackageService.getAllCustomizePackages();
      console.log('📦 Packages result:', packageData);
      
      console.log('📋 Fetching customize tasks...');
      const allCustomizeTasks = await customizeTaskService.getAllCustomizeTasks();
      console.log('📋 Customize tasks result:', allCustomizeTasks);
      
      console.log('💰 Fetching invoices...');
      const invoiceData = await invoiceService.getInvoices();
      console.log('💰 Invoices result:', invoiceData);
      
      console.log('💳 Fetching transactions...');
      const transactionData = await transactionHistoryService.getAllTransactionHistoriesByAccount(user.accountID);
      console.log('💳 Transactions result:', transactionData);

      // Get user's care profiles từ booking data
      const userCareProfiles = bookings
        .map(booking => booking.careProfile)
        .filter(cp => cp && (cp.accountID === user.accountID || cp.AccountID === user.accountID));
      
      console.log('👤 User care profiles:', userCareProfiles);
      
      const userCareProfileIds = new Set(userCareProfiles.map(cp => cp.careProfileID || cp.CareProfileID));

      // Filter appointments for user's care profiles
      const userAppointments = bookings.filter(booking => 
        userCareProfileIds.has(booking.careProfileID || booking.CareProfileID)
      );
      
      console.log('📅 User appointments filtered:', userAppointments);
      
      setAppointments(userAppointments);
      setServiceTypes(services);
      setNursingSpecialists(specialists);
      setCustomizePackages(packageData);
      setInvoices(invoiceData);
      setTransactionHistories(transactionData);
      setCustomizeTasks(allCustomizeTasks);
    
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
  const filteredAppointments = useMemo(() => 
    filterAppointments(appointments, searchText, statusFilter, dateFilter),
    [appointments, searchText, statusFilter, dateFilter]
  );

  // Optimized care profile name lookup with Map
  const careProfileMap = useMemo(() => {
    const map = new Map();
    appointments.forEach(booking => {
      if (booking.careProfile) {
        const careProfileId = booking.careProfileID || booking.CareProfileID;
        const profileName = booking.careProfile.profileName || 
                           booking.careProfile.ProfileName || 
                           booking.careProfile.name ||
                           booking.careProfile.Name ||
                           'Không xác định';
        map.set(careProfileId, profileName);
      }
    });
    console.log('🗺️ Care profile map:', map);
    return map;
  }, [appointments]);

  const getCareProfileName = useCallback((careProfileId) => {
    return careProfileMap.get(careProfileId) || 'Không xác định';
  }, [careProfileMap]);

  // 🗺️ CustomizeTasksMap
  const customizeTasksMap = useMemo(() => {
    const map = new Map();
    console.log('🗺️ Processing customize tasks for mapping:', customizeTasks);
    
    customizeTasks.forEach(task => {
      const bookingId = task.bookingID || task.BookingID;
      if (!bookingId) {
        console.warn('⚠️ Task without bookingID:', task);
        return;
      }
      
      if (!map.has(bookingId)) {
        map.set(bookingId, []);
      }
      
      // Tìm nursing specialist name
      let nursingName = 'Chưa phân công';
      let isAssigned = false;
      const nursingId = task.nursingID || task.NursingID;
      
      if (nursingId && nursingId !== null) {
        isAssigned = true;
        if (nursingSpecialists.length > 0) {
          const nursing = nursingSpecialists.find(n => 
            (n.nursingID || n.NursingID) == nursingId
          );
          if (nursing) {
            nursingName = nursing.name || nursing.Name || nursing.fullName || nursing.FullName || `Nursing #${nursingId}`;
          } else {
            nursingName = `Nursing #${nursingId}`;
          }
        } else {
          nursingName = `Nursing #${nursingId}`;
        }
      }
      
      // Tìm service name
      let serviceName = 'Nhiệm vụ chăm sóc';
      const serviceId = task.serviceID || task.ServiceID;
      if (serviceId && serviceTypes.length > 0) {
        const service = serviceTypes.find(s => 
          (s.serviceID || s.ServiceID) == serviceId
        );
        if (service) {
          serviceName = service.serviceName || service.ServiceName || serviceName;
        }
      }
      
      map.get(bookingId).push({
        taskId: task.customizeTaskID || task.CustomizeTaskID,
        packageId: task.customizePackageID || task.CustomizePackageID,
        serviceId: serviceId,
        serviceName: serviceName,
        nursingId: nursingId,
        nursingName: nursingName,
        status: task.status || task.Status || 'pending',
        taskOrder: task.taskOrder || task.TaskOrder || 1,
        isAssigned: isAssigned,
        createdAt: task.createdAt || task.CreatedAt,
        updatedAt: task.updatedAt || task.UpdatedAt
      });
    });
    
    // Sort tasks by taskOrder
    map.forEach((tasks, bookingId) => {
      tasks.sort((a, b) => (a.taskOrder || 0) - (b.taskOrder || 0));
    });
    
    console.log('🗺️ Final customize tasks map:', map);
    return map;
  }, [customizeTasks, nursingSpecialists, serviceTypes]);

  // Optimized packages lookup with memoization
  const bookingPackagesMap = useMemo(() => {
    const map = new Map();
    console.log('📦 Processing customize packages:', customizePackages);
    
    customizePackages.forEach(pkg => {
      const bookingId = pkg.bookingID || pkg.BookingID;
      if (!bookingId) return;
      
      if (!map.has(bookingId)) {
        map.set(bookingId, []);
      }
      
      // Tìm service name dựa trên serviceID
      let serviceName = pkg.serviceName || pkg.ServiceName || 'Gói dịch vụ';
      let serviceDescription = pkg.description || pkg.Description || '';
      
      const serviceID = pkg.serviceID || pkg.ServiceID;
      if (serviceID && serviceTypes.length > 0) {
        const serviceType = serviceTypes.find(st => 
          (st.serviceID || st.ServiceID) == serviceID
        );
        if (serviceType) {
          serviceName = serviceType.serviceName || serviceType.ServiceName || serviceName;
          serviceDescription = serviceType.description || serviceType.Description || serviceDescription;
        }
      }
      
      map.get(bookingId).push({
        packageName: pkg.name || pkg.Name || serviceName,
        description: serviceDescription,
        price: pkg.total || pkg.Total || pkg.price || pkg.Price || 0,
        status: pkg.status || pkg.Status || 'pending',
        serviceID: serviceID,
        serviceName: serviceName,
        serviceDescription: serviceDescription
      });
    });
    
    console.log('📦 Booking packages map:', map);
    return map;
  }, [customizePackages, serviceTypes]);

  const getBookingPackages = useCallback((bookingId) => {
    return bookingPackagesMap.get(bookingId) || [];
  }, [bookingPackagesMap]);

  // Get tasks for a booking
  const getBookingTasks = useCallback((bookingId) => {
    return customizeTasksMap.get(bookingId) || [];
  }, [customizeTasksMap]);

  // Get services for backward compatibility
  const getBookingServices = useCallback((bookingId) => {
    const tasks = customizeTasksMap.get(bookingId) || [];
    return tasks.map(task => ({
      serviceID: task.serviceId,
      serviceName: task.serviceName,
      nurseName: task.nursingName,
      price: 0, // Tasks don't have individual prices
      status: task.status
    }));
  }, [customizeTasksMap]);

  // Get booking details
  const getBookingDetails = useCallback((bookingId) => {
    const tasks = customizeTasksMap.get(bookingId) || [];
    const packages = bookingPackagesMap.get(bookingId) || [];
    return {
      tasks,
      packages,
      totalAmount: packages.reduce((sum, pkg) => sum + (pkg.price || 0), 0)
    };
  }, [customizeTasksMap, bookingPackagesMap]);

  // Get invoice for a booking
  const getBookingInvoice = useCallback((bookingId) => {
    const bookingInvoices = invoices.filter(inv => 
      (inv.bookingID || inv.booking_ID) == bookingId
    );
    return bookingInvoices;
  }, [invoices]);

  // Handle assign nursing to customize task
  const handleAssignNursing = async (task) => {
    console.log('🎯 Opening nurse selection for task:', task);
    setSelectedTaskForNursing(task);
    setShowNurseModal(true);
  };

  const handleNurseAssignment = async (taskId, nursingId) => {
    try {
      console.log('✅ Assigning nursing:', { taskId, nursingId });
      await customizeTaskService.updateTaskNursing(taskId, nursingId);
      
      // Refresh data to show updated assignment
      await fetchData(true);
      
      // Close modal
      setShowNurseModal(false);
      setSelectedTaskForNursing(null);
      
      alert('Đã phân công nurse thành công!');
    } catch (error) {
      console.error('❌ Error assigning nursing:', error);
      alert('Có lỗi xảy ra khi phân công nurse. Vui lòng thử lại.');
    }
  };

  const handleUpdateTaskStatus = async (task) => {
    try {
      console.log('📝 Updating task status:', task);
      const newStatus = prompt('Nhập trạng thái mới (pending/in-progress/completed):', task.status);
      if (newStatus && ['pending', 'in-progress', 'completed'].includes(newStatus)) {
        await customizeTaskService.updateTaskStatus(task.packageId, { status: newStatus });
        await fetchData(true);
        alert('Cập nhật trạng thái thành công!');
      }
    } catch (error) {
      console.error('❌ Error updating task status:', error);
      alert('Không thể cập nhật trạng thái. Vui lòng thử lại.');
    }
  };

  const handleNewAppointment = () => {
    router.push('/services');
  };

  const handleRefresh = () => {
    fetchData(true);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Lỗi tải dữ liệu</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleRefresh}
            className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <FaCalendar className="text-4xl text-purple-600" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
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
        {filteredAppointments.length === 0 ? (
          <EmptyState onNewAppointment={handleNewAppointment} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredAppointments.map((appointment, idx) => (
              <AppointmentCard
                key={appointment.bookingID || appointment.BookingID}
                appointment={appointment}
                index={idx}
                serviceTypes={serviceTypes}
                nursingSpecialists={nursingSpecialists}
                customizeTasks={getBookingTasks(appointment.bookingID || appointment.BookingID)}
                onSelect={setSelectedAppointment}
                onAssignNursing={handleAssignNursing}
                getServiceNames={getServiceNames}
                getNurseNames={getNurseNames}
                getStatusColor={getStatusColor}
                getStatusText={getStatusText}
                formatDate={formatDate}
                getCareProfileName={getCareProfileName}
                getBookingServices={getBookingServices}
                getBookingPackages={getBookingPackages}
                getBookingDetails={getBookingDetails}
                getBookingPaymentHistory={getBookingInvoice}
              />
            ))}
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
            nursingSpecialists={nursingSpecialists}
            customizeTasks={getBookingTasks(selectedAppointment.bookingID || selectedAppointment.BookingID)} // 📋 Thêm dòng này
            getServiceNames={getServiceNames}
            getNurseNames={getNurseNames}
            getStatusColor={getStatusColor}
            getStatusText={getStatusText}
            formatDate={formatDate}
            getCareProfileName={getCareProfileName}
            getBookingServices={getBookingServices}
            getBookingPackages={getBookingPackages}
            getBookingDetails={getBookingDetails}
            getBookingInvoice={getBookingInvoice}
            onAssignNursing={handleNurseAssignment}
            onUpdateTaskStatus={handleUpdateTaskStatus} 
          />
        )}

        {/* Nurse Selection Modal */}
        <NurseSelectionModal
          isOpen={showNurseModal}
          onClose={() => {
            setShowNurseModal(false);
            setSelectedTaskForNursing(null);
          }}
          onAssign={handleNurseAssignment}
          nursingSpecialists={nursingSpecialists}
          customizeTaskId={selectedTaskForNursing?.taskId}
        />
      </div>
    </div>
  );
}