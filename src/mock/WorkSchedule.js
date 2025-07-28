const workSchedules = [
  {
    WorkScheduleID: 1,
    BookingID: 1,
    ServiceID: 1,
    NursingID: 1,
    IsAttended: true,
    EndTime: "2025-07-25T09:00:00Z",
    WorkDate: "2025-07-25T06:00:00Z",
    Status: "active"
  },
  {
    WorkScheduleID: 2,
    BookingID: 2,
    ServiceID: 2,
    NursingID: 4,
    IsAttended: false,
    EndTime: "2025-02-15T13:00:00Z",
    WorkDate: "2025-02-15T09:00:00Z",
    Status: "inactive"
  },
  {
    WorkScheduleID: 3,
    BookingID: 3,
    ServiceID: 3,
    NursingID: 4,
    IsAttended: true,
    EndTime: "2025-03-20T08:00:00Z",
    WorkDate: "2025-03-20T06:00:00Z",
    Status: "active"
  },
  {
    WorkScheduleID: 4,
    BookingID: 4,
    ServiceID: 6,
    NursingID: 9,
    IsAttended: false,
    EndTime: "2025-04-25T13:00:00Z",
    WorkDate: "2025-04-25T09:00:00Z",
    Status: "inactive"
  },
  {
    WorkScheduleID: 5,
    BookingID: 5,
    ServiceID: 7,
    NursingID: 10,
    IsAttended: true,
    EndTime: "2025-07-10T08:00:00Z",
    WorkDate: "2025-07-10T06:00:00Z",
    Status: "active"
  },
  {
    WorkScheduleID: 6,
    BookingID: 6,
    ServiceID: 9,
    NursingID: 12,
    IsAttended: false,
    EndTime: "2025-07-12T13:00:00Z",
    WorkDate: "2025-07-12T09:00:00Z",
    Status: "pending"
  },
  {
    WorkScheduleID: 100,
    BookingID: null,
    ServiceID: 1,
    NursingID: 1,
    IsAttended: false,
    EndTime: "2025-07-28T12:00:00Z", // 19:00 VN
    WorkDate: "2025-07-28T10:00:00Z", // 17:00 VN
    Status: "active"
  },
  {
    WorkScheduleID: 101,
    BookingID: null,
    ServiceID: 1,
    NursingID: 3,
    IsAttended: false,
    EndTime: "2025-07-28T12:00:00Z",
    WorkDate: "2025-07-28T10:00:00Z",
    Status: "active"
  },
  {
    WorkScheduleID: 102,
    BookingID: null,
    ServiceID: 1,
    NursingID: 4,
    IsAttended: false,
    EndTime: "2025-07-28T12:00:00Z",
    WorkDate: "2025-07-28T10:00:00Z",
    Status: "active"
  }
];

export default workSchedules;
