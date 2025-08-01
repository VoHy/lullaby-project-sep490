const serviceTypes = [
  {
    ServiceID: 1,
    ServiceName: "Chăm sóc tại nhà cơ bản",
    Major: "Chăm sóc người cao tuổi",
    IsPackage: true,
    Price: 500000,
    Duration: "2h",
    Description: "Gói chăm sóc tại nhà cơ bản cho người cao tuổi, bao gồm kiểm tra sức khỏe tổng quát và hỗ trợ sinh hoạt.",
    Status: "active",
    Discount: ""
  },
  {
    ServiceID: 2,
    ServiceName: "Chăm sóc y tế cơ bản",
    Major: "Chăm sóc người bệnh",
    IsPackage: false,
    Price: 300000,
    Duration: "1h",
    Description: "Dịch vụ chăm sóc y tế cơ bản tại nhà như đo huyết áp, kiểm tra đường huyết.",
    Status: "active",
    Discount: ""
  },
  {
    ServiceID: 3,
    ServiceName: "Chăm sóc phục hồi chức năng",
    Major: "Phục hồi chức năng",
    IsPackage: true,
    Price: 1200000,
    Duration: "2.5h",
    Description: "Gói chăm sóc phục hồi chức năng cho bệnh nhân sau tai biến, phẫu thuật.",
    Status: "active",
    Discount: ""
  },
  {
    ServiceID: 4,
    ServiceName: "Chăm sóc vết thương",
    Major: "Chăm sóc y tế",
    IsPackage: false,
    Price: 400000,
    Duration: "1h",
    Description: "Dịch vụ thay băng, sát trùng và chăm sóc vết thương tại nhà.",
    Status: "active",
    Discount: ""
  },
  {
    ServiceID: 5,
    ServiceName: "Chăm sóc nâng cao cho người cao tuổi",
    Major: "Chăm sóc người cao tuổi",
    IsPackage: true,
    Price: 1500000,
    Duration: "3h",
    Description: "Gói chăm sóc nâng cao cho người cao tuổi, bao gồm hỗ trợ vận động, ăn uống và theo dõi sức khỏe.",
    Status: "active",
    Discount: ""
  },
  {
    ServiceID: 6,
    ServiceName: "Chăm sóc sau phẫu thuật",
    Major: "Chăm sóc y tế",
    IsPackage: false,
    Price: 600000,
    Duration: "1.5h",
    Description: "Dịch vụ chăm sóc bệnh nhân sau phẫu thuật tại nhà, theo dõi dấu hiệu sinh tồn.",
    Status: "active",
    Discount: ""
  },
  {
    ServiceID: 7,
    ServiceName: "Chăm sóc bệnh nhân liệt giường",
    Major: "Chăm sóc đặc biệt",
    IsPackage: true,
    Price: 2000000,
    Duration: "4h",
    Description: "Gói chăm sóc toàn diện cho bệnh nhân liệt giường, bao gồm thay tã, vệ sinh cá nhân, phòng loét.",
    Status: "active",
    Discount: ""
  },
  {
    ServiceID: 8,
    ServiceName: "Chăm sóc trẻ em tại nhà",
    Major: "Chăm sóc trẻ em",
    IsPackage: false,
    Price: 350000,
    Duration: "1h",
    Description: "Dịch vụ chăm sóc sức khỏe cho trẻ em tại nhà như tiêm chủng, theo dõi sốt.",
    Status: "active",
    Discount: ""
  },
  {
    ServiceID: 9,
    ServiceName: "Chăm sóc dinh dưỡng",
    Major: "Dinh dưỡng",
    IsPackage: false,
    Price: 450000,
    Duration: "1h",
    Description: "Tư vấn và hỗ trợ xây dựng chế độ dinh dưỡng phù hợp cho từng đối tượng.",
    Status: "active",
    Discount: ""
  },
  {
    ServiceID: 10,
    ServiceName: "Chăm sóc hậu COVID-19",
    Major: "Chăm sóc phục hồi",
    IsPackage: false,
    Price: 700000,
    Duration: "2h",
    Description: "Dịch vụ chăm sóc và phục hồi sức khỏe cho bệnh nhân sau khi mắc COVID-19.",
    Status: "active",
    Discount: ""
  },
  {
    ServiceID: 11,
    ServiceName: "Chăm sóc sức khỏe tâm thần",
    Major: "Tâm lý",
    IsPackage: false,
    Price: 800000,
    Duration: "1.5h",
    Description: "Tư vấn và hỗ trợ chăm sóc sức khỏe tâm thần tại nhà.",
    Status: "active",
    Discount: ""
  },
  {
    ServiceID: 12,
    ServiceName: "Chăm sóc thai sản tại nhà",
    Major: "Chăm sóc thai sản",
    IsPackage: true,
    Price: 1800000,
    Duration: "3h",
    Description: "Gói chăm sóc cho mẹ bầu và sau sinh tại nhà, hỗ trợ theo dõi sức khỏe mẹ và bé.",
    Status: "active",
    Discount: ""
  },
  {
    ServiceID: 13,
    ServiceName: "Chăm sóc cuối đời (Hospice)",
    Major: "Chăm sóc đặc biệt",
    IsPackage: true,
    Price: 2500000,
    Duration: "5h",
    Description: "Gói chăm sóc giảm nhẹ đau đớn, hỗ trợ tinh thần cho bệnh nhân giai đoạn cuối.",
    Status: "active",
    Discount: ""
  },
];

export default serviceTypes;
