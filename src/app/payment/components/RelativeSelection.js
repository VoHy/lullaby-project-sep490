import { useState, useEffect } from 'react';
import { HiOutlineUserGroup, HiOutlineCheck } from 'react-icons/hi2';
import customizeTaskService from '@/services/api/customizeTaskService';

export default function RelativeSelection({
  customizeTasks = [],
  relatives = [],
  selectedRelativeByTask = {},
  setSelectedRelativeByTask = () => {},
  bookingId,
  serviceTypes = [],
  serviceTasks = []
}) {
  const [loadingMap, setLoadingMap] = useState({});
  const [updateError, setUpdateError] = useState("");

  // Lấy danh sách relative đã được chọn ở các task khác
  const getSelectedRelativeIds = () => {
    return Object.values(selectedRelativeByTask).filter(id => id !== null && id !== undefined);
  };

  // Kiểm tra xem relative có được chọn ở task khác không
  const isRelativeSelectedInOtherTask = (relativeId, currentTaskId) => {
    const selectedIds = getSelectedRelativeIds();
    return selectedIds.includes(relativeId) && selectedRelativeByTask[currentTaskId] !== relativeId;
  };

  // Xử lý khi user chọn relative cho task
  const handleSelectRelative = async (customizeTaskId, relativeId) => {
    if (!customizeTaskId || !relativeId) return;

    setLoadingMap(prev => ({ ...prev, [customizeTaskId]: true }));
    setUpdateError("");

    try {
      // Gọi API update relative cho customizeTask
      await customizeTaskService.updateRelative(customizeTaskId, relativeId);
      
      // Cập nhật state local
      setSelectedRelativeByTask(prev => ({
        ...prev,
        [customizeTaskId]: relativeId
      }));

      console.log(`Đã cập nhật relative ${relativeId} cho task ${customizeTaskId}`);
    } catch (error) {
      console.error('Lỗi khi cập nhật relative:', error);
      setUpdateError(`Không thể cập nhật relative cho dịch vụ. Vui lòng thử lại.`);
    } finally {
      setLoadingMap(prev => ({ ...prev, [customizeTaskId]: false }));
    }
  };

  // Lọc customizeTasks chỉ hiển thị những task cần chọn relative
  const tasksToShow = customizeTasks.filter(task => {
    const customizeTaskId = task.customizeTaskID || task.customize_TaskID || task.id;
    return customizeTaskId; // Hiển thị tất cả task có customizeTaskId
  });

  // Kiểm tra xem tất cả task đã được gán relative chưa
  const allTasksAssigned = tasksToShow.every(task => {
    const customizeTaskId = task.customizeTaskID || task.customize_TaskID || task.id;
    return selectedRelativeByTask[customizeTaskId] || task.relativeID || task.RelativeID;
  });

  if (!tasksToShow || tasksToShow.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
            <HiOutlineUserGroup className="text-green-600 text-xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Chọn người thân cho từng dịch vụ</h2>
        </div>
        <div className="text-center py-8">
          <div className="text-gray-500 text-lg mb-2">Không có dịch vụ nào cần chọn người thân</div>
          <div className="text-gray-400 text-sm">Tất cả dịch vụ đã được gán người thân hoặc không cần gán.</div>
        </div>
      </div>
    );
  }

  if (!relatives || relatives.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
            <HiOutlineUserGroup className="text-green-600 text-xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Chọn người thân cho từng dịch vụ</h2>
        </div>
        <div className="text-center py-8">
          <div className="text-gray-500 text-lg mb-2">Không có người thân nào được tìm thấy</div>
          <div className="text-gray-400 text-sm">Vui lòng liên hệ admin để thêm người thân cho booking này.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
          <HiOutlineUserGroup className="text-green-600 text-xl" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Chọn người thân cho từng dịch vụ</h2>
      </div>

      {updateError && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg">
          <div className="text-red-700 text-sm font-semibold">{updateError}</div>
        </div>
      )}

      <div className="space-y-4">
        {allTasksAssigned && (
          <div className="mb-4 p-3 bg-green-100 border border-green-300 rounded-lg">
            <div className="text-green-700 text-sm font-semibold">
              Tất cả dịch vụ đã được chọn!
            </div>
          </div>
        )}

        {!allTasksAssigned && tasksToShow.length > 0 && (
          <div className="mb-4 p-3 bg-blue-100 border border-blue-300 rounded-lg">
            <div className="text-blue-700 text-sm font-semibold">
               Vui lòng chọn người thân cho các dịch vụ chưa được gán.
            </div>
          </div>
        )}

        {tasksToShow.map((task, index) => {
          const customizeTaskId = task.customizeTaskID || task.customize_TaskID || task.id;
          const serviceId = task.serviceID || task.ServiceID;
          const serviceType = serviceTypes.find(s => 
            s.serviceID === serviceId || 
            s.serviceTypeID === serviceId || 
            s.ServiceID === serviceId
          );
          const serviceTask = serviceTasks.find(st => 
            st.serviceTaskID === task.serviceTaskID || 
            st.ServiceTaskID === task.serviceTaskID ||
            st.child_ServiceID === serviceId ||
            st.childServiceID === serviceId
          );
          const serviceName = serviceType?.serviceName || serviceType?.ServiceName || serviceTask?.taskName || serviceTask?.TaskName || task.serviceName || task.ServiceName || `Dịch vụ #${serviceId}`;
          const selectedRelativeId = selectedRelativeByTask[customizeTaskId] || task.relativeID || task.RelativeID;
          const selectedRelative = relatives.find(r => r.relativeID === selectedRelativeId);
          const isLoading = loadingMap[customizeTaskId];

          return (
            <div key={customizeTaskId} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-800 text-lg">{serviceName}</h3>
                  {task.taskOrder && (
                    <span className="text-sm text-gray-500">Thứ tự: {task.taskOrder}</span>
                  )}
                </div>
                {isLoading && (
                  <div className="flex items-center gap-2 text-blue-600">
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm">Đang cập nhật...</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Chọn người thân (Con):
                </label>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {relatives.length === 0 ? (
                    <div className="col-span-full text-center py-4 text-gray-500">
                      Không có người thân nào khả dụng
                    </div>
                  ) : (
                    relatives.map((relative) => {
                      const relativeId = relative.relativeID || relative.relativeid || relative.id;
                      const isSelected = selectedRelativeId === relativeId;
                      // Sửa logic disable: chỉ disable nếu relative đã được chọn cho customizeTask khác
                      const isDisabled = Object.entries(selectedRelativeByTask).some(
                        ([taskId, relId]) => relId === relativeId && String(taskId) !== String(customizeTaskId)
                      );
                      
                      return (
                        <div
                          key={relativeId}
                          className={`border rounded-lg p-3 cursor-pointer transition-all ${
                            isSelected 
                              ? 'border-green-500 bg-green-50' 
                              : isDisabled
                              ? 'border-gray-200 bg-gray-100 cursor-not-allowed opacity-50'
                              : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                          }`}
                          onClick={() => {
                            if (!isDisabled && !isLoading) {
                              handleSelectRelative(customizeTaskId, relativeId);
                            }
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="font-medium text-gray-800">
                                {relative.relativeName || relative.name || 'Người thân'}
                              </div>
                              {relative.dateOfBirth && (
                                <div className="text-sm text-gray-600">
                                  {new Date(relative.dateOfBirth).toLocaleDateString('vi-VN')}
                                </div>
                              )}
                              {isDisabled && (
                                <div className="text-xs text-red-600 mt-1">
                                  Đã được chọn ở dịch vụ khác
                                </div>
                              )}
                            </div>
                            {isSelected && (
                              <HiOutlineCheck className="text-green-600 text-xl" />
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {selectedRelative && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="text-sm text-green-800">
                      <strong>Đã chọn:</strong> {selectedRelative.relativeName || selectedRelative.name}
                      {selectedRelative.dateOfBirth && (
                        <span className="ml-2">
                          ({new Date(selectedRelative.dateOfBirth).toLocaleDateString('vi-VN')})
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {!selectedRelative && (
                  <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="text-sm text-yellow-800">
                      <strong>Chưa chọn:</strong> Vui lòng chọn một người thân cho dịch vụ này.
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="text-blue-800 text-sm">
          <div className="font-semibold mb-2">ℹ Hướng dẫn:</div>
          <ul className="space-y-1 text-xs">
            <li>• Mỗi dịch vụ chỉ có thể chọn một người thân</li>
            <li>• Một người thân không thể được chọn cho nhiều dịch vụ cùng lúc</li>
            <li>• Bạn có thể thay đổi lựa chọn bất cứ lúc nào trước khi thanh toán</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
