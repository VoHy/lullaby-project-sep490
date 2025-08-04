import { createService } from './serviceFactory';

// Tạo base service với factory
const baseMedicalNoteService = createService('medicalnote', 'MedicalNote', true);

// Thêm method đặc biệt
const medicalNoteService = {
  // Base CRUD methods từ factory
  ...baseMedicalNoteService,

  // Get all medical notes
  getAllMedicalNotes: async () => {
    const res = await fetch('/api/medicalnote/getall', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy danh sách medical notes');
    return data;
  },

  // Get medical note by ID
  getMedicalNoteById: async (medicalNoteId) => {
    const res = await fetch(`/api/medicalnote/${medicalNoteId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy thông tin medical note');
    return data;
  },

  // Create new medical note
  createMedicalNote: async (medicalNoteData) => {
    const res = await fetch('/api/medicalnote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(medicalNoteData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Tạo medical note thất bại');
    return data;
  },

  // Update medical note
  updateMedicalNote: async (medicalNoteId, medicalNoteData) => {
    const res = await fetch(`/api/medicalnote/${medicalNoteId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(medicalNoteData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Cập nhật medical note thất bại');
    return data;
  },

  // Delete medical note
  deleteMedicalNote: async (medicalNoteId) => {
    const res = await fetch(`/api/medicalnote/${medicalNoteId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Xóa medical note thất bại');
    return data;
  },

  // Get all medical notes by account
  getAllMedicalNotesByAccount: async (accountId) => {
    const res = await fetch(`/api/medicalnote/getallbyaccount/${accountId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy danh sách medical notes theo account');
    return data;
  },

  // Get all medical notes by care profile
  getAllMedicalNotesByCareProfile: async (careProfileId) => {
    const res = await fetch(`/api/medicalnote/getallbycareprofile/${careProfileId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy danh sách medical notes theo care profile');
    return data;
  }
};

export default medicalNoteService; 