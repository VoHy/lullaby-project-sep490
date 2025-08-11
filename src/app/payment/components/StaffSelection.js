import { useEffect, useMemo, useState } from 'react';

export default function StaffSelection({
  tasks = [],
  serviceTypes = [],
  careProfile,
  nursingSpecialists = [],
  selectedStaffByTask,
  setSelectedStaffByTask,
  getCandidatesForService,
  onAssign,
}) {
  const [loadingMap, setLoadingMap] = useState({}); // { serviceId: boolean }
  const [candidatesByService, setCandidatesByService] = useState({}); // { serviceId: Nurse[] }

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
                  <select
                    className="border rounded px-3 py-2 text-sm min-w-[240px]"
                    value={selectedStaffByTask?.[row.taskId] || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSelectedStaffByTask?.((prev) => ({ ...prev, [row.taskId]: value }));
                      onAssign?.(row.taskId, value);
                    }}
                  >
                    <option value="" disabled={loadingMap[row.serviceId]}>Chọn điều dưỡng</option>
                    {(candidatesByService[row.serviceId] || []).map((n) => (
                      <option key={n.NursingID || n.nursingID} value={n.NursingID || n.nursingID}>
                        {n.Full_Name || n.fullName || n.FullName || n.name || `Nurse #${n.NursingID || n.nursingID}`}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


