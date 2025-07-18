'use client';

import { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import nursingSpecialistService from '@/services/nurse/nursingSpecialistService';

export default function TeamPage() {
  const [nursingSpecialists, setNursingSpecialists] = useState([]);

  useEffect(() => {
    nursingSpecialistService.getNursingSpecialists().then(setNursingSpecialists);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Đội ngũ Y tá & Chuyên gia</h1>
        <p className="text-gray-600 mb-8">Danh sách đội ngũ y tá, chuyên gia, tư vấn viên của Lullaby</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {nursingSpecialists.map((member) => (
            <motion.div
              key={member.NursingID}
              className="bg-white rounded-xl shadow p-6 flex flex-col items-center hover:shadow-lg transition"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <img
                src={member.avatar_url || '/default-avatar.png'}
                alt={member.Nurse_Name}
                className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-pink-200"
              />
              <h3 className="text-xl font-semibold text-blue-700 mb-1">{member.Nurse_Name}</h3>
              <p className="text-gray-500 text-sm mb-2">{member.Major}</p>
              <p className="text-gray-600 text-center text-sm mb-2">Kinh nghiệm: {member.Experience} năm</p>
              <p className="text-gray-500 text-xs">{member.Slogan}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
} 