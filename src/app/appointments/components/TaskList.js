"use client";

import React from 'react';

export default function TaskList({ 
  tasks = [],
  onAssignNursing,
  onUpdateStatus,
  compact = false 
}) {
  
  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-sm text-gray-500 italic">
        Chưa có nhiệm vụ chăm sóc
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h4 className="font-medium text-gray-900 text-sm">
        Nhiệm vụ chăm sóc ({tasks.length})
      </h4>
      
      <div className="space-y-2">
        {tasks.map((task, index) => (
          <div 
            key={task.taskId || index}
            className="bg-gray-50 rounded-lg p-3 border border-gray-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">
                    {task.serviceName}
                  </span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    task.status === 'completed' 
                      ? 'bg-green-100 text-green-800'
                      : task.status === 'in-progress'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {task.status === 'completed' ? 'Hoàn thành' :
                     task.status === 'in-progress' ? 'Đang thực hiện' : 
                     task.status === 'pending' ? 'Chờ xử lý' : task.status}
                  </span>
                </div>
                
                <div className="mt-1 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className={task.isAssigned ? 'text-green-600' : 'text-orange-600'}>
                      {task.nursingName}
                    </span>
                  </div>
                </div>
              </div>
              
              {!compact && (
                <div className="flex gap-1 ml-2">
                  {!task.isAssigned && (
                    <button
                      onClick={() => onAssignNursing?.(task)}
                      className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                    >
                      Phân công
                    </button>
                  )}
                  
                  {task.status !== 'completed' && (
                    <button
                      onClick={() => onUpdateStatus?.(task)}
                      className="text-green-600 hover:text-green-800 text-xs font-medium ml-2"
                    >
                      Cập nhật
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}