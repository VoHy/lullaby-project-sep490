import React, { useState, useEffect } from 'react';
import { FaTimes, FaStickyNote, FaCalendarAlt, FaUser, FaUserNurse, FaImage, FaLightbulb } from 'react-icons/fa';
import { medicalNoteService, nursingSpecialistService, relativesService } from '@/services/api';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function MedicalNotesModal({ open, onClose, careProfile }) {
  const [medicalNotes, setMedicalNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [nursingNames, setNursingNames] = useState({});
  const [relativeNames, setRelativeNames] = useState({});

  useEffect(() => {
    if (open && careProfile) {
      loadMedicalNotes();
    } else if (!open) {
      // Reset states when modal closes
      setMedicalNotes([]);
      setNursingNames({});
      setRelativeNames({});
      setError('');
    }
  }, [open, careProfile]);

  const loadMedicalNotes = async () => {
    if (!careProfile) return;

    setLoading(true);
    setError('');

    try {
      const careProfileId = careProfile.careProfileID || careProfile.CareProfileID;
      const data = await medicalNoteService.getMedicalNotesByCareProfile(careProfileId);
      const notes = Array.isArray(data) ? data : [];
      setMedicalNotes(notes);

      // Load names for nursing specialists and relatives
      await loadNames(notes);
    } catch (err) {
      setError('Không thể tải hồ sơ y tế. Vui lòng thử lại.');
      console.error('Error loading medical notes:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadNames = async (notes) => {
    const nursingIds = [...new Set(notes.map(note => note.nursingID).filter(id => id))];
    const relativeIds = [...new Set(notes.map(note => note.relativeID).filter(id => id))];

    // Load nursing specialist names
    const nursingPromises = nursingIds.map(async (id) => {
      try {
        const nursing = await nursingSpecialistService.getNursingSpecialistById(id);
        return { id, name: nursing?.fullName || nursing?.name || `Nurse ${id}` };
      } catch (err) {
        console.error(`Error loading nursing specialist ${id}:`, err);
        return { id, name: `Nurse ${id}` };
      }
    });

    // Load relative names
    const relativePromises = relativeIds.map(async (id) => {
      try {
        const relative = await relativesService.getRelativeById(id);
        return { id, name: relative?.relativeName || `Relative ${id}` };
      } catch (err) {
        console.error(`Error loading relative ${id}:`, err);
        return { id, name: `Relative ${id}` };
      }
    });

    try {
      const [nursingResults, relativeResults] = await Promise.all([
        Promise.all(nursingPromises),
        Promise.all(relativePromises)
      ]);

      const nursingNameMap = {};
      nursingResults.forEach(({ id, name }) => {
        nursingNameMap[id] = name;
      });

      const relativeNameMap = {};
      relativeResults.forEach(({ id, name }) => {
        relativeNameMap[id] = name;
      });

      setNursingNames(nursingNameMap);
      setRelativeNames(relativeNameMap);
    } catch (err) {
      console.error('Error loading names:', err);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <div className="flex items-center gap-3">
            <FaStickyNote className="text-xl" />
            <h2 className="text-xl font-bold">
              Hồ sơ y tế - {careProfile?.profileName || careProfile?.ProfileName || 'N/A'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-500 mb-4">
                <FaStickyNote className="text-4xl mx-auto mb-2" />
                <p className="text-lg font-medium">{error}</p>
              </div>
              <button
                onClick={loadMedicalNotes}
                className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition-colors"
              >
                Thử lại
              </button>
            </div>
          ) : medicalNotes.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <FaStickyNote className="text-6xl mx-auto mb-4" />
                <p className="text-lg font-medium">Chưa có hồ sơ y tế nào</p>
                <p className="text-sm text-gray-500">Hồ sơ y tế sẽ xuất hiện sau khi có dịch vụ chăm sóc</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {medicalNotes.map((note, index) => (
                <div
                  key={note.medicalNoteID || index}
                  className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Left Column - Basic Info */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FaCalendarAlt className="text-purple-500" />
                        <span className="font-medium">Ngày tạo:</span>
                        <span>{formatDate(note.createdAt)}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FaUserNurse className="text-blue-500" />
                        <span className="font-medium">Điều dưỡng viên:</span>
                        <span>{nursingNames[note.nursingID] || note.nursingID || 'N/A'}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FaUser className="text-green-500"/>
                          <span className="font-medium">Họ và tên: </span>
                          <span>{note.relativeID ? (relativeNames[note.relativeID] || note.relativeID || 'N/A') : careProfile?.ProfileName || careProfile?.profileName || 'N/A'}</span>
                      </div>
                    </div>

                    {/* Right Column - Content */}
                    <div className="space-y-4">
                      {note.note && (
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                            <FaStickyNote className="text-purple-500" />
                            Ghi chú
                          </h4>
                          <p className="text-gray-700 bg-white p-3 rounded border text-sm leading-relaxed">
                            {note.note}
                          </p>
                        </div>
                      )}

                      {note.advice && (
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                            <FaLightbulb className="text-yellow-500" />
                            Lời khuyên
                          </h4>
                          <p className="text-gray-700 bg-white p-3 rounded border text-sm leading-relaxed">
                            {note.advice}
                          </p>
                        </div>
                      )}

                      {note.image && (
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                            <FaImage className="text-blue-500" />
                            Hình ảnh
                          </h4>
                          <div className="bg-white p-3 rounded border">
                            <img
                              src={note.image}
                              alt="Medical note image"
                              className="max-w-full h-auto rounded border"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Đóng
          </button>
          <button
            onClick={loadMedicalNotes}
            className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            Làm mới
          </button>
        </div>
      </div>
    </div>
  );
}
