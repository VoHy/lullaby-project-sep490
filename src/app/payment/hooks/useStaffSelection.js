import { useState, useEffect, useMemo } from 'react';
import customizeTaskService from '@/services/api/customizeTaskService';
import workScheduleService from '@/services/api/workScheduleService';

export const useStaffSelection = (booking, bookingData) => {
  const [selectionMode, setSelectionMode] = useState('auto'); // 'user' | 'auto'
  const [selectedStaffByTask, setSelectedStaffByTask] = useState({}); // { [customizeTaskId]: nursingId }
  const [canConfirm, setCanConfirm] = useState(true);
  const [assignError, setAssignError] = useState("");

  // Danh sách customizeTasks của booking (chỉ dựa vào dữ liệu đã tạo trên backend)
  const bookingCustomizeTasks = useMemo(() => {
    return Array.isArray(booking?.customizeTasks) ? booking.customizeTasks : [];
  }, [booking?.customizeTasks]);

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
    setCanConfirm(allSelected);
  }, [selectionMode, bookingCustomizeTasks, selectedStaffByTask]);

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
        // Kiểm tra trùng lịch
        workScheduleService.getAllByNursing(nid).then(nurseSchedules => {
          const conflict = nurseSchedules.some(sch => sch.workDate === bookingData?.datetime);
          if (conflict) {
            setAssignError("Nhân viên này đã có lịch vào thời điểm này!");
          } else {
            setSelectedStaffByTask(next);
          }
        }).catch(() => {
          // Hiển thị thông báo chi tiết cho người dùng
          const nurse = booking?.nursingSpecialists?.find(n => 
            String(n.nursingID || n.NursingID) === String(nid)
          );
          const nurseName = nurse?.FullName || nurse?.fullName || `Y tá ID ${nid}`;
          const task = (bookingCustomizeTasks || []).find(t => t.customizeTaskID === changedKey);
          const service = booking?.serviceTypes?.find(s => s.serviceID === task?.serviceID);
          const serviceName = service?.serviceName || "dịch vụ";
          setAssignError(`- ${nurseName} (${serviceName}): Không kiểm tra được lịch của nhân viên!`);
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
