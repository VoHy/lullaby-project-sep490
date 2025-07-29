// Nếu bạn gọi API qua route proxy (ví dụ: /api/zoneDetail/getall) thì vẫn cần file route.js để làm trung gian giữa FE và BE (giúp bảo mật, xử lý token, tránh lộ endpoint BE thật, v.v).
// Nếu bạn gọi trực tiếp API backend (ví dụ: http://localhost:5294/api/zonedetails/getall) từ FE thì không cần file proxy route.js, nhưng sẽ gặp vấn đề CORS, bảo mật, v.v.
// Thực tế, nên giữ file route.js để đồng bộ với Next.js API routes và dễ quản lý, mock, bảo mật hơn.

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

const zoneDetailsService = {
  // Lấy tất cả zone details
  getZoneDetails: async () => {
    // Nếu dùng proxy route.js thì gọi endpoint nội bộ FE như dưới đây
    const res = await fetch('/api/zoneDetail/getall');
    const data = await res.json();
    return Array.isArray(data) ? data : data.zoneDetails || data || [];
    // Nếu không dùng route.js thì phải gọi trực tiếp BE, ví dụ:
    // const res = await fetch('http://localhost:5294/api/zonedetails/getall');
  },

  // Lấy zone detail theo id
  getZoneDetailById: async (id) => {
    const res = await fetch(`/api/zoneDetail/get/${id}`);
    if (!res.ok) throw new Error('Không tìm thấy zone detail');
    return res.json();
  },

  // Tạo mới zone detail
  createZoneDetail: async (data) => {
    const res = await fetch('/api/zoneDetail/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Tạo zone detail thất bại');
    return res.json();
  },

  // Cập nhật zone detail theo id
  updateZoneDetail: async (id, data) => {
    const res = await fetch(`/api/zoneDetail/update/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Cập nhật zone detail thất bại');
    return res.json();
  },

  // Xoá zone detail theo id
  deleteZoneDetail: async (id) => {
    const res = await fetch(`/api/zoneDetail/delete/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Xoá zone detail thất bại');
    return res.json();
  }
};

export default zoneDetailsService;