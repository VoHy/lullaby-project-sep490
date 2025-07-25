const serviceTasks = [
  // Gói 1: 3 dịch vụ con
  {
    ServiceTaskID: 1,
    Child_ServiceID: 1,
    TaskOrder: 1,
    Description: "Đo huyết áp",
    Status: "active",
    Price: 50000,
    Quantity: 1,
    Package_ServiceID: 1
  },
  {
    ServiceTaskID: 2,
    Child_ServiceID: 2,
    TaskOrder: 2,
    Description: "Kiểm tra đường huyết",
    Status: "active",
    Price: 60000,
    Quantity: 1,
    Package_ServiceID: 1
  },
  {
    ServiceTaskID: 3,
    Child_ServiceID: 3,
    TaskOrder: 3,
    Description: "Hỗ trợ vệ sinh cá nhân",
    Status: "active",
    Price: 40000,
    Quantity: 1,
    Package_ServiceID: 1
  },
  // Gói 2: 2 dịch vụ con
  {
    ServiceTaskID: 4,
    Child_ServiceID: 4,
    TaskOrder: 1,
    Description: "Thay băng vết thương",
    Status: "active",
    Price: 70000,
    Quantity: 1,
    Package_ServiceID: 2
  },
  {
    ServiceTaskID: 5,
    Child_ServiceID: 5,
    TaskOrder: 2,
    Description: "Sát trùng vết thương",
    Status: "active",
    Price: 50000,
    Quantity: 1,
    Package_ServiceID: 2
  },
  // Dịch vụ lẻ (không thuộc package)
  {
    ServiceTaskID: 6,
    Child_ServiceID: 6,
    TaskOrder: 1,
    Description: "Hỗ trợ vận động phục hồi chức năng",
    Status: "active",
    Price: 80000,
    Quantity: 1,
    // Không có Package_ServiceID
  },
  {
    ServiceTaskID: 7,
    Child_ServiceID: 7,
    TaskOrder: 2,
    Description: "Tư vấn dinh dưỡng",
    Status: "active",
    Price: 60000,
    Quantity: 1,
    // Không có Package_ServiceID
  },
  {
    ServiceTaskID: 8,
    Child_ServiceID: 8,
    TaskOrder: 3,
    Description: "Theo dõi dấu hiệu sinh tồn",
    Status: "active",
    Price: 55000,
    Quantity: 1,
    // Không có Package_ServiceID
  },
  {
    ServiceTaskID: 9,
    Child_ServiceID: 9,
    TaskOrder: 1,
    Description: "Chăm sóc hậu phẫu",
    Status: "active",
    Price: 90000,
    Quantity: 1,
    // Không có Package_ServiceID
  },
];

export default serviceTasks; 