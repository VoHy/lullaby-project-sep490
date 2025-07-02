"use client";
import { useParams } from "next/navigation";
import Link from "next/link";

const nurses = [
  { id: 1, name: "Nguyễn Thị A", specialty: "Chăm sóc người cao tuổi", experience: 5, image: "/images/service-elderly.jpg" },
  { id: 2, name: "Trần Văn B", specialty: "Phục hồi chức năng", experience: 3, image: "/images/hero-bg.jpg" },
  { id: 3, name: "Lê Thị C", specialty: "Chăm sóc sau phẫu thuật", experience: 4, image: "/images/service-elderly.jpg" },
];

export default function NurseDetailPage() {
  const { id } = useParams();
  const nurse = nurses.find((n) => n.id === Number(id));

  if (!nurse) return <div className="p-8">Không tìm thấy y tá.</div>;

  return (
    <div className="p-8 max-w-xl mx-auto">
      <img src={nurse.image} alt={nurse.name} className="w-40 h-40 object-cover rounded-full mx-auto mb-6 border-4 border-rose-200" />
      <h1 className="text-3xl font-bold text-center text-rose-700 mb-2">{nurse.name}</h1>
      <p className="text-center text-rose-500 font-medium mb-2">{nurse.specialty}</p>
      <p className="text-center text-gray-500 mb-4">Kinh nghiệm: <span className="font-semibold text-gray-700">{nurse.experience} năm</span></p>
      <div className="text-center text-gray-600">Thông tin chi tiết về y tá sẽ được cập nhật sau.</div>
      <div className="text-center mt-6">
        <Link href={`/booking?name=${encodeURIComponent(nurse.name)}`} className="inline-block px-6 py-3 rounded-full bg-rose-500 text-white font-bold shadow hover:bg-rose-600 transition">
          Đặt lịch với y tá này
        </Link>
      </div>
    </div>
  );
} 