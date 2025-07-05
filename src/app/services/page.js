'use client';

const services = [
  {
    name: 'Chăm sóc tại nhà',
    icon: '🏠',
    description: 'Dịch vụ chăm sóc sức khỏe, hỗ trợ sinh hoạt cho người cao tuổi ngay tại nhà.'
  },
  {
    name: 'Tư vấn sức khỏe',
    icon: '💬',
    description: 'Tư vấn dinh dưỡng, tâm lý, phục hồi chức năng bởi chuyên gia.'
  },
  {
    name: 'Khám bệnh định kỳ',
    icon: '🩺',
    description: 'Đặt lịch khám sức khỏe định kỳ với đội ngũ y tá và bác sĩ uy tín.'
  },
  {
    name: 'Vật lý trị liệu',
    icon: '🧘',
    description: 'Hỗ trợ phục hồi chức năng, tập luyện tại nhà với chuyên gia vật lý trị liệu.'
  }
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dịch vụ</h1>
        <p className="text-gray-600 mb-8">Các dịch vụ nổi bật của Lullaby dành cho người cao tuổi và gia đình</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow p-6 flex flex-col items-center hover:shadow-lg transition">
              <div className="text-5xl mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold text-blue-700 mb-2">{service.name}</h3>
              <p className="text-gray-600 text-center text-sm">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 