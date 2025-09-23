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

  // Kiểm tra trùng nurse khi selectedStaffByTask thay đổi
  useEffect(() => {
    if (selectionMode !== 'user' || !selectedStaffByTask || Object.keys(selectedStaffByTask).length === 0) {
      return;
    }

    // Tìm các nurse bị trùng thời gian
    const nurseTimeConflicts = [];
    
    // Lấy thông tin thời gian của các task
    const taskTimes = {};
    bookingCustomizeTasks.forEach(task => {
      if (task.startTime && task.endTime) {
        taskTimes[task.customizeTaskID] = {
          start: new Date(task.startTime),
          end: new Date(task.endTime)
        };
      }
    });


    // Kiểm tra từng cặp task xem có trùng thời gian không
    const taskIds = Object.keys(selectedStaffByTask).filter(id => selectedStaffByTask[id]);
    
    for (let i = 0; i < taskIds.length; i++) {
      for (let j = i + 1; j < taskIds.length; j++) {
        const taskId1 = taskIds[i];
        const taskId2 = taskIds[j];
        const nurseId1 = selectedStaffByTask[taskId1];
        const nurseId2 = selectedStaffByTask[taskId2];
        
        // Nếu cùng nurse và có thông tin thời gian
        if (nurseId1 === nurseId2 && taskTimes[taskId1] && taskTimes[taskId2]) {
          const time1 = taskTimes[taskId1];
          const time2 = taskTimes[taskId2];
          
          // Kiểm tra trùng thời gian: thời gian bắt đầu của task này < thời gian kết thúc của task kia
          // và thời gian kết thúc của task này > thời gian bắt đầu của task kia
          const isTimeOverlap = time1.start < time2.end && time1.end > time2.start;
          
          
          if (isTimeOverlap) {
            nurseTimeConflicts.push({ nurseId: nurseId1, taskId1, taskId2 });
          }
        }
      }
    }

    if (nurseTimeConflicts.length > 0) {
      const conflict = nurseTimeConflicts[0];
      const nurse = booking?.nursingSpecialists?.find(n => 
        String(n.nursingID || n.NursingID) === String(conflict.nurseId)
      );
      const nurseName = nurse?.FullName || nurse?.fullName || `Điều dưỡng ID ${conflict.nurseId}`;
      setAssignError(`Trùng điều dưỡng! ${nurseName} đã được chọn cho dịch vụ khác trong cùng khung giờ. Bạn hãy chọn lại.`);
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
    
    // Detect last changed key
    const changedKey = Object.keys(next).find(k => selectedStaffByTask[k] !== next[k]);
    
    if (changedKey) {
      const nid = next[changedKey];
      if (nid) {
        // Kiểm tra trùng nurse trong cùng khung giờ
        const currentTask = bookingCustomizeTasks.find(t => t.customizeTaskID === changedKey);
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
          
          if (conflictingTasks.length > 0) {
            const nurse = booking?.nursingSpecialists?.find(n => 
              String(n.nursingID || n.NursingID) === String(nid)
            );
            const nurseName = nurse?.FullName || nurse?.fullName || `Điều dưỡng ID ${nid}`;
            setAssignError(`Trùng điều dưỡng! ${nurseName} đã được chọn cho dịch vụ khác trong cùng khung giờ. Bạn hãy chọn lại.`);
            // Không cập nhật selectedStaffByTask khi có lỗi
            return;
          }
        }
        
        // Kiểm tra trùng lịch
        workScheduleService.getAllByNursing(nid).then(nurseSchedules => {
          const conflict = nurseSchedules.some(sch => sch.workDate === bookingData?.datetime);
          if (conflict) {
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
