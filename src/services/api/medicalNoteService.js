const medicalNoteService = {
  getMedicalNotes: async () => {
    const res = await fetch('/api/MedicalNote');
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy danh sách medical note');
    return data;
  },
  getMedicalNoteById: async (id) => {
    const res = await fetch(`/api/MedicalNote/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Không thể lấy thông tin medical note');
    return data;
  },
  createMedicalNote: async (data) => {
    const res = await fetch('/api/MedicalNote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Tạo medical note thất bại');
    return result;
  },
  updateMedicalNote: async (id, data) => {
    const res = await fetch(`/api/MedicalNote/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Cập nhật medical note thất bại');
    return result;
  },
  deleteMedicalNote: async (id) => {
    const res = await fetch(`/api/MedicalNote/${id}`, { method: 'DELETE' });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Xóa medical note thất bại');
    return result;
  }
};

export default medicalNoteService; 