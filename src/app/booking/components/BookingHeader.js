import { HiOutlineArrowLeft } from "react-icons/hi2";
import { useRouter } from "next/navigation";

export default function BookingHeader() {
  const router = useRouter();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 md:mb-8 gap-2 border-b pb-3 md:pb-4">
      <button
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 font-semibold shadow-sm transition"
        onClick={() => router.back()}
      >
        <HiOutlineArrowLeft className="text-xl" />
        <span>Quay lại</span>
      </button>
      <h1 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 text-center flex-1">
        Xác nhận đặt dịch vụ
      </h1>
    </div>
  );
} 