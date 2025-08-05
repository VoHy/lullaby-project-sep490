"use client";
import { useEffect, useState, useContext, useMemo, useCallback } from "react";
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaCalendar, FaPlus, FaSync } from 'react-icons/fa';
import { AuthContext } from '@/context/AuthContext';
import bookingService from '@/services/api/bookingService';
import serviceTypeService from '@/services/api/serviceTypeService';
import nursingSpecialistService from '@/services/api/nursingSpecialistService';
// import customizeTaskService from '@/services/api/customizeTaskService';
import customizePackageService from '@/services/api/customizePackageService';
import invoiceService from '@/services/api/invoiceService';
import transactionHistoryService from '@/services/api/transactionHistoryService';
import {
  AppointmentCard,
  AppointmentDetailModal,
  SearchFilter,
  EmptyState,
  LoadingSpinner
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
      
      console.log('🔄 Fetching appointments data...');
      
      const [
        bookings, 
        services, 
        specialists, 
        // taskData,
        // packageData,
        invoiceData,
        transactionData
      ] = await Promise.all([
        bookingService.getAllBookingsWithCareProfile(),
        serviceTypeService.getServiceTypes(),
        nursingSpecialistService.getNursingSpecialists(),
        // customizeTaskService.getCustomizeTasks(),
        // customizePackageService.getAllByBooking(), // Comment out tạm thời vì có lỗi
        invoiceService.getInvoices(),
        transactionHistoryService.getAllTransactionHistoriesByAccount(user.accountID)
      ]);

      console.log('✅ Data fetched successfully');

      // Get user's care profiles từ booking data (optimized)
      const userCareProfiles = bookings
        .map(booking => booking.careProfile)
        .filter(cp => cp && cp.accountID === user.accountID);
      const userCareProfileIds = new Set(userCareProfiles.map(cp => cp.careProfileID));

      // Filter appointments for user's care profiles (optimized with Set)
      const userAppointments = bookings.filter(booking => 
        userCareProfileIds.has(booking.careProfileID)
      );
      
      setAppointments(userAppointments);
      setServiceTypes(services);
      setNursingSpecialists(specialists);
      // setCustomizeTasks(taskData); // Tạm thời bỏ qua vì service chưa hoàn thiện
      // setCustomizePackages(packageData); // Comment out tạm thời vì có lỗi
      setInvoices(invoiceData);
      setTransactionHistories(transactionData);

      // Cache data in localStorage for faster subsequent loads
      if (!isRefresh) {
        const cacheData = {
          appointments: userAppointments,
          serviceTypes: services,
          nursingSpecialists: specialists,
          // customizeTasks: taskData,
          // customizePackages: packageData, // Comment out tạm thời vì có lỗi
          invoices: invoiceData,
          transactionHistories: transactionData,
          timestamp: Date.now()
        };
        localStorage.setItem('appointmentsCache', JSON.stringify(cacheData));
      }
    } catch (error) {
      console.error('❌ Error fetching appointments:', error);
      setError('Không thể tải dữ liệu. Vui lòng thử lại.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user, router]);

  // Load cached data first, then fetch fresh data
  useEffect(() => {
    if (!user) return;

    // Try to load from cache first
    const cachedData = localStorage.getItem('appointmentsCache');
    if (cachedData) {
      try {
        const parsed = JSON.parse(cachedData);
        const cacheAge = Date.now() - parsed.timestamp;
        const cacheValid = cacheAge < 5 * 60 * 1000; // 5 minutes

        if (cacheValid) {
          console.log('📦 Loading from cache...');
          setAppointments(parsed.appointments);
          setServiceTypes(parsed.serviceTypes);
          setNursingSpecialists(parsed.nursingSpecialists);
          // setCustomizeTasks(parsed.customizeTasks);
          // setCustomizePackages(parsed.customizePackages); // Comment out tạm thời vì có lỗi
          setInvoices(parsed.invoices);
          setTransactionHistories(parsed.transactionHistories);
          setLoading(false);
        }
      } catch (error) {
        console.error('❌ Error loading cache:', error);
      }
    }

    // Always fetch fresh data
    fetchData();
  }, [fetchData]);

  // Optimized memoized functions for better performance
  const filteredAppointments = useMemo(() => 
    filterAppointments(appointments, searchText, statusFilter, dateFilter),
    [appointments, searchText, statusFilter, dateFilter]
  );

  // Memoized helper functions
  const getServiceNamesWithContext = useCallback((serviceIds) => 
    getServiceNames(serviceIds, serviceTypes), [serviceTypes]);

  const getNurseNamesWithContext = useCallback((nurseIds) => 
    getNurseNames(nurseIds, nursingSpecialists), [nursingSpecialists]);

  // Optimized care profile name lookup with Map
  const careProfileMap = useMemo(() => {
    const map = new Map();
    appointments.forEach(booking => {
      if (booking.careProfile) {
        map.set(booking.careProfileID, booking.careProfile.profileName);
      }
    });
    return map;
  }, [appointments]);

  const getCareProfileName = useCallback((careProfileId) => {
    return careProfileMap.get(careProfileId) || 'Không xác định';
  }, [careProfileMap]);

  // Optimized booking details with memoization
  const bookingDetailsMap = useMemo(() => {
    const map = new Map();
    appointments.forEach(booking => {
      // Tạm thời bỏ qua tasks vì customizeTaskService chưa hoàn thiện
      const tasks = []; // customizeTasks.filter(task => task.BookingID === booking.BookingID);
      // Tạm thời bỏ qua packages vì có lỗi API
      const packages = []; // customizePackages.filter(pkg => pkg.BookingID === booking.BookingID);
      
      map.set(booking.BookingID, {
        tasks,
        packages,
        totalAmount: tasks.reduce((sum, task) => sum + task.Total, 0) + 
                     packages.reduce((sum, pkg) => sum + pkg.Total, 0)
      });
    });
    return map;
  }, [appointments]);

  const getBookingDetails = useCallback((bookingId) => {
    return bookingDetailsMap.get(bookingId) || { tasks: [], packages: [], totalAmount: 0 };
  }, [bookingDetailsMap]);

  // Optimized services lookup with memoization
  const bookingServicesMap = useMemo(() => {
    const map = new Map();
    // Tạm thời bỏ qua customizeTasks vì service chưa hoàn thiện
    // const serviceMap = new Map(serviceTypes.map(s => [s.ServiceID, s.ServiceName]));
    // const nurseMap = new Map(nursingSpecialists.map(n => [n.NursingID, n.FullName]));
    
    // customizeTasks.forEach(task => {
    //   if (!map.has(task.BookingID)) {
    //     map.set(task.BookingID, []);
    //   }
    //   map.get(task.BookingID).push({
    //     serviceName: serviceMap.get(task.ServiceID) || 'Không xác định',
    //     nurseName: nurseMap.get(task.NursingID) || 'Chưa phân công',
    //     price: task.Total,
    //     status: task.Status
    //   });
    // });
    return map;
  }, []);

  const getBookingServices = useCallback((bookingId) => {
    // Tạm thời trả về empty array vì customizeTaskService chưa hoàn thiện
    return [];
  }, []);

  // Optimized packages lookup with memoization
  const bookingPackagesMap = useMemo(() => {
    const map = new Map();
    // Tạm thời bỏ qua packages vì có lỗi API
    // customizePackages.forEach(pkg => {
    //   if (!map.has(pkg.BookingID)) {
    //     map.set(pkg.BookingID, []);
    //   }
    //   map.get(pkg.BookingID).push({
    //     packageName: pkg.Name,
    //     description: pkg.Description,
    //     price: pkg.Total,
    //     status: pkg.Status
    //   });
    // });
    return map;
  }, []);

  const getBookingPackages = useCallback((bookingId) => {
    return bookingPackagesMap.get(bookingId) || [];
  }, [bookingPackagesMap]);

  // Get invoice for a booking
  const getBookingInvoice = useCallback((bookingId) => {
    const bookingInvoices = invoices.filter(inv => inv.bookingID === bookingId);
    return bookingInvoices;
  }, [invoices]);

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
                key={appointment.bookingID}
                appointment={appointment}
                index={idx}
                serviceTypes={serviceTypes}
                nursingSpecialists={nursingSpecialists}
                onSelect={setSelectedAppointment}
                getServiceNames={getServiceNamesWithContext}
                getNurseNames={getNurseNamesWithContext}
                getStatusColor={getStatusColor}
                getStatusText={getStatusText}
                formatDate={formatDate}
                getCareProfileName={getCareProfileName}
                getBookingServices={getBookingServices}
                getBookingPackages={getBookingPackages}
                getBookingDetails={getBookingDetails}
                getBookingInvoice={getBookingInvoice}
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
            getServiceNames={getServiceNamesWithContext}
            getNurseNames={getNurseNamesWithContext}
            getStatusColor={getStatusColor}
            getStatusText={getStatusText}
            formatDate={formatDate}
            getCareProfileName={getCareProfileName}
            getBookingServices={getBookingServices}
            getBookingPackages={getBookingPackages}
            getBookingDetails={getBookingDetails}
            getBookingInvoice={getBookingInvoice}
          />
        )}
      </div>
    </div>
  );
} 