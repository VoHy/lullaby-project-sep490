"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const nurses = [
  { id: 1, name: "Nguyễn Thị A", specialty: "Chăm sóc người cao tuổi", experience: 5, image: "/images/service-elderly.jpg" },
  { id: 2, name: "Trần Văn B", specialty: "Phục hồi chức năng", experience: 3, image: "/images/hero-bg.jpg" },
  { id: 3, name: "Lê Thị C", specialty: "Chăm sóc sau phẫu thuật", experience: 4, image: "/images/service-elderly.jpg" },
];

export default function NursePage() {
  return (
    <motion.div
      className="p-8 bg-gradient-to-br from-pink-50 to-rose-100 min-h-screen"
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: 0.18
          }
        }
      }}
    >
      <motion.h1
        className="text-4xl font-extrabold mb-10 text-center text-rose-600 drop-shadow-lg"
        variants={{ hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } } }}
      >
        Đội ngũ Y tá chuyên nghiệp
      </motion.h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {nurses.map((nurse) => (
          <motion.div
            key={nurse.id}
            className="bg-white rounded-2xl shadow-xl border border-rose-200 hover:border-rose-400 transition p-6 flex flex-col items-center group hover:scale-105 duration-300"
            variants={{ hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } } }}
          >
            <div className="w-28 h-28 relative mb-4">
              <Image
                src={nurse.image}
                alt={nurse.name}
                fill
                className="object-cover rounded-full border-4 border-rose-200 group-hover:border-rose-400 transition"
                sizes="112px"
                priority
              />
            </div>
            <h2 className="text-2xl font-bold text-rose-700 mb-1">{nurse.name}</h2>
            <p className="text-rose-500 font-medium mb-2">{nurse.specialty}</p>
            <p className="text-gray-500 mb-4">Kinh nghiệm: <span className="font-semibold text-gray-700">{nurse.experience} năm</span></p>
            <button className="mt-auto px-5 py-2 rounded-full bg-rose-100 text-rose-700 font-semibold shadow hover:bg-rose-200 transition">
              <Link href={`/nurse/${nurse.id}`} className="block w-full h-full">Xem chi tiết</Link>
            </button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
} 