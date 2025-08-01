const bookings = [
  {
    BookingID: 1,
    CareProfileID: 1,
    CreatedAt: "2025-07-25T08:00:00Z",
    UpdatedAt: "2025-07-25T08:00:00Z",
    Status: "completed",
    Amount: 900000,
    Extra: 0,
    WorkDate: "2025-07-25T07:00:00Z",
    IsScheduled: true,
    CustomizePackageID: 1,
  },
  {
    BookingID: 2,
    CareProfileID: 2,
    CreatedAt: "2024-06-02T11:00:00Z",
    UpdatedAt: "2024-06-02T13:00:00Z",
    Status: "pending",
    Amount: 1800000,
    Extra: 0,
    WorkDate: "2024-06-11T09:00:00Z",
    IsScheduled: true,
    CustomizePackageID: 2,
  },
  {
    BookingID: 3,
    CareProfileID: 3,
    CreatedAt: "2025-07-24T06:00:00Z",
    UpdatedAt: "2025-07-24T08:00:00Z",
    Status: "pending",
    Amount: 1200000,
    Extra: 0,
    WorkDate: "2025-07-24T06:00:00Z",
    IsScheduled: true,
    // Không có CustomizePackageID (dịch vụ lẻ)
  },
  {
    BookingID: 4,
    CareProfileID: 4,
    CreatedAt: "2024-06-04T09:00:00Z",
    UpdatedAt: "2024-06-04T11:00:00Z",
    Status: "cancelled",
    Amount: 2500000,
    Extra: 0,
    WorkDate: "2024-06-13T08:00:00Z",
    IsScheduled: true,
    // Không có CustomizePackageID (dịch vụ lẻ)
  },
  // Booking gói dịch vụ có 2 dịch vụ con (1 đã chọn nurse/specialist, 1 chưa chọn)
  {
    BookingID: 5,
    CareProfileID: 5,
    CreatedAt: "2024-07-01T10:00:00Z",
    UpdatedAt: "2024-07-01T10:30:00Z",
    Status: "pending",
    Amount: 600000,
    Extra: 0,
    WorkDate: "2024-07-10T08:00:00Z",
    IsScheduled: true,
    CustomizePackageID: 3, // Gói dịch vụ mới
    // Chi tiết dịch vụ con sẽ nằm ở CustomerTask.js, ví dụ:
    // - 1 dịch vụ con đã có NursingID hoặc SpecialistID
    // - 1 dịch vụ con chưa có NursingID/SpecialistID
  },
  // Booking dịch vụ lẻ chưa chọn nurse/specialist
  {
    BookingID: 6,
    CareProfileID: 6,
    CreatedAt: "2024-07-02T09:00:00Z",
    UpdatedAt: "2024-07-02T09:15:00Z",
    Status: "pending",
    Amount: 350000,
    Extra: 0,
    WorkDate: "2024-07-12T14:00:00Z",
    IsScheduled: false,
    // Không có CustomizePackageID (dịch vụ lẻ)
    // Chưa có NursingID/SpecialistID ở CustomerTask.js
  },
];

export default bookings; 