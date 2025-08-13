import React, { useState, useEffect, useContext, useMemo } from 'react';
import { AuthContext } from '@/context/AuthContext';
import serviceTaskService from '@/services/api/serviceTaskService';
import medicalNoteService from '@/services/api/medicalNoteService';
import bookingService from '@/services/api/bookingService';
import careProfileService from '@/services/api/careProfileService';
import customizeTaskService from '@/services/api/customizeTaskService';
import nursingSpecialistService from '@/services/api/nursingSpecialistService';
import { FaUser, FaClipboardList, FaStethoscope, FaPhone, FaMapMarkerAlt, FaSearch } from 'react-icons/fa';

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
  const [serviceTask, setServiceTask] = useState(null);

  const [editForm, setEditForm] = useState({ note: '', advice: '', image: '' });
  const [editLoading, setEditLoading] = useState(false);

  // Search state
  const [search, setSearch] = useState('');

  // helpers
  const normalizeArray = (res) => {
    if (!res) return [];
    if (Array.isArray(res)) return res;
    if (res.data && Array.isArray(res.data)) return res.data;
    return [];
  };

  const firstId = (obj) => {
    if (!obj) return null;
    return (
      obj.bookingID ?? obj.BookingID ??
      obj.bookingId ?? obj.BookingId ??
      obj.id ?? obj.Id ?? null
    );
  };

  // fetch all relevant data once (notes, bookings, customizeTasks, careProfiles, nursingSpecialists)
  useEffect(() => {
    let mounted = true;
    const loadAll = async () => {
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

        if (!mounted) return;

        const notesArr = normalizeArray(notesRes);
        const bookingsArr = normalizeArray(bookingsRes);
        const careProfilesArr = normalizeArray(careProfilesRes);
        const customizeTasksArr = normalizeArray(customizeTasksRes);
        const nursingSpecialistsArr = normalizeArray(nursingSpecialistsRes);

        // if we can resolve current nurse's nursingID from nursingSpecialists, filter notes to theirs
        let myNursingID = null;
        if (user && user.accountID && nursingSpecialistsArr.length > 0) {
          const me = nursingSpecialistsArr.find(s => String(s.accountID ?? s.AccountID) === String(user.accountID));
          myNursingID = me?.nursingID ?? me?.NursingID ?? me?.nursingId ?? null;
        }

        const filteredNotes = myNursingID ? notesArr.filter(n => String(n.nursingID ?? n.NursingID ?? '') === String(myNursingID)) : notesArr;

        setNotes(filteredNotes);
        setBookings(bookingsArr);
        setCareProfiles(careProfilesArr);
        setCustomizeTasks(customizeTasksArr);
        setNursingSpecialists(nursingSpecialistsArr);
      } catch (e) {
        if (!mounted) return;
        setError(e?.message || 'Không thể tải dữ liệu');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadAll();
    return () => { mounted = false; };
  }, [user]);

  // build quick lookup maps (memoized)
  const bookingsById = useMemo(() => {
    const map = new Map();
    for (const b of bookings) {
      const id = firstId(b);
      if (id != null) map.set(String(id), b);
    }
    return map;
  }, [bookings]);

  const customizeById = useMemo(() => {
    const map = new Map();
    for (const ct of customizeTasks) {
      const id = ct.customizeTaskID ?? ct.CustomizeTaskID ?? ct.customizeTaskId ?? ct.Id ?? ct.id;
      if (id != null) map.set(String(id), ct);
    }
    return map;
  }, [customizeTasks]);

  // resolve related info for a note (prefer customizeTask -> booking)
  const getRelatedInfo = (note) => {
    let booking = null;
    let customizeTask = null;

    const noteCustomizeId = note.customizeTaskID ?? note.CustomizeTaskID ?? note.customizeTaskId ?? null;
    if (noteCustomizeId != null) {
      customizeTask = customizeById.get(String(noteCustomizeId)) ?? null;
      if (customizeTask) {
        const bkId = firstId(customizeTask);
        if (bkId != null) {
          booking = bookingsById.get(String(bkId)) ?? null;
        }
      }
    }

    // direct booking id on note (fallback)
    if (!booking) {
      const noteBookingId = note.bookingID ?? note.BookingID ?? note.bookingId ?? note.BookingId ?? note.booking ?? note.id ?? null;
      if (noteBookingId != null) booking = bookingsById.get(String(noteBookingId)) ?? null;
    }

    // careProfile and nurse resolution (simple direct lookups)
    const careProfileId = note.careProfileID ?? note.CareProfileID ?? note.careProfileId ?? note.CareProfileId ?? null;
    const careProfile = careProfiles.find(p => {
      const pid = p.careProfileID ?? p.CareProfileID ?? p.careProfileId ?? p.CareProfileId ?? p.id ?? p.Id;
      return pid != null && String(pid) === String(careProfileId);
    }) ?? null;

    const nurseId = note.nursingID ?? note.NursingID ?? note.nursingId ?? note.NursingId ?? null;
    const nurse = nursingSpecialists.find(n => {
      const nid = n.nursingID ?? n.NursingID ?? n.nursingId ?? n.Id ?? n.id;
      return nid != null && String(nid) === String(nurseId);
    }) ?? null;

    return { booking, careProfile, customizeTask, nurse };
  };

  // open detail modal: load detail note and serviceTask if needed
  useEffect(() => {
    let mounted = true;
    const loadDetail = async () => {
      if (!selectedNoteId) {
        setDetailNote(null);
        setServiceTask(null);
        setEditForm({ note: '', advice: '', image: '' });
        return;
      }
      setEditLoading(true);
      try {
        const data = await medicalNoteService.getMedicalNoteById(selectedNoteId);
        if (!mounted) return;
        setDetailNote(data);
        setEditForm({
          note: data.note ?? data.Note ?? '',
          advice: data.advice ?? data.Advice ?? '',
          image: data.image ?? data.Image ?? ''
        });

        const customizeTaskId = data.customizeTaskID ?? data.CustomizeTaskID ?? data.customizeTaskId ?? null;
        if (customizeTaskId) {
          // either use already-fetched customizeTasks or fetch one-by-one
          const ct = customizeById.get(String(customizeTaskId)) ?? await customizeTaskService.getCustomizeTaskById(customizeTaskId);
          const serviceTaskId = ct?.serviceTaskID ?? ct?.ServiceTaskID ?? ct?.serviceTaskId ?? null;
          if (serviceTaskId) {
            const st = await serviceTaskService.getServiceTaskById(serviceTaskId);
            if (!mounted) return;
            setServiceTask(st);
          } else {
            setServiceTask(null);
          }
        } else {
          setServiceTask(null);
        }
      } catch (e) {
        if (!mounted) return;
        setDetailNote(null);
        setServiceTask(null);
      } finally {
        if (mounted) setEditLoading(false);
      }
    };

    loadDetail();
    return () => { mounted = false; };
  }, [selectedNoteId, customizeById]);

  // update note handler - only allow if current user owns note
  const handleUpdateNote = async (e) => {
    e.preventDefault();
    if (!detailNote?.medicalNoteID && !detailNote?.MedicalNoteID) return;

    const noteOwnerId = detailNote.nursingID ?? detailNote.NursingID ?? detailNote.nursingId ?? null;
    const myNursingID = (() => {
      const me = nursingSpecialists.find(s => String(s.accountID ?? s.AccountID) === String(user?.accountID));
      return me?.nursingID ?? me?.NursingID ?? me?.nursingId ?? null;
    })();

    if (!myNursingID || String(myNursingID) !== String(noteOwnerId)) {
      alert('Bạn không có quyền sửa ghi chú này.');
      return;
    }

    setEditLoading(true);
    try {
      const id = detailNote.medicalNoteID ?? detailNote.MedicalNoteID;
      const payload = {
        ...detailNote,
        note: editForm.note,
        advice: editForm.advice,
        image: editForm.image ?? ''
      };
      const updated = await medicalNoteService.updateMedicalNote(id, payload);

      // optimistic local update: replace in notes
      setNotes(prev => prev.map(n => {
        const nid = n.medicalNoteID ?? n.MedicalNoteID;
        if (String(nid) === String(id)) {
          return { ...n, ...payload, ...updated };
        }
        return n;
      }));

      setSelectedNoteId(null);
      setDetailNote(null);
      setServiceTask(null);
      setEditForm({ note: '', advice: '', image: '' });
    } catch (err) {
      alert(err?.message || 'Cập nhật ghi chú thất bại');
    } finally {
      setEditLoading(false);
    }
  };

  // FILTERED NOTES WITH SEARCH
  const filteredNotes = useMemo(() => {
    if (!search.trim()) return notes;
    const lower = search.trim().toLowerCase();

    return notes.filter(note => {
      const { booking, careProfile } = getRelatedInfo(note);

      // Tên khách hàng
      const name = careProfile ? (careProfile.profileName ?? careProfile.ProfileName ?? '') : '';
      // Số điện thoại
      const phone = careProfile ? (careProfile.phoneNumber ?? careProfile.PhoneNumber ?? '') : '';
      // Địa chỉ
      const address = careProfile ? (careProfile.address ?? careProfile.Address ?? '') : '';
      // BookingID
      const bookingId = booking ? String(firstId(booking) ?? '') : '';

      // Ghép lại tất cả trường cần search
      const searchFields = [
        name,
        phone,
        address,
        bookingId
      ].join(' ').toLowerCase();

      return searchFields.includes(lower);
    });
  // eslint-disable-next-line
  }, [search, notes, bookings, careProfiles, customizeTasks, nursingSpecialists]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4" />
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-red-600 mb-3">Có lỗi: {error}</div>
        <button className="px-4 py-2 bg-purple-600 text-white rounded" onClick={() => window.location.reload()}>Tải lại</button>
      </div>
    );
  }

  return (
    <div>
      <h3 className="font-semibold text-lg mb-4">Danh sách ghi chú y tế</h3>

      {/* Search box */}
      <div className="mb-4 flex items-center max-w-md">
        <div className="relative w-full">
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-400"
            placeholder="Tìm kiếm theo tên, số điện thoại, địa chỉ, mã đơn hàng..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {filteredNotes.length === 0 ? (
        <div className="text-gray-500">Không có ghi chú y tế nào.</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filteredNotes.map(note => {
            const { booking, careProfile, customizeTask, nurse } = getRelatedInfo(note);
            const noteKey = note.medicalNoteID ?? note.MedicalNoteID ?? note.id ?? note.Id ?? Math.random();
            const bookingDisplayId = booking ? (firstId(booking) ?? '') : '';

            const noteOwnerId = note.nursingID ?? note.NursingID ?? note.nursingId ?? null;
            const me = nursingSpecialists.find(s => String(s.accountID ?? s.AccountID) === String(user?.accountID));
            const myNursingID = me?.nursingID ?? me?.NursingID ?? me?.nursingId ?? null;
            const canEdit = myNursingID && String(myNursingID) === String(noteOwnerId);

            return (
              <div key={noteKey} className="bg-white rounded-lg p-4 shadow hover:shadow-lg transition relative">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-bold text-blue-700 text-lg truncate">{note.note ?? note.Note}</div>
                  <span className="text-xs text-gray-400">{note.createdAt ? new Date(note.createdAt).toLocaleString('vi-VN') : ''}</span>
                </div>

                <p className="text-gray-700 mb-2">{note.advice ?? note.Advice}</p>
                {note.image && <img src={note.image} alt="note" className="w-full h-40 object-cover rounded mb-2" />}

                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mt-2">
                  <div className="flex items-center gap-1">
                    <FaClipboardList />
                    Đơn hàng: {booking ? `#${bookingDisplayId}` : 'Không có'}
                  </div>
                  <div className="flex items-center gap-1">
                    <FaUser />
                    Y tá: {nurse ? (nurse.fullName ?? nurse.FullName) : 'Không có'}
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex items-center gap-2">
                      <FaUser className="text-gray-500" />
                      <span className="font-medium">Khách hàng:</span>
                      <span className="truncate">{careProfile ? (careProfile.profileName ?? careProfile.ProfileName) : 'Không có'}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <FaPhone className="text-gray-500" />
                      <span className="truncate">{careProfile ? (careProfile.phoneNumber ?? careProfile.PhoneNumber) : 'Không có'}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <FaMapMarkerAlt className="text-gray-500" />
                      <span className="truncate">{careProfile ? (careProfile.address ?? careProfile.Address) : 'Không có'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <FaStethoscope />
                    Dịch vụ: {customizeTask ? (customizeTask.customizeTaskID ?? customizeTask.CustomizeTaskID ?? customizeTask.customizeTaskId ?? customizeTask.Id) : 'Không có'}
                  </div>
                </div>

                <div className="flex justify-end mt-2">
                  <button
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-full text-sm"
                    onClick={() => setSelectedNoteId(note.medicalNoteID ?? note.MedicalNoteID ?? note.id ?? note.Id)}
                  >
                    Xem chi tiết
                  </button>
                  {canEdit ? null : <div className="ml-3 text-xs text-gray-400 self-center">Chỉ owner có thể sửa</div>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit modal */}
      {selectedNoteId && detailNote && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <form
            className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg overflow-y-auto max-h-[90vh] relative"
            onSubmit={handleUpdateNote}
          >
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
              onClick={() => { setSelectedNoteId(null); setDetailNote(null); setServiceTask(null); }}
              type="button"
              title="Đóng"
            >
              ✕
            </button>

            <h4 className="text-xl font-bold mb-4 text-purple-700">Xem / Sửa ghi chú y tế</h4>

            <div className="mb-3">
              <label className="font-semibold">Nội dung:</label>
              <textarea
                className="w-full border rounded px-2 py-1 mt-1"
                value={editForm.note}
                onChange={(e) => setEditForm(f => ({ ...f, note: e.target.value }))}
                required
              />
            </div>

            <div className="mb-3">
              <label className="font-semibold">Lời khuyên:</label>
              <textarea
                className="w-full border rounded px-2 py-1 mt-1"
                value={editForm.advice}
                onChange={(e) => setEditForm(f => ({ ...f, advice: e.target.value }))}
              />
            </div>

            <div className="mb-3">
              <label className="font-semibold">Ảnh (URL):</label>
              <input
                className="w-full border rounded px-2 py-1 mt-1"
                value={editForm.image}
                onChange={(e) => setEditForm(f => ({ ...f, image: e.target.value }))}
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
