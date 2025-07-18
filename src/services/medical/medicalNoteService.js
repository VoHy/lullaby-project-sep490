import medicalNotes from '../../mock/MedicalNote';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

const medicalNoteService = {
  createMedicalNote: async (noteData) => {
    if (USE_MOCK) {
      return Promise.resolve({ ...noteData, RecordID: medicalNotes.length + 1 });
    }
    const res = await fetch('/api/medical-notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(noteData)
    });
    return res.json();
  },
  getMedicalNotes: async () => {
    if (USE_MOCK) {
      return Promise.resolve(medicalNotes);
    }
    const res = await fetch('/api/medical-notes');
    return res.json();
  },
  getMedicalNoteById: async (recordId) => {
    if (USE_MOCK) {
      return Promise.resolve(medicalNotes.find(m => m.RecordID === recordId));
    }
    const res = await fetch(`/api/medical-notes/${recordId}`);
    return res.json();
  },
  updateMedicalNote: async (recordId, noteData) => {
    if (USE_MOCK) {
      return Promise.resolve({ ...medicalNotes.find(m => m.RecordID === recordId), ...noteData });
    }
    const res = await fetch(`/api/medical-notes/${recordId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(noteData)
    });
    return res.json();
  },
  deleteMedicalNote: async (recordId) => {
    if (USE_MOCK) {
      return Promise.resolve(true);
    }
    const res = await fetch(`/api/medical-notes/${recordId}`, { method: 'DELETE' });
    return res.ok;
  }
};

export default medicalNoteService; 