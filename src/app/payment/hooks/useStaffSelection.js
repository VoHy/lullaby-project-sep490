import { useState, useEffect, useMemo } from 'react';
import customizeTaskService from '@/services/api/customizeTaskService';
import workScheduleService from '@/services/api/workScheduleService';

export const useStaffSelection = (booking, bookingData, customizeTasks = []) => {
  const [selectionMode, setSelectionMode] = useState('auto'); // 'user' | 'auto'
  const [selectedStaffByTask, setSelectedStaffByTask] = useState({}); // { [customizeTaskId]: nursingId }
  const [canConfirm, setCanConfirm] = useState(true);
  const [assignError, setAssignError] = useState("");

  // Danh sách customizeTasks của booking (sử dụng dữ liệu từ usePaymentData)
  const bookingCustomizeTasks = useMemo(() => {
    return Array.isArray(customizeTasks) ? customizeTasks : [];
  }, [customizeTasks]);

  // Initialize selected staff from existing assignments
  useEffect(() => {
    if (booking?.customizeTasks) {
      const existingAssignments = booking.customizeTasks
        .filter(task => task.nursingID)
        .reduce((acc, task) => {
          acc[task.customizeTaskID] = String(task.nursingID);
          return acc;
        }, {});
      
      if (Object.keys(existingAssignments).length > 0) {
        setSelectedStaffByTask(existingAssignments);
      }
    }
  }, [booking?.customizeTasks]);

  // Compute canConfirm when user selection required
  useEffect(() => {
    if (selectionMode !== 'user') {
      setCanConfirm(true);
      return;
    }
    
    const tasks = (bookingCustomizeTasks || [])
      .map(t => t.customizeTaskID)
      .filter(Boolean);
    
    const unique = Array.from(new Set(tasks));
    if (unique.length === 0) {
      setCanConfirm(false);
      return;
    }
    
    const allSelected = unique.every(tid => !!selectedStaffByTask[tid]);
    
    // Không cho phép thanh toán nếu có lỗi trùng nurse
    if (assignError && assignError.includes('Trùng điều dưỡng')) {
      setCanConfirm(false);
      return;
    }
    
    setCanConfirm(allSelected);
  }, [selectionMode, bookingCustomizeTasks, selectedStaffByTask, assignError]);

  // Hàm kiểm tra và hiển thị alert cho trùng giờ
  const checkAndAlertTimeConflict = (staffSelections) => {
    if (!staffSelections || Object.keys(staffSelections).length === 0) return false;

    // Tạo map thời gian cho các task
    const taskTimes = {};
    bookingCustomizeTasks.forEach(task => {
      if (task.startTime && task.endTime) {
        taskTimes[task.customizeTaskID] = {
          start: new Date(task.startTime),
          end: new Date(task.endTime),
          task: task
        };
      }
    });

    // Kiểm tra từng cặp task xem có trùng thời gian không
    const taskIds = Object.keys(staffSelections).filter(id => staffSelections[id]);
    
    for (let i = 0; i < taskIds.length; i++) {
      for (let j = i + 1; j < taskIds.length; j++) {
        const taskId1 = taskIds[i];
        const taskId2 = taskIds[j];
        const nurseId1 = staffSelections[taskId1];
        const nurseId2 = staffSelections[taskId2];
        
        // Nếu cùng nurse và có thông tin thời gian
        if (nurseId1 === nurseId2 && taskTimes[taskId1] && taskTimes[taskId2]) {
          const time1 = taskTimes[taskId1];
          const time2 = taskTimes[taskId2];
          
          // Kiểm tra trùng thời gian
          const isTimeOverlap = time1.start < time2.end && time1.end > time2.start;
          
          if (isTimeOverlap) {
            const nurse = booking?.nursingSpecialists?.find(n => 
              String(n.nursingID || n.NursingID) === String(nurseId1)
            );
            const nurseName = nurse?.FullName || nurse?.fullName || `Điều dưỡng ID ${nurseId1}`;
            
            const service1 = booking?.serviceTypes?.find(s => s.serviceID === time1.task.serviceID);
            const service2 = booking?.serviceTypes?.find(s => s.serviceID === time2.task.serviceID);
            const formatTime = (date) => date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
            
            const alertMessage = `Phát hiện trùng lịch!\n\n` +
              `${nurseName} đã được chọn cho 2 dịch vụ trùng thời gian:\n\n` +
              `1. ${service1?.serviceName || 'Dịch vụ'}: ${formatTime(time1.start)} - ${formatTime(time1.end)}\n` +
              `2. ${service2?.serviceName || 'Dịch vụ'}: ${formatTime(time2.start)} - ${formatTime(time2.end)}\n\n` +
              `Vui lòng chọn nhân sự khác cho một trong hai dịch vụ!`;
            
            console.log('Showing alert for detected conflict:', alertMessage);
            alert(alertMessage);
            return true;
          }
        }
      }
    }
    return false;
  };

  // Kiểm tra trùng nurse khi selectedStaffByTask thay đổi
  useEffect(() => {
    if (selectionMode !== 'user' || !selectedStaffByTask || Object.keys(selectedStaffByTask).length === 0) {
      return;
    }

    console.log('useEffect checking conflicts for:', selectedStaffByTask);

    // Sử dụng hàm kiểm tra mới
    const hasConflict = checkAndAlertTimeConflict(selectedStaffByTask);
    
    if (hasConflict) {
      // Tìm conflict đầu tiên để set error message
      const taskTimes = {};
      bookingCustomizeTasks.forEach(task => {
        if (task.startTime && task.endTime) {
          taskTimes[task.customizeTaskID] = {
            start: new Date(task.startTime),
            end: new Date(task.endTime)
          };
        }
      });

      const taskIds = Object.keys(selectedStaffByTask).filter(id => selectedStaffByTask[id]);
      
      for (let i = 0; i < taskIds.length; i++) {
        for (let j = i + 1; j < taskIds.length; j++) {
          const taskId1 = taskIds[i];
          const taskId2 = taskIds[j];
          const nurseId1 = selectedStaffByTask[taskId1];
          const nurseId2 = selectedStaffByTask[taskId2];
          
          if (nurseId1 === nurseId2 && taskTimes[taskId1] && taskTimes[taskId2]) {
            const time1 = taskTimes[taskId1];
            const time2 = taskTimes[taskId2];
            const isTimeOverlap = time1.start < time2.end && time1.end > time2.start;
            
            if (isTimeOverlap) {
              const nurse = booking?.nursingSpecialists?.find(n => 
                String(n.nursingID || n.NursingID) === String(nurseId1)
              );
              const nurseName = nurse?.FullName || nurse?.fullName || `Điều dưỡng ID ${nurseId1}`;
              setAssignError(`Trùng điều dưỡng! ${nurseName} đã được chọn cho dịch vụ khác trong cùng khung giờ. Bạn hãy chọn lại.`);
              return;
            }
          }
        }
      }
    } else {
      setAssignError("");
    }
  }, [selectedStaffByTask, selectionMode, booking?.nursingSpecialists, bookingCustomizeTasks]);

  // Persist user assignments immediately when changed
  const handleAssignNursing = async (customizeTaskID, nursingID) => {
    try {
      await customizeTaskService.updateNursing(customizeTaskID, nursingID);
    } catch (err) {
      console.warn('Không thể lưu gán điều dưỡng, sẽ thử lại khi thanh toán.', err);
    }
  };

  // Helper: kiểm tra trùng lịch cho tất cả nurse đã chọn
  const checkAllNurseScheduleConflict = async () => {
    if (!bookingCustomizeTasks || !bookingData?.datetime) {
      return { conflict: false };
    }
    
    const conflicts = [];
    for (const t of bookingCustomizeTasks) {
      const nid = selectedStaffByTask[t.customizeTaskID];
      if (!nid) continue;
      
      try {
        const nurseSchedules = await workScheduleService.getAllByNursing(nid);
        const conflict = nurseSchedules.some(sch => sch.workDate === bookingData?.datetime);
        if (conflict) {
          conflicts.push({ taskId: t.customizeTaskID, nurseId: nid });
        }
      } catch {
        conflicts.push({ taskId: t.customizeTaskID, nurseId: nid, error: true });
      }
    }
    
    return { conflict: conflicts.length > 0, conflicts };
  };

  // Handle staff selection with validation
  const handleStaffSelection = (updater) => {
    setAssignError("");
    
    const next = typeof updater === 'function' ? updater(selectedStaffByTask) : updater;
    console.log('handleStaffSelection called', { next, selectedStaffByTask });
    
    // Detect last changed key
    const changedKey = Object.keys(next).find(k => selectedStaffByTask[k] !== next[k]);
    console.log('Changed key:', changedKey);
    
    if (changedKey) {
      const nid = next[changedKey];
      console.log('Selected nurse ID:', nid);
      if (nid) {
        // Kiểm tra trùng nurse trong cùng khung giờ
        const currentTask = bookingCustomizeTasks.find(t => t.customizeTaskID === changedKey);
        console.log('Current task:', currentTask);
        if (currentTask && currentTask.startTime && currentTask.endTime) {
          const currentStart = new Date(currentTask.startTime);
          const currentEnd = new Date(currentTask.endTime);
          
          // Tìm các task khác có cùng nurse và trùng thời gian
          const conflictingTasks = Object.entries(next)
            .filter(([taskId, nurseId]) => taskId !== changedKey && nurseId === nid)
            .map(([taskId]) => {
              const task = bookingCustomizeTasks.find(t => t.customizeTaskID === taskId);
              return { taskId, task };
            })
            .filter(({ task }) => task && task.startTime && task.endTime)
            .filter(({ task }) => {
              const taskStart = new Date(task.startTime);
              const taskEnd = new Date(task.endTime);
              // Kiểm tra trùng thời gian
              return currentStart < taskEnd && currentEnd > taskStart;
            });
          
          console.log('Conflicting tasks:', conflictingTasks);
          
          if (conflictingTasks.length > 0) {
            const nurse = booking?.nursingSpecialists?.find(n => 
              String(n.nursingID || n.NursingID) === String(nid)
            );
            const nurseName = nurse?.FullName || nurse?.fullName || `Điều dưỡng ID ${nid}`;
            const conflictDetails = conflictingTasks.map(({ task }) => {
              const formatTime = (date) => new Date(date).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
              const service = booking?.serviceTypes?.find(s => s.serviceID === task.serviceID);
              const serviceName = service?.serviceName || "dịch vụ";
              return `${serviceName}: ${formatTime(task.startTime)} - ${formatTime(task.endTime)}`;
            }).join('\n');
            
            const currentService = booking?.serviceTypes?.find(s => s.serviceID === currentTask.serviceID);
            const currentServiceName = currentService?.serviceName || "dịch vụ";
            const formatTime = (date) => new Date(date).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
            
            const alertMessage = `Không thể chọn ${nurseName} do trùng giờ:\n\n` +
              `Dịch vụ hiện tại: ${currentServiceName}\n` +
              `Thời gian: ${formatTime(currentStart)} - ${formatTime(currentEnd)}\n\n` +
              `Đã được chọn cho:\n${conflictDetails}\n\n` +
              `Vui lòng chọn nhân sự khác hoặc điều chỉnh thời gian!`;
            
            console.log('Showing alert for time conflict:', alertMessage);
            
            // Thử với confirm thay vì alert
            const userConfirmed = confirm(alertMessage + '\n\nBạn có muốn tiếp tục không?');
            console.log('Confirm shown, user response:', userConfirmed);
            
            // Backup với alert
            if (!userConfirmed) {
              alert('Xin hãy chọn nhân sự khác!');
              console.log('Backup alert shown');
            }
            
            // Set error sau khi alert đã được hiển thị
            setTimeout(() => {
              setAssignError(`Trùng điều dưỡng! ${nurseName} đã được chọn cho dịch vụ khác trong cùng khung giờ. Bạn hãy chọn lại.`);
            }, 100);
            
            // Không cập nhật selectedStaffByTask khi có lỗi
            return;
          }
        }
        
        // Kiểm tra trùng lịch
        workScheduleService.getAllByNursing(nid).then(nurseSchedules => {
          const conflictingSchedule = nurseSchedules.find(sch => {
            const scheduleDate = new Date(sch.workDate || sch.workdate).toISOString().split('T')[0];
            const bookingDate = new Date(bookingData?.datetime).toISOString().split('T')[0];
            return scheduleDate === bookingDate;
          });
          
          if (conflictingSchedule) {
            const nurse = booking?.nursingSpecialists?.find(n => 
              String(n.nursingID || n.NursingID) === String(nid)
            );
            const nurseName = nurse?.FullName || nurse?.fullName || `Chuyên viên chăm sóc ID ${nid}`;
            const task = (bookingCustomizeTasks || []).find(t => t.customizeTaskID === changedKey);
            const service = booking?.serviceTypes?.find(s => s.serviceID === task?.serviceID);
            const serviceName = service?.serviceName || "dịch vụ";
            
            const formatTime = (date) => new Date(date).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
            const startTime = conflictingSchedule.workDate || conflictingSchedule.workdate;
            const endTime = conflictingSchedule.endTime || conflictingSchedule.endtime;
            const timeInfo = `${formatTime(startTime)} - ${formatTime(endTime)}`;
            const conflictBookingId = conflictingSchedule.bookingID || conflictingSchedule.booking_ID || conflictingSchedule.BookingID;
            
            const alertMessage = `Không thể chọn ${nurseName} cho dịch vụ "${serviceName}":\n\n` +
              `Nhân sự này đã có lịch trùng với booking khác:\n` +
              `• Booking #${conflictBookingId}\n` +
              `• Thời gian: ${timeInfo}\n` +
              `• Ngày: ${new Date(bookingData?.datetime).toLocaleDateString('vi-VN')}\n\n` +
              `Vui lòng chọn nhân sự khác!`;
            
            alert(alertMessage);
            setAssignError("Nhân viên này đã có lịch vào thời điểm này!");
            // Không cập nhật selectedStaffByTask khi có lỗi
          } else {
            setSelectedStaffByTask(next);
          }
        }).catch(() => {
          // Hiển thị thông báo chi tiết cho người dùng
          const nurse = booking?.nursingSpecialists?.find(n => 
            String(n.nursingID || n.NursingID) === String(nid)
          );
          const nurseName = nurse?.FullName || nurse?.fullName || `Chuyên viên chăm sóc ID ${nid}`;
          const task = (bookingCustomizeTasks || []).find(t => t.customizeTaskID === changedKey);
          const service = booking?.serviceTypes?.find(s => s.serviceID === task?.serviceID);
          const serviceName = service?.serviceName || "dịch vụ";
          
          const alertMessage = `Không thể kiểm tra lịch của ${nurseName} cho dịch vụ "${serviceName}":\n\n` +
            `Có lỗi khi kết nối đến hệ thống lịch trình.\n` +
            `Vui lòng thử lại hoặc chọn nhân sự khác!`;
          
          alert(alertMessage);
          setAssignError(`- ${nurseName} (${serviceName}): Không kiểm tra được lịch của nhân viên!`);
          // Không cập nhật selectedStaffByTask khi có lỗi
        });
        return;
      }
    }
    
    setSelectedStaffByTask(next);
  };

  return {
    selectionMode,
    setSelectionMode,
    selectedStaffByTask,
    setSelectedStaffByTask: handleStaffSelection,
    canConfirm,
    assignError,
    setAssignError,
    handleAssignNursing,
    checkAllNurseScheduleConflict,
    bookingCustomizeTasks
  };
};
