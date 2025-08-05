export default function PackageInfo({ packageDetail }) {
  if (!packageDetail) return null;

  return (
    <div className="mb-6 border rounded-lg p-4 bg-white shadow">
      <h3 className="text-lg font-bold text-pink-700 mb-2">Thông tin gói dịch vụ</h3>
      <div className="mb-1">
        <span className="font-semibold">Tên gói:</span> {packageDetail.serviceName || packageDetail.ServiceName}
      </div>
      <div className="mb-1">
        <span className="font-semibold">Mô tả:</span> {packageDetail.description || packageDetail.Description}
      </div>
      <div className="mb-1">
        <span className="font-semibold">Thời gian:</span> {packageDetail.duration || packageDetail.Duration} phút
      </div>
      <div className="mb-1">
        <span className="font-semibold">Giá gói:</span>{" "}
        <span className="text-pink-600 font-bold">
          {((packageDetail.price || packageDetail.Price) || 0).toLocaleString("vi-VN")} VNĐ
        </span>
      </div>
    </div>
  );
} 