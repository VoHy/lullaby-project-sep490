'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faCalendar, faMoneyBill, faUserCheck } from '@fortawesome/free-solid-svg-icons';

const OverviewTab = ({ accounts, bookings, revenue }) => {
  const statsCards = [
    {
      title: 'Tổng số người dùng',
      value: accounts.length,
      icon: faUsers,
      color: 'from-blue-500 to-blue-600',
      textColor: 'text-blue-600'
    },
    {
      title: 'Booking trong tháng',
      value: bookings.length,
      icon: faCalendar,
      color: 'from-green-500 to-green-600',
      textColor: 'text-green-600'
    },
    {
      title: 'Doanh thu tháng',
      value: `${revenue.monthly.toLocaleString()} VND`,
      icon: faMoneyBill,
      color: 'from-purple-500 to-purple-600',
      textColor: 'text-purple-600'
    },
    {
      title: 'Người dùng hoạt động',
      value: accounts.filter(acc => acc.status === 'active').length,
      icon: faUserCheck,
      color: 'from-pink-500 to-pink-600',
      textColor: 'text-pink-600'
    }
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Tổng quan hệ thống</h2>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((stat, index) => (
          <div key={index} className="bg-gradient-to-r from-white to-gray-50 p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-2">{stat.title}</p>
                <p className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}</p>
              </div>
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                <FontAwesomeIcon icon={stat.icon} className="text-white text-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl">
          <h3 className="text-lg font-semibold mb-4 text-blue-800">Booking gần đây</h3>
          <div className="space-y-3">
            {bookings && bookings.length > 0 ? bookings.slice(0, 5).map((booking, index) => (
              <div key={booking.booking_id || index} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                <div>
                  <p className="font-medium text-gray-800">{booking.customer_name}</p>
                  <p className="text-sm text-gray-600">{booking.service_name}</p>
                </div>
                <span className="text-blue-600 font-semibold">{booking.total_price?.toLocaleString()} VND</span>
              </div>
            )) : (
              <p className="text-gray-500 text-center">Chưa có booking nào</p>
            )}
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl">
          <h3 className="text-lg font-semibold mb-4 text-purple-800">Người dùng mới</h3>
          <div className="space-y-3">
            {accounts && accounts.length > 0 ? accounts.slice(0, 5).map((account, index) => (
              <div key={account.account_id || index} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                    {account.full_name?.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{account.full_name}</p>
                    <p className="text-sm text-gray-600">{account.email}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  account.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {account.status === 'active' ? 'Hoạt động' : 'Tạm khóa'}
                </span>
              </div>
            )) : (
              <p className="text-gray-500 text-center">Chưa có người dùng nào</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
