const medicalNotes = [
  {
    MedicalNoteID: 1,
    PatientID: 1,
    NurseID: 1,
    NoteDate: '2024-01-15',
    NoteContent: 'Bệnh nhân có dấu hiệu cải thiện, huyết áp ổn định',
    VitalSigns: {
      bloodPressure: '120/80',
      heartRate: 72,
      temperature: 36.8,
      oxygenSaturation: 98
    },
    Medications: [
      {
        name: 'Paracetamol',
        dosage: '500mg',
        frequency: '3 lần/ngày'
      }
    ],
    Recommendations: 'Tiếp tục theo dõi huyết áp hàng ngày',
    CreatedAt: '2024-01-15T08:00:00Z',
    UpdatedAt: '2024-01-15T08:00:00Z'
  },
  {
    MedicalNoteID: 2,
    PatientID: 2,
    NurseID: 2,
    NoteDate: '2024-01-16',
    NoteContent: 'Bệnh nhân cần hỗ trợ vận động nhẹ nhàng',
    VitalSigns: {
      bloodPressure: '118/78',
      heartRate: 75,
      temperature: 36.9,
      oxygenSaturation: 97
    },
    Medications: [
      {
        name: 'Vitamin D',
        dosage: '1000IU',
        frequency: '1 lần/ngày'
      }
    ],
    Recommendations: 'Tăng cường vận động nhẹ nhàng, tập thở sâu',
    CreatedAt: '2024-01-16T09:00:00Z',
    UpdatedAt: '2024-01-16T09:00:00Z'
  },
  {
    MedicalNoteID: 3,
    PatientID: 3,
    NurseID: 1,
    NoteDate: '2024-01-17',
    NoteContent: 'Bệnh nhân có dấu hiệu mệt mỏi, cần nghỉ ngơi nhiều hơn',
    VitalSigns: {
      bloodPressure: '125/85',
      heartRate: 80,
      temperature: 37.1,
      oxygenSaturation: 96
    },
    Medications: [
      {
        name: 'Iron supplement',
        dosage: '100mg',
        frequency: '1 lần/ngày'
      }
    ],
    Recommendations: 'Nghỉ ngơi đầy đủ, ăn uống đầy đủ dinh dưỡng',
    CreatedAt: '2024-01-17T10:00:00Z',
    UpdatedAt: '2024-01-17T10:00:00Z'
  }
];

export default medicalNotes; 