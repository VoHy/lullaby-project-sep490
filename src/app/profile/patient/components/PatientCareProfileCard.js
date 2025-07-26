import { FaPhone, FaMapMarkerAlt, FaStickyNote, FaUsers, FaPlus } from 'react-icons/fa';

export default function PatientCareProfileCard({ care, relativesList, zones, relFilter, setRelFilter, handleOpenForm }) {
  let rels = relativesList.filter(r => r.CareProfileID === care.CareProfileID);
  if (relFilter === 'active') rels = rels.filter(r => r.Status === 'active');
  if (relFilter === 'inactive') rels = rels.filter(r => r.Status === 'inactive');
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <img 
            src={care.Image || "/images/avatar1.jpg"} 
            alt={care.ProfileName} 
            className="w-16 h-16 rounded-full object-cover border-2 border-purple-200" 
          />
          <div>
            <h3 className="text-lg font-bold text-purple-700">{care.ProfileName}</h3>
            <p className="text-sm text-gray-500">{care.DateOfBirth || 'N/A'}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          care.Status === 'active' 
            ? 'bg-green-100 text-green-700' 
            : 'bg-red-100 text-red-700'
        }`}>
          {care.Status === 'active' ? 'Đang hoạt động' : 'Ngừng hoạt động'}
        </span>
      </div>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <FaPhone className="text-gray-400" />
          <span className="text-sm text-gray-600">{care.PhoneNumber || 'N/A'}</span>
        </div>
        <div className="flex items-center gap-3">
          <FaMapMarkerAlt className="text-gray-400" />
          <span className="text-sm text-gray-600">{care.Address || 'N/A'}</span>
        </div>
        <div className="flex items-center gap-3">
          <FaMapMarkerAlt className="text-gray-400" />
          <span className="text-sm text-gray-600">
            {(() => {
              const z = zones.find(z => z.ZoneID === care.ZoneDetailID);
              return z ? z.Zone_name : 'N/A';
            })()}
          </span>
        </div>
        {care.Notes && (
          <div className="flex items-start gap-3">
            <FaStickyNote className="text-gray-400 mt-1" />
            <span className="text-sm text-gray-600">{care.Notes}</span>
          </div>
        )}
      </div>
      {/* Relatives Section */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-semibold text-gray-800 flex items-center gap-2">
            <FaUsers className="text-purple-500" />
            Con cái ({rels.length})
          </h4>
          <div className="flex items-center gap-2">
            <label htmlFor={`relFilter-${care.CareProfileID}`} className="text-xs font-medium text-gray-700">Lọc:</label>
            <select
              id={`relFilter-${care.CareProfileID}`}
              value={relFilter}
              onChange={e => setRelFilter(e.target.value)}
              className="px-2 py-1 rounded border border-gray-300 text-xs focus:ring-2 focus:ring-purple-400 focus:border-purple-400 bg-white"
            >
              <option value="all">Tất cả</option>
              <option value="active">Hoạt động</option>
              <option value="inactive">Ngừng hoạt động</option>
            </select>
            <button
              onClick={() => handleOpenForm(null, care.CareProfileID)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-lg hover:shadow-lg transition-all flex items-center gap-2 text-xs"
            >
              <FaPlus className="text-xs" /> Thêm con
            </button>
          </div>
        </div>
        {rels.length === 0 ? (
          <p className="text-sm text-gray-500 italic">Chưa có người thân nào.</p>
        ) : (
          <div className="space-y-2">
            {rels.map(r => (
              <div key={r.RelativeID} className="bg-gray-50 rounded-lg p-3 flex items-center justify-between">
                <div>
                  <p className="font-medium text-purple-600">{r.Relative_Name}</p>
                  <p className="text-xs text-gray-500">{r.DateOfBirth || 'N/A'}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  r.Status === 'active' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {r.Status === 'active' ? 'Hoạt động' : 'Ngừng hoạt động'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 