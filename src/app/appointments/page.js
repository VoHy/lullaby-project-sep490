"use client";
import React, { useEffect, useState, useContext, useMemo, useCallback } from "react";
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaPlus, FaSync } from 'react-icons/fa';
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
import SearchFilter from './components/SearchFilter';
import {
  STATUS_MAP,
  getStatusColor,
  getStatusText,
  formatDate,
  normalizeStatus,
  filterAppointments,
  normalizeCareProfile,
  normalizeCustomizeTask
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
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const router = useRouter();
  const { user } = useContext(AuthContext);
  const { refreshWalletData } = useWalletContext();

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

      const currentAccountId = user.accountID || user.AccountID;
      const myCareProfiles = careProfiles.filter(cp =>
        (cp.accountID ?? cp.AccountID) === currentAccountId
      );

      const myCareProfileIds = new Set(myCareProfiles.map(cp => cp.careProfileID ?? cp.CareProfileID));
      const careProfileMap = new Map(careProfiles.map(cp => [cp.careProfileID ?? cp.CareProfileID, normalizeCareProfile(cp)]));

      const invoiceByBooking = new Map(invoiceData.map(inv => [
        inv.bookingID ?? inv.BookingID, String(inv.status ?? inv.Status).toLowerCase()
      ]));

      const userAppointments = bookings
        .filter(b => myCareProfileIds.has(b.careProfileID ?? b.CareProfileID))
        .map(b => ({
          ...b,
          careProfile: b.careProfile ?? careProfileMap.get(b.careProfileID ?? b.CareProfileID) ?? null,
          status: invoiceByBooking.get(b.bookingID ?? b.BookingID) === 'paid' ? 'paid' : b.status
        }));

      setAppointments(userAppointments);
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
  }, [user, router]);

  useEffect(() => { if (user) fetchData(); }, [fetchData, user]);

  const filteredAppointments = useMemo(() => {
    const filtered = filterAppointments(appointments, searchText, statusFilter, dateFilter);
    return filtered.sort((a, b) =>
      (STATUS_MAP[normalizeStatus(a)]?.sortOrder || 99) -
      (STATUS_MAP[normalizeStatus(b)]?.sortOrder || 99)
    );
  }, [appointments, searchText, statusFilter, dateFilter]);

  const totalPages = Math.ceil(filteredAppointments.length / pageSize);
  const paginatedAppointments = filteredAppointments.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  if (loading) return <LoadingSpinner message="Đang tải lịch hẹn..." fullScreen />;
  if (error) return <div>{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <motion.div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">Lịch hẹn của bạn</h1>
          <button onClick={() => fetchData(true)} disabled={refreshing}><FaSync /></button>
        </motion.div>

        <SearchFilter {...{ searchText, setSearchText, statusFilter, setStatusFilter, dateFilter, setDateFilter }} />

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
            {totalPages > 1 && (
              <div>
                <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}>Trang trước</button>
                <span>Trang {currentPage}/{totalPages}</span>
                <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages}>Trang sau</button>
              </div>
            )}
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
