import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import serviceTaskService from '@/services/api/serviceTaskService';
import medicalNoteService from '@/services/api/medicalNoteService';
import bookingService from '@/services/api/bookingService';
import careProfileService from '@/services/api/careProfileService';
import customizeTaskService from '@/services/api/customizeTaskService';
import nursingSpecialistService from '@/services/api/nursingSpecialistService';
import { FaUser, FaClipboardList, FaStethoscope } from 'react-icons/fa';

const NurseMedicalNoteTab = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notes, setNotes] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [careProfiles, setCareProfiles] = useState([]);
  const [customizeTasks, setCustomizeTasks] = useState([]);
  const [nursingSpecialists, setNursingSpecialists] = useState([]);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [detailNote, setDetailNote] = useState(null);
  const [editForm, setEditForm] = useState({ note: '', advice: '', image: '' });
  const [editLoading, setEditLoading] = useState(false);
  const [serviceTask, setServiceTask] = useState(null);

  // Fetch detail note
  useEffect(() => {
    const fetchDetail = async () => {
      if (!selectedNoteId) return;
      setEditLoading(true);
      try {
        const data = await medicalNoteService.getMedicalNoteById(selectedNoteId);
        setDetailNote(data);
        setEditForm({
          note: data.note || data.Note || '',
          advice: data.advice || data.Advice || '',
          image: data.image || data.Image || ''
        });
        let st = null;
        if (data.customizeTaskID || data.CustomizeTaskID) {
          const customizeTask = await customizeTaskService.getCustomizeTaskById(data.customizeTaskID || data.CustomizeTaskID);
          if (customizeTask?.serviceTaskID || customizeTask?.ServiceTaskID) {
            st = await serviceTaskService.getServiceTaskById(customizeTask.serviceTaskID || customizeTask.ServiceTaskID);
          }
        }
        setServiceTask(st);
      } catch (e) {
        setDetailNote(null);
        setServiceTask(null);
      } finally {
        setEditLoading(false);
      }
    };
    fetchDetail();
  }, [selectedNoteId]);

  // Fetch all data
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      try {
        const [notesRes, bookingsRes, careProfilesRes, customizeTasksRes, nursingSpecialistsRes] = await Promise.all([
          medicalNoteService.getAllMedicalNotes(),
          bookingService.getAllBookings(),
          careProfileService.getCareProfiles(),
          customizeTaskService.getAllCustomizeTasks(),
          nursingSpecialistService.getAllNursingSpecialists(),
        ]);
        let filteredNotes = Array.isArray(notesRes) ? notesRes : [];
        let myNursingID = null;
        if (user && user.accountID && nursingSpecialistsRes) {
          const me = nursingSpecialistsRes.find(s => (s.accountID || s.AccountID) === user.accountID);
          myNursingID = me?.nursingID || me?.NursingID || null;
        }
        if (myNursingID) {
          filteredNotes = filteredNotes.filter(n => (n.nursingID || n.NursingID) === myNursingID);
        }
        setNotes(filteredNotes);
        setBookings(Array.isArray(bookingsRes) ? bookingsRes : []);
        setCareProfiles(Array.isArray(careProfilesRes) ? careProfilesRes : []);
        setCustomizeTasks(Array.isArray(customizeTasksRes) ? customizeTasksRes : []);
        setNursingSpecialists(Array.isArray(nursingSpecialistsRes) ? nursingSpecialistsRes : []);
      } catch (e) {
        setError(e?.message || 'Không thể tải dữ liệu. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [user]);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Đang tải dữ liệu...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center h-64">
      <div className="text-center">
        <div className="text-red-500 mb-4">⚠️</div>
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          Thử lại
        </button>
      </div>
    </div>
  );

  const getRelatedInfo = (note) => {
    const booking = bookings.find(b => (b.bookingID || b.BookingID) === (note.bookingID || note.BookingID));
    const careProfile = careProfiles.find(p => (p.careProfileID || p.CareProfileID) === (note.careProfileID || note.CareProfileID));
    const customizeTask = customizeTasks.find(t => (t.customizeTaskID || t.CustomizeTaskID) === (note.customizeTaskID || note.CustomizeTaskID));
    const nurse = nursingSpecialists.find(n => (n.nursingID || n.NursingID) === (note.nursingID || note.NursingID));
    return { booking, careProfile, customizeTask, nurse };
  };

  return (
    <div>
      <h3 className="font-semibold text-lg mb-4">Danh sách ghi chú y tế</h3>
      {!notes.length ? (
        <div className="text-gray-500">Không có ghi chú y tế nào.</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {notes.map(note => {
            const { booking, careProfile, customizeTask, nurse } = getRelatedInfo(note);
            return (
              <div key={note.medicalNoteID || note.MedicalNoteID} className="bg-white rounded-lg p-4 shadow hover:shadow-lg transition relative">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-bold text-blue-700 text-lg truncate">{note.note || note.Note}</div>
                  <span className="text-xs text-gray-400">{note.createdAt ? new Date(note.createdAt).toLocaleString('vi-VN') : ''}</span>
                </div>
                <p className="text-gray-700 mb-2">{note.advice || note.Advice}</p>
                {note.image && <img src={note.image} alt="note" className="w-full h-40 object-cover rounded mb-2 hover:scale-105 transition" />}
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mt-2">
                  <div className="flex items-center gap-1"><FaClipboardList /> Đơn hàng: {booking ? `#${booking.bookingID || booking.BookingID}` : 'Không có'}</div>
                  <div className="flex items-center gap-1"><FaUser /> Khách hàng: {careProfile ? (careProfile.profileName || careProfile.ProfileName) : 'Không có'}</div>
                  <div className="flex items-center gap-1"><FaStethoscope /> Dịch vụ: {customizeTask ? (customizeTask.customizeTaskID || customizeTask.CustomizeTaskID) : 'Không có'}</div>
                  <div className="flex items-center gap-1"><FaUser /> Y tá: {nurse ? (nurse.fullName || nurse.FullName) : 'Không có'}</div>
                </div>
                <div className='flex justify-end mt-2'>
                  <button
                    className="flex items-center justify-center gap-2 px-5 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold rounded-full shadow-md hover:shadow-xl hover:scale-105 transition-all duration-200"
                    onClick={() => setSelectedNoteId(note.medicalNoteID || note.MedicalNoteID)}
                  >
                    Xem chi tiết
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal xem/sửa */}
      {selectedNoteId && detailNote && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <form
            className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg overflow-y-auto max-h-[90vh] relative"
            onSubmit={async e => {
              e.preventDefault();
              setEditLoading(true);
              try {
                await medicalNoteService.updateMedicalNote(selectedNoteId, {
                  ...detailNote,
                  note: editForm.note,
                  advice: editForm.advice,
                  image: editForm.image || ''
                });
                setSelectedNoteId(null);
                setDetailNote(null);
                setEditForm({ note: '', advice: '', image: '' });
                setServiceTask(null);
                setLoading(true);
                const notesRes = await medicalNoteService.getAllMedicalNotes();
                let filteredNotes = Array.isArray(notesRes) ? notesRes : [];
                let myNursingID = null;
                if (user && user.accountID && nursingSpecialists.length > 0) {
                  const me = nursingSpecialists.find(s => (s.accountID || s.AccountID) === user.accountID);
                  myNursingID = me?.nursingID || me?.NursingID || null;
                }
                if (myNursingID) {
                  filteredNotes = filteredNotes.filter(n => (n.nursingID || n.NursingID) === myNursingID);
                }
                setNotes(filteredNotes);
              } catch (err) {
                alert(err?.message || 'Cập nhật ghi chú thất bại');
              } finally {
                setEditLoading(false);
              }
            }}
          >
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
              onClick={() => { setSelectedNoteId(null); setDetailNote(null); setServiceTask(null); }}
              type="button"
              title="Đóng"
            >✕</button>
            <h4 className="text-xl font-bold mb-4 text-purple-700">Xem/Sửa ghi chú y tế</h4>
            <div className="mb-3 font-semibold">Tên dịch vụ: <span className="font-normal">{serviceTask ? (serviceTask.serviceTaskName || serviceTask.ServiceTaskName) : 'Không có'}</span></div>
            <div className="mb-3">
              <label className="font-semibold">Nội dung:</label>
              <textarea
                className="w-full border rounded px-2 py-1 mt-1"
                value={editForm.note}
                onChange={e => setEditForm(f => ({ ...f, note: e.target.value }))}
                required
              />
            </div>
            <div className="mb-3">
              <label className="font-semibold">Lời khuyên:</label>
              <textarea
                className="w-full border rounded px-2 py-1 mt-1"
                value={editForm.advice}
                onChange={e => setEditForm(f => ({ ...f, advice: e.target.value }))}
              />
            </div>
            <div className="mb-3">
              <label className="font-semibold">Ảnh (URL):</label>
              <input
                className="w-full border rounded px-2 py-1 mt-1"
                value={editForm.image}
                onChange={e => setEditForm(f => ({ ...f, image: e.target.value }))}
                placeholder="Nhập đường dẫn ảnh hoặc để trống"
              />
              {editForm.image && <img src={editForm.image} alt="note" className="w-24 h-24 object-cover rounded mt-2" />}
            </div>
            <button
              type="submit"
              className="mt-4 w-full py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:shadow-lg transition"
              disabled={editLoading}
            >
              {editLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default NurseMedicalNoteTab;
