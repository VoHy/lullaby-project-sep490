import { useState, useEffect, useMemo } from 'react';
import customizePackageService from '@/services/api/customizePackageService';
import serviceTypeService from '@/services/api/serviceTypeService';
import accountService from '@/services/api/accountService';
import nursingSpecialistService from '@/services/api/nursingSpecialistService';
import bookingService from '@/services/api/bookingService';
import walletService from '@/services/api/walletService';
import serviceTaskService from '@/services/api/serviceTaskService';
import customizeTaskService from '@/services/api/customizeTaskService';
import careProfileService from '@/services/api/careProfileService';
import relativesService from '@/services/api/relativesService';
import { calculateCompletePayment } from '../../booking/utils/paymentCalculation';

export const usePaymentData = (bookingId, user) => {
  const [booking, setBooking] = useState(null);
  const [customizeTasks, setCustomizeTasks] = useState([]);
  const [packages, setPackages] = useState([]);

  const [serviceTypes, setServiceTypes] = useState([]);
  const [serviceTasks, setServiceTasks] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [nursingSpecialists, setNursingSpecialists] = useState([]);
  const [careProfiles, setCareProfiles] = useState([]);
  const [relatives, setRelatives] = useState([]);
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load data từ API
  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      let walletsData = [];
      try {
        walletsData = await walletService.getAllWallets();
      } catch (walletError) {
        console.error('Lỗi khi lấy ví:', walletError);
      }

      const [
        serviceTypesData,
        serviceTasksData,
        nursingSpecialistsData,
        accountsData
      ] = await Promise.all([
        serviceTypeService.getServiceTypes(),
        serviceTaskService.getServiceTasks(),
        nursingSpecialistService.getNursingSpecialists(),
        accountService.getAllAccounts()
      ]);

      setPackages([]);
      setServiceTypes(serviceTypesData);
      setServiceTasks(serviceTasksData);
      setNursingSpecialists(nursingSpecialistsData);
      setAccounts(Array.isArray(accountsData) ? accountsData : []);
      setCareProfiles([]);
      setWallets(walletsData);

      if (bookingId) {
        try {
          const bookingData = await bookingService.getBookingByIdWithCareProfile(parseInt(bookingId));

          if (bookingData && !bookingData.careProfile && bookingData.careProfileID) {
            try {
              const careProfileData = await careProfileService.getCareProfileById(bookingData.careProfileID);
              bookingData.careProfile = careProfileData;
            } catch (careProfileError) {
              console.warn('Could not fetch care profile:', careProfileError);
            }
          }

          setBooking(bookingData);

          // Load customize tasks
          try {
            const tasks = await customizeTaskService.getAllByBooking(parseInt(bookingId));

            const mapped = Array.isArray(tasks) ? tasks.map(t => ({
              customizeTaskID: t.customizeTaskID || t.CustomizeTaskID || t.id,
              customizePackageID: t.customizePackageID || t.CustomizePackageID,
              serviceID: t.serviceID || t.ServiceID || t.serviceTypeID,
              nursingID: t.nursingID || t.NursingID || null,
              relativeID: t.relativeID || t.RelativeID || null,
              taskOrder: t.taskOrder || t.TaskOrder,
              startTime: t.startTime || t.StartTime,
              endTime: t.endTime || t.EndTime,
              status: t.status || t.Status
            })) : [];

            setCustomizeTasks(mapped);
          } catch (taskErr) {
            console.error('Could not load customize tasks for booking', taskErr);
            setCustomizeTasks([]);
          }

          // Load relatives theo booking
          try {
            const relativesData = await relativesService.getAllByBooking(parseInt(bookingId));
            setRelatives(relativesData || []);
          } catch (relativesErr) {
            console.error('Could not load relatives for booking', relativesErr);
            setRelatives([]);
          }

          // Load customize packages
          try {
            const packagesData = await customizePackageService.getAllByBooking(bookingId);
            if (Array.isArray(packagesData)) {
              bookingData.customizePackages = packagesData;
            }
          } catch (packageErr) {
            console.error('Lỗi khi lấy danh sách dịch vụ đã đặt:', packageErr);
          }
        } catch (error) {
          console.error('Error fetching booking:', error);
          setError(`Không thể tải thông tin đặt lịch (ID: ${bookingId}). ${error.message || 'Vui lòng thử lại sau.'}`);
        }
      } else {
        setError('Không tìm thấy thông tin booking ID trong URL.');
      }
    } catch (error) {
      setError(`Không thể tải dữ liệu trang thanh toán: ${error.message || 'Vui lòng thử lại sau.'}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, bookingId]);

  // Tính toán dữ liệu từ booking
  const bookingData = useMemo(() => {
    if (!booking) return null;


    let selectedPackage = null;
    let selectedServices = [];
    let total = 0;
    let childServices = [];

    // Parse booking data theo cấu trúc thực tế từ API
    const bookingID = booking.bookingID || booking.booking_ID;
    const careProfileID = booking.careProfileID || booking.care_ProfileID;
    const workdate = booking.workdate || booking.work_date;
    const amount = booking.amount || booking.totalAmount || booking.total_Amount;
    const status = booking.status || booking.Status;
    const extra = booking.extra || booking.Extra;
    const isSchedule = booking.isSchedule || booking.is_schedule;
    const createdAt = booking.createdAt || booking.created_at;
    const updatedAt = booking.updatedAt || booking.updated_at;

    // Lấy thông tin từ customizePackageCreateDto (cho service booking)
    const customizePackageCreateDtos = booking.customizePackageCreateDtos || booking.customize_package_create_dtos || [];

    // Lấy thông tin từ customizePackageCreateDto (cho package booking)
    const customizePackageCreateDto = booking.customizePackageCreateDto || booking.customize_package_create_dto;

    let servicesForCalculation = [];

    if (customizePackageCreateDto) {
      // Package booking
      const serviceID = customizePackageCreateDto.serviceID || customizePackageCreateDto.service_ID;
      const quantity = customizePackageCreateDto.quantity || 1;

      selectedPackage = serviceTypes && serviceTypes.length > 0 ? serviceTypes.find(s =>
        s.serviceID === serviceID ||
        s.serviceTypeID === serviceID ||
        s.ServiceID === serviceID
      ) : null;

      if (selectedPackage) {
        servicesForCalculation = [selectedPackage];

        // Lấy dịch vụ con của package
        const tasks = serviceTasks.filter(t =>
          t.package_ServiceID === serviceID ||
          t.packageServiceID === serviceID ||
          t.Package_ServiceID === serviceID
        );
        childServices = tasks.map(t => {
          const childServiceId = t.child_ServiceID || t.childServiceID || t.Child_ServiceID;
          return serviceTypes && serviceTypes.length > 0 ? serviceTypes.find(s =>
            s.serviceID === childServiceId ||
            s.serviceTypeID === childServiceId ||
            s.ServiceID === childServiceId
          ) : null;
        }).filter(Boolean);
      }
    } else if (customizePackageCreateDtos && customizePackageCreateDtos.length > 0) {
      // Service booking - multiple services
      selectedServices = customizePackageCreateDtos.map(dto => {
        const serviceID = dto.serviceID || dto.service_ID;
        const quantity = dto.quantity || 1;

        const serviceType = serviceTypes && serviceTypes.length > 0 ? serviceTypes.find(s =>
          s.serviceID === serviceID ||
          s.serviceTypeID === serviceID ||
          s.ServiceID === serviceID
        ) : null;

        return {
          ...serviceType,
          quantity: quantity
        };
      }).filter(Boolean);

      servicesForCalculation = selectedServices;
    }

    // Calculate payment: booking.amount already includes discounts, only apply extra fees
    const paymentCalculation = calculateCompletePayment(servicesForCalculation, amount, extra);
    total = paymentCalculation.finalTotal;

    const selectedCareProfile = (() => {
      if (!booking || !booking.careProfile) return null;

      const careProfile = booking.careProfile;
      return {
        careProfileID: careProfile.careProfileID,
        profileName: careProfile.profileName || 'Người được chăm sóc',
        dateOfBirth: careProfile.dateOfBirth,
        phoneNumber: careProfile.phoneNumber,
        address: careProfile.address,
        status: careProfile.status || 'active',
        note: careProfile.note
      };
    })();

    const result = {
      selectedPackage,
      selectedServices,
      total,
      childServices,
      selectedCareProfile,
      datetime: workdate,
      note: extra,
      status,
      bookingID,
      paymentCalculation
    };

    return result;
  }, [booking, serviceTypes, serviceTasks, careProfiles]);

  const result = {
    booking: {
      ...booking,
      serviceTypes,
      serviceTasks,
      nursingSpecialists,
      accounts,
      customizeTasks,
      customizePackages: booking?.customizePackages || [],
      relatives
    },
    bookingData,
    loading,
    error,
    refreshData: fetchData,
    relatives,
    serviceTypes,
    serviceTasks
  };
  return result;
};
