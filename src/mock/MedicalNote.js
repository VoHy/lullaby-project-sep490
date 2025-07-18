const medicalNotes = [
  {
    RecordID: 1,
    BookingServiceID: 1,
    NurseID: 1,
    CareID: 1,
    Image: "note1.jpg",
    Note: "Bệnh nhân hồi phục tốt",
    CreatedAt: "2024-06-01T14:00:00Z",
    Suggest: "Tiếp tục theo dõi huyết áp",
    RelatedID: null
  },
  {
    RecordID: 2,
    BookingServiceID: 2,
    NurseID: 2,
    CareID: 2,
    Image: "note2.jpg",
    Note: "Cần bổ sung dinh dưỡng",
    CreatedAt: "2024-06-02T15:00:00Z",
    Suggest: "Bổ sung vitamin và khoáng chất",
    RelatedID: 1
  }
];

export default medicalNotes; 