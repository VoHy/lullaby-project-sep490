import { useEffect, useMemo, useState } from 'react';
// Import trực tiếp service
import customizeTaskService from '@/services/api/customizeTaskService';

export default function StaffSelection({
  tasks = [],
  serviceTypes = [],
  careProfile,
  nursingSpecialists = [],
  selectedStaffByTask,
  setSelectedStaffByTask,
  getCandidatesForService,
  onAssign,
  accounts = [], // Thêm prop accounts
}) {
  const [loadingMap, setLoadingMap] = useState({}); // { customizeTaskId: boolean }
  const [candidatesByTask, setCandidatesByTask] = useState({}); // { customizeTaskId: Nurse[] }
  const [openTaskId, setOpenTaskId] = useState(null); // taskId đang mở popup
  const [assignError, setAssignError] = useState("");

  const taskRows = useMemo(() => {
    console.log('StaffSelection - tasks:', tasks);
    console.log('StaffSelection - serviceTypes:', serviceTypes);
    
    return tasks.map((t) => {
      const customizeTaskId = t.customizeTaskID || t.customize_TaskID;
      const serviceId = t.serviceID || t.service_ID || t.Service_ID;
      const st = serviceTypes.find(s => (s.serviceID === serviceId || s.serviceTypeID === serviceId || s.ServiceID === serviceId));
      console.log(`Task ${customizeTaskId}: serviceID=${serviceId}, found serviceType:`, st);
      
      return {
        customizeTaskId: customizeTaskId,
        serviceId: serviceId,
        serviceName: st?.serviceName || st?.ServiceName || `Dịch vụ #${serviceId}`,
      };
    });
  }, [tasks, serviceTypes]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      console.log('Loading candidates for tasks:', taskRows);
      
      for (const row of taskRows) {
        const customizeTaskId = row.customizeTaskId;
        if (!customizeTaskId || candidatesByTask[customizeTaskId]) continue;
        
        console.log(`Loading candidates for customizeTaskId ${customizeTaskId} (${row.serviceName})`);
        setLoadingMap((m) => ({ ...m, [customizeTaskId]: true }));
        
        try {
          const list = await getCandidatesForService?.(customizeTaskId);
          console.log(`Candidates for customizeTaskId ${customizeTaskId}:`, list);
          
          if (!cancelled) {
            setCandidatesByTask((m) => ({ ...m, [customizeTaskId]: list || [] }));
          }
        } catch (error) {
          console.error(`Error loading candidates for customizeTaskId ${customizeTaskId}:`, error);
          if (!cancelled) {
            setCandidatesByTask((m) => ({ ...m, [customizeTaskId]: [] }));
          }
        } finally {
          if (!cancelled) {
            setLoadingMap((m) => ({ ...m, [customizeTaskId]: false }));
          }
        }
      }
    };
    load();
    return () => { cancelled = true; };
  }, [taskRows, getCandidatesForService]);

  if (!Array.isArray(taskRows) || taskRows.length === 0) {
    console.log('No tasks to display');
    return null;
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Chọn điều dưỡng cho từng dịch vụ</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 text-left">Dịch vụ</th>
              <th className="px-4 py-2 text-left">Chọn điều dưỡng</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {taskRows.map((row) => {
              const candidates = candidatesByTask[row.customizeTaskId] || [];
              const isLoading = loadingMap[row.customizeTaskId];
              const selectedNurseId = selectedStaffByTask?.[row.customizeTaskId];
              const selectedNurse = candidates.find(n => 
                String(n.NursingID || n.nursingID) === String(selectedNurseId)
              );
              
              console.log(`Row ${row.customizeTaskId}: candidates=${candidates.length}, selected=${selectedNurseId}, nurse=`, selectedNurse);
              
              return (
                <tr key={row.customizeTaskId}>
                  <td className="px-4 py-2 font-medium text-gray-800">{row.serviceName}</td>
                  <td className="px-4 py-2">
                    <button
                      className="bg-purple-600 text-white border-purple-600 border text-white px-4 py-2 rounded transition-colors"
                      onClick={() => setOpenTaskId(row.customizeTaskId)}
                    >
                      {selectedNurse
                        ? `Đã chọn: ${selectedNurse.Full_Name || selectedNurse.fullName || selectedNurse.FullName || selectedNurse.name || 'Điều dưỡng'}`
                        : 'Chọn điều dưỡng'}
                    </button>
                    
                    {/* Debug info */}
                    <div className="text-xs text-gray-500 mt-1">
                      {isLoading ? 'Đang tải...' : `${candidates.length} điều dưỡng có sẵn`}
                    </div>
                    
                    {/* Popup/modal chọn điều dưỡng */}
                    {openTaskId === row.customizeTaskId && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
                        <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-xl max-h-3xl relative">
                          <h4 className="text-lg font-bold mb-4">Chọn điều dưỡng cho dịch vụ:
                            <span className="text-blue-600">{row.serviceName}</span></h4>
                          <button
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
                            onClick={() => setOpenTaskId(null)}
                          >×</button>
                          
                          <div className="space-y-4 max-h-[400px] overflow-y-auto">
                            {isLoading && (
                              <div className="text-center text-gray-500">
                                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                                Đang tải danh sách điều dưỡng...
                              </div>
                            )}
                            
                            {!isLoading && candidates.length === 0 && (
                              <div className="text-center text-gray-500 p-4">
                                <div className="text-lg font-semibold mb-2">Không có điều dưỡng phù hợp</div>
                              </div>
                            )}
                            
                            {!isLoading && candidates.map((nurse) => {
                              // So sánh kiểu dữ liệu accountID để chắc chắn khớp
                              const account = accounts?.find(acc => String(acc.accountID) === String(nurse.accountID));
                              const isSelected = String(nurse.NursingID || nurse.nursingID) === String(selectedNurseId);
                              
                              return (
                                <div 
                                  key={nurse.NursingID || nurse.nursingID} 
                                  className={`border rounded-lg p-4 flex gap-4 items-center hover:bg-blue-50 transition cursor-pointer ${
                                    isSelected ? 'bg-blue-100 border-blue-300' : ''
                                  }`}
                                  onClick={async () => {
                                    setAssignError("");
                                    try {
                                      const nurseId = nurse.NursingID || nurse.nursingID;
                                      console.log(`Selecting nurse ${nurseId} for task ${row.customizeTaskId}`);
                                      
                                      setSelectedStaffByTask?.((prev) => ({ 
                                        ...prev, 
                                        [row.customizeTaskId]: nurseId 
                                      }));
                                      
                                      if (onAssign) {
                                        await onAssign(row.customizeTaskId, nurseId);
                                      }
                                      
                                      setOpenTaskId(null);
                                    } catch (err) {
                                      console.error('Error assigning nurse:', err);
                                      setAssignError(err?.message || "Không thể gán điều dưỡng. Vui lòng thử lại.");
                                    }
                                  }}
                                >
                                  <img
                                    src={account?.avatarUrl || 'https://via.placeholder.com/48'}
                                    alt="avatar"
                                    className="w-12 h-12 rounded-full object-cover border"
                                  />
                                  <div className="flex-1">
                                    <div className="font-bold text-blue-700 text-lg">
                                      {nurse.Full_Name || nurse.fullName || nurse.FullName || nurse.name || `Nurse #${nurse.NursingID || nurse.nursingID}`}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                      Năm sinh: {nurse.birthYear || nurse.BirthYear || nurse.dateOfBirth?.slice(0, 4) || nurse.birth_year || (account?.dateOfBirth?.slice(0, 4)) || '---'}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                      SĐT: {account?.phoneNumber || nurse.phoneNumber || nurse.PhoneNumber || nurse.phone_number || '---'}
                                    </div>
                                    <div className="italic text-pink-600 text-sm">
                                      {nurse.slogan || nurse.Slogan || 'Không có slogan'}
                                    </div>
                                  </div>
                                  {isSelected && (
                                    <div className="text-green-600 text-2xl">✓</div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                          
                          {assignError && (
                            <div className="text-red-500 text-center mt-2 font-semibold">{assignError}</div>
                          )}
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}


