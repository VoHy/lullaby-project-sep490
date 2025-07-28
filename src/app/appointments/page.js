"use client";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaCalendar, FaPlus } from 'react-icons/fa';
import authService from '@/services/auth/authService';
import bookingService from '@/services/api/bookingService';
import serviceTypeService from '@/services/api/serviceTypeService';
import nursingSpecialistService from '@/services/api/nursingSpecialistService';
import careProfileService from '@/services/api/careProfileService';
import customerTaskService from '@/services/api/customerTaskService';
import customerPackageService from '@/services/api/customerPackageService';
import invoiceService from '@/services/api/invoiceService';
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
  const [careProfiles, setCareProfiles] = useState([]);
  const [customerTasks, setCustomerTasks] = useState([]);
  const [customerPackages, setCustomerPackages] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const router = useRouter();

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/auth/login');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const user = authService.getCurrentUser();
        
        const [
          bookings, 
          services, 
          specialists, 
          careProfileData, 
          taskData,
          packageData,
          invoiceData
        ] = await Promise.all([
          bookingService.getBookingServices(),
          serviceTypeService.getServiceTypes(),
          nursingSpecialistService.getNursingSpecialists(),
          careProfileService.getCareProfiles(),
          customerTaskService.getCustomerTasks(),
          customerPackageService.getCustomerPackages(),
          invoiceService.getInvoices()
        ]);

        // Get user's care profiles
        const userCareProfiles = careProfileData.filter(cp => cp.AccountID === user.AccountID);
        const userCareProfileIds = userCareProfiles.map(cp => cp.CareProfileID);

        // Filter appointments for user's care profiles
        const userAppointments = bookings.filter(booking => 
          userCareProfileIds.includes(booking.CareProfileID)
        );
        
        setAppointments(userAppointments);
        setServiceTypes(services);
        setNursingSpecialists(specialists);
        setCareProfiles(careProfileData);
        setCustomerTasks(taskData);
        setCustomerPackages(packageData);
        setInvoices(invoiceData);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  // Filter appointments based on search and filters
  const filteredAppointments = filterAppointments(appointments, searchText, statusFilter, dateFilter);

  // Helper functions with data context
  const getServiceNamesWithContext = (serviceIds) => getServiceNames(serviceIds, serviceTypes);
  const getNurseNamesWithContext = (nurseIds) => getNurseNames(nurseIds, nursingSpecialists);

  // Get care profile name for display
  const getCareProfileName = (careProfileId) => {
    const careProfile = careProfiles.find(cp => cp.CareProfileID === careProfileId);
    return careProfile ? careProfile.ProfileName : 'Không xác định';
  };

  // Get detailed booking information
  const getBookingDetails = (bookingId) => {
    const tasks = customerTasks.filter(task => task.BookingID === bookingId);
    const packages = customerPackages.filter(pkg => pkg.BookingID === bookingId);
    
    return {
      tasks,
      packages,
      totalAmount: tasks.reduce((sum, task) => sum + task.Total, 0) + 
                   packages.reduce((sum, pkg) => sum + pkg.Total, 0)
    };
  };

  // Get services for a booking
  const getBookingServices = (bookingId) => {
    const tasks = customerTasks.filter(task => task.BookingID === bookingId);
    const services = tasks.map(task => {
      const service = serviceTypes.find(s => s.ServiceID === task.ServiceID);
      const nurse = nursingSpecialists.find(n => n.NursingID === task.NursingID);
      return {
        serviceName: service ? service.ServiceName : 'Không xác định',
        nurseName: nurse ? nurse.FullName : 'Chưa phân công',
        price: task.Total,
        status: task.Status
      };
    });
    return services;
  };

  // Get packages for a booking
  const getBookingPackages = (bookingId) => {
    const packages = customerPackages.filter(pkg => pkg.BookingID === bookingId);
    return packages.map(pkg => ({
      packageName: pkg.Name,
      description: pkg.Description,
      price: pkg.Total,
      status: pkg.Status
    }));
  };

  const handleNewAppointment = () => {
    router.push('/services');
  };

  if (loading) {
    return <LoadingSpinner />;
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
                key={appointment.BookingID}
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
          />
        )}
      </div>
    </div>
  );
} 