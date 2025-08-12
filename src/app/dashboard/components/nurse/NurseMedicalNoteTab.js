import React, { useState, useEffect, useContext, useMemo } from 'react';
import { AuthContext } from '@/context/AuthContext';
import careProfileService from '@/services/api/careProfileService';
import bookingService from '@/services/api/bookingService';
import customizeTaskService from '@/services/api/customizeTaskService';
import serviceTaskService from '@/services/api/serviceTaskService';
import customizePackageService from '@/services/api/customizePackageService';
import medicalNoteService from '@/services/api/medicalNoteService';
import nursingSpecialistService from '@/services/api/nursingSpecialistService';

const NurseMedicalNoteTab = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notes, setNotes] = useState([]);
  const [careProfiles, setCareProfiles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [customizeTasks, setCustomizeTasks] = useState([]);
  const [serviceTasks, setServiceTasks] = useState([]);
  const [customizePackages, setCustomizePackages] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [form, setForm] = useState({ Note: '', Advice: '', Image: '' });

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        // resolve nursing id (may use later for filtering)
        let nursingID = null;
        if (user?.accountID) {
          try {
            const specialists = await nursingSpecialistService.getAllNursingSpecialists();
            const me = specialists.find(s => (s.accountID || s.AccountID) === (user.accountID || user.AccountID));
            nursingID = me?.nursingID || me?.NursingID || null;
          } catch {}
        }

        const [cps, allBookings, cts, sts, pkgs, allNotes] = await Promise.all([
          careProfileService.getCareProfiles(),
          bookingService.getAllBookings(),
          customizeTaskService.getAllCustomizeTasks(),
          serviceTaskService.getServiceTasks(),
          customizePackageService.getAllCustomizePackages?.() || Promise.resolve([]),
          medicalNoteService.getAllMedicalNotes(),
        ]);

        // If we know the nurse, keep only notes for patients who have bookings with this nurse
        let filteredNotes = allNotes || [];
        if (nursingID) {
          const myBookingIds = new Set((cts || []).filter(t => (t.nursingID || t.NursingID) === nursingID).map(t => t.bookingID || t.BookingID));
          const myCareProfileIds = new Set((allBookings || [])
            .filter(b => myBookingIds.has(b.bookingID || b.BookingID))
            .map(b => b.careProfileID || b.CareProfileID));
          filteredNotes = (allNotes || []).filter(n => myCareProfileIds.has(n.careProfileID || n.CareProfileID));
        }

        setCareProfiles(Array.isArray(cps) ? cps : []);
        setBookings(Array.isArray(allBookings) ? allBookings : []);
        setCustomizeTasks(Array.isArray(cts) ? cts : []);
        setServiceTasks(Array.isArray(sts) ? sts : []);
        setCustomizePackages(Array.isArray(pkgs) ? pkgs : []);
        setNotes(Array.isArray(filteredNotes) ? filteredNotes : []);
      } catch (e) {
        setError(e?.message || 'Không thể tải dữ liệu. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const findBookingForNote = (note) => {
    const cpId = note.careProfileID || note.CareProfileID;
    const related = (bookings || []).filter(b => (b.careProfileID || b.CareProfileID) === cpId);
    if (related.length === 0) return null;
    // nearest by created time if available
    const created = new Date(note.createdAt || note.CreatedAt || note.updatedAt || note.UpdatedAt || Date.now());
    return related.sort((a, b) => Math.abs(created - new Date(a.workDate || a.workdate || a.WorkDate || a.AppointmentDate || 0)) - Math.abs(created - new Date(b.workDate || b.workdate || b.WorkDate || b.AppointmentDate || 0)))[0];
  };

  const findServiceTaskForNote = (note, booking) => {
    if (!booking) return null;
    const bId = booking.bookingID || booking.BookingID;
    const cpId = note.careProfileID || note.CareProfileID;
    const task = (customizeTasks || []).find(t => (t.bookingID || t.BookingID) === bId && (t.careProfileID || t.CareProfileID) === cpId);
    if (!task) return null;
    return (serviceTasks || []).find(st => (st.serviceTaskID || st.ServiceTaskID) === (task.serviceTaskID || task.ServiceTaskID));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
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
  }

  // Lọc customizeTasks có status completed, có booking, careProfile và nursingID trùng với user.accountID
  let myNursingID = null;
  if (user?.accountID) {
    // Tìm nursingID của chuyên gia đang đăng nhập
    const specialists = Array.isArray(customizeTasks) ? customizeTasks : [];
    // Nếu customizeTasks không chứa nursingID, có thể lấy từ bookings hoặc context khác
    // Tuy nhiên, nursingID đã được lấy ở useEffect, nên dùng lại logic đó
    // Để chắc chắn, lấy từ các customizeTasks
    myNursingID = (Array.isArray(customizeTasks) ? customizeTasks : []).find(t => (t.nursingID || t.NursingID) === (user.accountID || user.AccountID))?.nursingID || user.accountID;
  }
  const completedTasks = (customizeTasks || []).filter(t => t.status === 'completed' && (t.nursingID || t.NursingID) === myNursingID);
  const validGroups = completedTasks.map(task => {
    const booking = (bookings || []).find(b => (b.bookingID || b.BookingID) === (task.bookingID || task.BookingID));
    const careProfile = (careProfiles || []).find(p => (p.careProfileID || p.CareProfileID) === (booking?.careProfileID || booking?.CareProfileID));
    return booking && careProfile ? { task, booking, careProfile } : null;
  }).filter(Boolean);

  return (
    <div>
      <h3 className="font-semibold text-lg mb-4">Thêm ghi chú y tế cho các nhiệm vụ đã hoàn thành</h3>
      {validGroups.length === 0 && (
        <div className="text-gray-500">Không có nhiệm vụ hoàn thành nào để ghi chú.</div>
      )}
      <div className="space-y-6">
        {validGroups.map(({ task, booking, careProfile }) => (
          <div key={task.customizeTaskID || task.CustomizeTaskID} className="p-4 bg-blue-50 rounded shadow">
            <div className="mb-2 font-bold text-blue-700">Bệnh nhân: {careProfile.profileName || careProfile.ProfileName}</div>
            <div className="mb-2">Booking: #{booking.bookingID || booking.BookingID} ({booking.workdate ? new Date(booking.workdate).toLocaleString('vi-VN') : '-'})</div>
            <div className="mb-2">CustomizeTaskID: {task.customizeTaskID || task.CustomizeTaskID}</div>
            <div className="mb-2">Trạng thái: <span className="text-green-600 font-semibold">{task.status}</span></div>
            <button
              className="mb-2 px-4 py-2 rounded bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold"
              onClick={() => setSelectedTask(task)}
            >
              Thêm ghi chú
            </button>
            {/* Hiển thị các ghi chú y tế đã có cho customizeTask này, chỉ của chuyên gia đang đăng nhập */}
            <div className="mt-2">
              {(notes || []).filter(n => (n.customizeTaskID || n.CustomizeTaskID) === (task.customizeTaskID || task.CustomizeTaskID)).map(note => (
                <div key={note.medicalNoteID || note.MedicalNoteID} className="p-2 bg-white rounded mb-2 border">
                  <div className="font-semibold">{note.note || note.Note}</div>
                  <div className="text-sm text-gray-600">{note.advice || note.Advice}</div>
                  {note.image && <img src={note.image} alt="note" className="w-16 h-16 object-cover rounded mt-1" />}
                  <div className="text-xs text-gray-400">{note.createdAt ? new Date(note.createdAt).toLocaleString('vi-VN') : ''}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Form thêm ghi chú cho customizeTask đã chọn */}
      {selectedTask && (() => {
        const booking = (bookings || []).find(b => (b.bookingID || b.BookingID) === (selectedTask.bookingID || selectedTask.BookingID));
        const careProfile = (careProfiles || []).find(p => (p.careProfileID || p.CareProfileID) === (booking?.careProfileID || booking?.CareProfileID));
        return (
          <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
            <form
              className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative"
              onSubmit={async e => {
                e.preventDefault();
                try {
                  const payload = {
                    customizeTaskID: selectedTask.customizeTaskID || selectedTask.CustomizeTaskID,
                    note: form.Note,
                    advice: form.Advice,
                    image: form.Image || '',
                    relativeID: careProfile.relativeID || careProfile.RelativeID || 0
                  };
                  const created = await medicalNoteService.createMedicalNote(payload);
                  setNotes(prev => [...prev, created]);
                  setSelectedTask(null);
                  setForm({ Note: '', Advice: '', Image: '' });
                } catch (err) {
                  alert(err?.message || 'Thêm ghi chú thất bại');
                }
              }}
            >
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
                onClick={() => setSelectedTask(null)}
                type="button"
                title="Đóng"
              >✕</button>
              <h4 className="text-xl font-bold mb-4 text-purple-700">Thêm ghi chú y tế</h4>
              <div className="mb-2"><span className="font-semibold">Bệnh nhân:</span> {careProfile.profileName || careProfile.ProfileName}</div>
              <div className="mb-2"><span className="font-semibold">Booking:</span> #{booking.bookingID || booking.BookingID}</div>
              <div className="mb-2"><span className="font-semibold">CustomizeTaskID:</span> {selectedTask.customizeTaskID || selectedTask.CustomizeTaskID}</div>
              <div className="mb-2">
                <label className="font-semibold">Nội dung:</label>
                <textarea
                  className="w-full border rounded px-2 py-1"
                  value={form.Note}
                  onChange={e => setForm(f => ({ ...f, Note: e.target.value }))}
                  required
                />
              </div>
              <div className="mb-2">
                <label className="font-semibold">Lời khuyên:</label>
                <textarea
                  className="w-full border rounded px-2 py-1"
                  value={form.Advice}
                  onChange={e => setForm(f => ({ ...f, Advice: e.target.value }))}
                />
              </div>
              <div className="mb-2">
                <label className="font-semibold">Ảnh (URL):</label>
                <input
                  className="w-full border rounded px-2 py-1"
                  value={form.Image}
                  onChange={e => setForm(f => ({ ...f, Image: e.target.value }))}
                  placeholder="Nhập đường dẫn ảnh hoặc để trống"
                />
              </div>
              <button
                type="submit"
                className="mt-4 px-6 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:shadow-lg"
              >
                Thêm ghi chú
              </button>
            </form>
          </div>
        );
      })()}
    </div>
  );
};

export default NurseMedicalNoteTab; 