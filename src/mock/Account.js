const accounts = [
  {
    AccountID: 1,
    full_name: "Nguyen Van E",
    phone_number: "0123456789",
    email: "e@example.com",
    password: "hashedpassword1",
    avatar_url: "/images/hero-bg.jpg",
    created_at: "2024-01-01T08:00:00Z",
    status: "active",
    role_id: 3, // Relative
    role_name: "Người thân",
    delete_at: null
  },
  {
    AccountID: 2,
    full_name: "Nguyen Van S",
    phone_number: "0123456789",
    email: "e1@example.com",
    password: "hashedpassword1",
    avatar_url: "/images/hero-bg.jpg",
    created_at: "2024-01-01T08:00:00Z",
    status: "active",
    role_id: 3, // Relative
    role_name: "Người thân",
    delete_at: null
  },
  {
    AccountID: 3,
    full_name: "Admin User",
    phone_number: "0987654321",
    email: "admin@example.com",
    password: "hashedpassword2",
    avatar_url: "/images/hero-bg.jpg",
    created_at: "2024-02-01T09:00:00Z",
    status: "active",
    role_id: 1, // Admin
    role_name: "Quản trị viên",
    delete_at: null
  },
  {
    AccountID: 4,
    full_name: "Manager User1",
    phone_number: "0911222333",
    email: "manager1@example.com",
    password: "hashedpassword3",
    avatar_url: "/images/hero-bg.jpg",
    created_at: "2024-03-01T10:00:00Z",
    status: "active",
    role_id: 4, // Manager
    role_name: "Quản lý",
    delete_at: null
  },
  {
    AccountID: 5,
    full_name: "Manager User2",
    phone_number: "0911222333",
    email: "manager2@example.com",
    password: "hashedpassword3",
    avatar_url: "/images/hero-bg.jpg",
    created_at: "2024-03-01T10:00:00Z",
    status: "active",
    role_id: 4, // Manager
    role_name: "Quản lý",
    delete_at: null
  },
  {
    AccountID: 6,
    full_name: "Manager User3",
    phone_number: "0911222333",
    email: "manager3@example.com",
    password: "hashedpassword3",
    avatar_url: "/images/hero-bg.jpg",
    created_at: "2024-03-01T10:00:00Z",
    status: "active",
    role_id: 4, // Manager
    role_name: "Quản lý",
    delete_at: null
  },
  {
    AccountID: 7,
    full_name: "Manager User4",
    phone_number: "0911222333",
    email: "manager4@example.com",
    password: "hashedpassword3",
    avatar_url: "/images/hero-bg.jpg",
    created_at: "2024-03-01T10:00:00Z",
    status: "active",
    role_id: 4, // Manager
    role_name: "Quản lý",
    delete_at: null
  },
  {
    AccountID: 8,
    full_name: "Nurse User",
    phone_number: "0933444555",
    email: "nurse@example.com",
    password: "hashedpassword4",
    avatar_url: "/images/hero-bg.jpg",
    created_at: "2024-04-01T11:00:00Z",
    status: "active",
    role_id: 2, // Nurse
    role_name: "Y tá",
    delete_at: null
  },
  {
    AccountID: 9,
    full_name: "Nurse User2",
    phone_number: "0933444555",
    email: "nurse2@example.com",
    password: "hashedpassword4",
    avatar_url: "/images/hero-bg.jpg",
    created_at: "2024-04-01T11:00:00Z",
    status: "active",
    role_id: 2, // Nurse
    role_name: "Y tá",
    delete_at: null
  },
  {
    AccountID: 10,
    full_name: "Specialist User1",
    phone_number: "0944555666",
    email: "specialist1@example.com",
    password: "hashedpassword5",
    avatar_url: "/images/hero-bg.jpg",
    created_at: "2024-05-01T12:00:00Z",
    status: "active",
    role_id: 5, // Specialist
    role_name: "Chuyên gia",
    delete_at: null
  },
  {
    AccountID: 11,
    full_name: "Specialist User2",
    phone_number: "0955666777",
    email: "specialist2@example.com",
    password: "hashedpassword8",
      avatar_url: "/images/hero-bg.jpg",
    created_at: "2024-06-10T16:45:00Z",
    status: "active",
    role_id: 5, // Specialist
    role_name: "Chuyên gia",
    delete_at: null
  },
  {
    AccountID: 12,
    full_name: "Nurse User3",
    phone_number: "0933444555",
    email: "nurse3@example.com",
    password: "hashedpassword4",
    avatar_url: "/images/hero-bg.jpg",
    created_at: "2024-04-01T11:00:00Z",
    status: "active",
    role_id: 2, // Nurse
    role_name: "Y tá",
    delete_at: null
  },
  {
    AccountID: 13,
    full_name: "Nurse User4",
    phone_number: "0933444555",
    email: "nurse4@example.com",
    password: "hashedpassword4",
    avatar_url: "/images/hero-bg.jpg",
    created_at: "2024-04-01T11:00:00Z",
    status: "active",
    role_id: 2, // Nurse
    role_name: "Y tá",
    delete_at: null
  },
  {
    AccountID: 14,
    full_name: "Specialist User3",
    phone_number: "0944555666",
    email: "specialist3@example.com",
    password: "hashedpassword5",
    avatar_url: "/images/hero-bg.jpg",
    created_at: "2024-05-01T12:00:00Z",
    status: "active",
    role_id: 5, // Specialist
    role_name: "Chuyên gia",
    delete_at: null
  },
  {
    AccountID: 15,
    full_name: "Specialist User4",
    phone_number: "0955666777",
    email: "specialist4@example.com",
    password: "hashedpassword8",
    avatar_url: "/images/hero-bg.jpg",
    created_at: "2024-06-10T16:45:00Z",
    status: "active",
    role_id: 5, // Specialist
    role_name: "Chuyên gia",
    delete_at: null
  },
  {
    AccountID: 16,
    full_name: "Manager User5",
    phone_number: "0933444555",
    email: "manager5@example.com",
    password: "hashedpassword4",
    avatar_url: "/images/hero-bg.jpg",
    created_at: "2024-04-01T11:00:00Z", 
    status: "active",
    role_id: 4, // Manager
    role_name: "Quản lý",
    delete_at: null
  }
];

export default accounts;
