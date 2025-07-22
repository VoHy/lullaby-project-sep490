const accounts = [
  {
    AccountID: 1,
    full_name: "Nguyen Van E",
    phone_number: "0123456789",
    email: "e@example.com",
    password: "hashedpassword1",
    avatar_url: "avatar1.jpg",
    created_at: "2024-01-01T08:00:00Z",
    status: "active",
    role_id: 3, // Relative
    delete_at: null
  },
  {
    AccountID: 2,
    full_name: "Tran Thi F",
    phone_number: "0987654321",
    email: "f@example.com",
    password: "hashedpassword2",
    avatar_url: "avatar2.jpg",
    created_at: "2024-02-01T09:00:00Z",
    status: "active",
    role_id: 1, // Admin
    delete_at: null
  },
  {
    AccountID: 3,
    full_name: "Le Van G",
    phone_number: "0911222333",
    email: "manager@example.com",
    password: "hashedpassword3",
    avatar_url: "avatar3.jpg",
    created_at: "2024-03-01T10:00:00Z",
    status: "active",
    role_id: 4, // Manager
    delete_at: null
  },
  {
    AccountID: 4,
    full_name: "Pham Thi H",
    phone_number: "0933444555",
    email: "nurse@example.com",
    password: "hashedpassword4",
    avatar_url: "avatar4.jpg",
    created_at: "2024-04-01T11:00:00Z",
    status: "active",
    role_id: 2, // Nurse/Specialist
    delete_at: null
  }
];

export default accounts;
