import { HiOutlineCalendar, HiOutlineDocumentText } from "react-icons/hi2";
import CareProfileSelector from './CareProfileSelector';

export default function BookingForm({ 
  datetime, 
  setDatetime, 
  note, 
  setNote, 
  isDatetimeValid, 
  error, 
  handlePayment,
  careProfiles,
  selectedCareProfile,
  setSelectedCareProfile,
  careProfileError,
  isProcessingPayment
}) {
  return (
    <div className="flex flex-col gap-4">
      {/* Chọn hồ sơ người thân */}
      <CareProfileSelector
        careProfiles={careProfiles}
        selectedCareProfile={selectedCareProfile}
        setSelectedCareProfile={setSelectedCareProfile}
        error={careProfileError}
      />

      <section className="border rounded-2xl p-4 md:p-6 bg-white flex flex-col gap-2">
        <label className="block font-semibold mb-1 flex items-center gap-2">
          <HiOutlineCalendar />
          Chọn ngày giờ đặt dịch vụ <span className="text-red-500">*</span>
        </label>
        <input
          type="datetime-local"
          className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-pink-300 text-base shadow-sm"
          value={datetime}
          onChange={(e) => setDatetime(e.target.value)}
          min={new Date(Date.now() + 30 * 60 * 1000).toISOString().slice(0, 16)}
          autoFocus
        />
        {!isDatetimeValid && datetime && (
          <div className="text-red-500 text-sm mt-1">
            Thời gian phải cách hiện tại ít nhất 30 phút
          </div>
        )}
      </section>

      {/* Ghi chú */}
      <section className="border rounded-2xl p-4 md:p-6 bg-white">
        <label className="block font-semibold mb-1 flex items-center gap-2">
          <HiOutlineDocumentText />
          Ghi chú
        </label>
        <textarea
          className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-pink-300 text-base shadow-sm"
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Nhập ghi chú nếu có..."
        />
      </section>

      {error && (
        <div className="text-red-500 mb-2 font-semibold animate-shake">{error}</div>
      )}

      <button
        className="w-full py-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-extrabold text-lg shadow-lg hover:scale-105 hover:shadow-xl transition mt-1 disabled:opacity-60"
        onClick={handlePayment}
        disabled={!isDatetimeValid || !selectedCareProfile || isProcessingPayment}
      >
        {isProcessingPayment ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Đang xử lý...
          </div>
        ) : (
          'Thanh toán'
        )}
      </button>
    </div>
  );
} 