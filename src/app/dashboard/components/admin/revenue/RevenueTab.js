'use client';

const RevenueTab = ({ revenue, bookings }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Báo cáo Doanh thu</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white">
          <h3 className="text-lg font-semibold mb-2">Doanh thu hôm nay</h3>
          <p className="text-3xl font-bold">{revenue.daily.toLocaleString()} VND</p>
        </div>
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white">
          <h3 className="text-lg font-semibold mb-2">Doanh thu tháng này</h3>
          <p className="text-3xl font-bold">{revenue.monthly.toLocaleString()} VND</p>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl text-white">
          <h3 className="text-lg font-semibold mb-2">Tổng doanh thu</h3>
          <p className="text-3xl font-bold">{revenue.total.toLocaleString()} VND</p>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
        <h3 className="text-lg font-semibold mb-4">Biểu đồ doanh thu theo thời gian</h3>
        <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Biểu đồ doanh thu sẽ được hiển thị tại đây</p>
        </div>
      </div>

      {/* Revenue Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold mb-4">So sánh tháng này</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">So với tháng trước</span>
              <span className="text-green-600 font-semibold">+15.3%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">So với cùng kỳ năm trước</span>
              <span className="text-blue-600 font-semibold">+28.7%</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Dịch vụ có doanh thu cao nhất</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-800">Chăm sóc người cao tuổi</span>
              <span className="font-semibold text-green-600">45%</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-800">Y tá tại nhà</span>
              <span className="font-semibold text-blue-600">30%</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-800">Theo dõi sức khỏe</span>
              <span className="font-semibold text-purple-600">25%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueTab;
