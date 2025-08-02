import { createService } from './serviceFactory';

// Tạo base service với factory
const baseMedicalNoteService = createService('medicalnotes', 'MedicalNote', true);

// Thêm method đặc biệt
const medicalNoteService = {
  // Base CRUD methods từ factory
  ...baseMedicalNoteService,

  // Thêm method getMedicalNotes để đảm bảo
  getMedicalNotes: async () => {
    const res = await fetch('/api/medicalnotes', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy danh sách medical notes');
    return data;
  },

  getMedicalNoteById: async (id) => {
    const res = await fetch(`/api/medicalnotes/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy thông tin medical note');
    return data;
  }
};

export default medicalNoteService; 