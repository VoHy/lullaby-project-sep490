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
  const [loadingMap, setLoadingMap] = useState({}); // { serviceId: boolean }
  const [candidatesByService, setCandidatesByService] = useState({}); // { serviceId: Nurse[] }
  const [openTaskId, setOpenTaskId] = useState(null); // taskId đang mở popup
  const [assignError, setAssignError] = useState("");

  const taskRows = useMemo(() => {
    return tasks.map((t) => {
      const sid = t.serviceID || t.service_ID || t.Service_ID;
      const st = serviceTypes.find(s => (s.serviceID === sid || s.serviceTypeID === sid || s.ServiceID === sid));
      return {
        taskId: t.customizeTaskID || t.customize_TaskID,
        serviceId: sid,
        serviceName: st?.serviceName || st?.ServiceName || `Dịch vụ #${sid}`,
      };
    });
  }, [tasks, serviceTypes]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      for (const row of taskRows) {
        const sid = row.serviceId;
        if (!sid || candidatesByService[sid]) continue;
        setLoadingMap((m) => ({ ...m, [sid]: true }));
        try {
          const list = await getCandidatesForService?.(sid);
          if (!cancelled) setCandidatesByService((m) => ({ ...m, [sid]: list || [] }));
        } catch {
          if (!cancelled) setCandidatesByService((m) => ({ ...m, [sid]: [] }));
        } finally {
          if (!cancelled) setLoadingMap((m) => ({ ...m, [sid]: false }));
        }
      }
    };
    load();
    return () => { cancelled = true; };
  }, [taskRows, getCandidatesForService]);

  if (!Array.isArray(taskRows) || taskRows.length === 0) return null;

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
            {taskRows.map((row) => (
              <tr key={row.taskId}>
                <td className="px-4 py-2 font-medium text-gray-800">{row.serviceName}</td>
                <td className="px-4 py-2">
                  <button
                    className="bg-purple-600 text-white border-purple-600 border text-white px-4 py-2 rounded transition-colors"
                    onClick={() => setOpenTaskId(row.taskId)}
                  >
                    {selectedStaffByTask?.[row.taskId]
                      ? `Đã chọn: ${(() => {
                        const nurse = (candidatesByService[row.serviceId] || []).find(n => (n.NursingID || n.nursingID) === selectedStaffByTask[row.taskId]);
                        return nurse?.Full_Name || nurse?.fullName || nurse?.FullName || nurse?.name || 'Điều dưỡng';
                      })()}`
                      : 'Chọn điều dưỡng'}
                  </button>
                  {/* Popup/modal chọn điều dưỡng */}
                  {openTaskId === row.taskId && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
                      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-xl max-h-3xl relative">
                        <h4 className="text-lg font-bold mb-4">Chọn điều dưỡng cho dịch vụ:
                          <span className="text-blue-600">{row.serviceName}</span></h4>
                        <button
                          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
                          onClick={() => setOpenTaskId(null)}
                        >×</button>
                        <div className="space-y-4 max-h-[400px] overflow-y-auto">
                          {(candidatesByService[row.serviceId] || []).map((nurse) => {
                            // So sánh kiểu dữ liệu accountID để chắc chắn khớp
                            const account = accounts?.find(acc => String(acc.accountID) === String(nurse.accountID));
                            return (
                              <div key={nurse.NursingID || nurse.nursingID} className="border rounded-lg p-4 flex gap-4 items-center hover:bg-blue-50 transition cursor-pointer"
                                onClick={async () => {
                                  setAssignError("");
                                  try {
                                    setSelectedStaffByTask?.((prev) => ({ ...prev, [row.taskId]: nurse.NursingID || nurse.nursingID }));
                                    if (onAssign) await onAssign(row.taskId, nurse.NursingID || nurse.nursingID);
                                    setOpenTaskId(null);
                                  } catch (err) {
                                    setAssignError(err?.message || "Không thể gán điều dưỡng. Vui lòng thử lại.");
                                  }
                                }}
                              >
                                <img
                                  src={account?.avatarUrl || 'https://via.placeholder.com/48'}
                                  alt="avatar"
                                  className="w-12 h-12 rounded-full object-cover border"
                                />
                                <div>
                                  <div className="font-bold text-blue-700 text-lg">{nurse.Full_Name || nurse.fullName || nurse.FullName || nurse.name || `Nurse #${nurse.NursingID || nurse.nursingID}`}</div>
                                  <div className="text-sm text-gray-600">Năm sinh: {nurse.birthYear || nurse.BirthYear || nurse.dateOfBirth?.slice(0, 4) || nurse.birth_year || (account?.dateOfBirth?.slice(0, 4)) || '---'}</div>
                                  <div className="text-sm text-gray-600">SĐT: {account?.phoneNumber || nurse.phoneNumber || nurse.PhoneNumber || nurse.phone_number || '---'}</div>
                                  <div className="italic text-pink-600 text-sm">{nurse.slogan || nurse.Slogan || 'Không có slogan'}</div>
                                </div>
                              </div>
                            );
                          })}
                          {loadingMap[row.serviceId] && <div className="text-center text-gray-500">Đang tải danh sách...</div>}
                          {!loadingMap[row.serviceId] && (candidatesByService[row.serviceId] || []).length === 0 && <div className="text-center text-gray-500">Không có điều dưỡng phù hợp</div>}
                        </div>
                        {assignError && (
                          <div className="text-red-500 text-center mt-2 font-semibold">{assignError}</div>
                        )}
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


