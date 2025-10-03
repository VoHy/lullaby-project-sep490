<<<<<<< HEAD
﻿// Invoice Service
import { API_ENDPOINTS } from '../../config/api';
import { apiGet, apiPost, apiPut, apiDelete } from './serviceUtils';

const base = API_ENDPOINTS.INVOICES; // '/Invoice'
=======
import { createService } from "./serviceFactory";

// Tạo base service với factory
const baseInvoiceService = createService("invoice", "Invoice", true);
>>>>>>> db1e4ce3df8f10ff666a59706497e56b933f9d10

const invoiceService = {
<<<<<<< HEAD
  getAllInvoices: async () => apiGet(`${base}/GetAll`, 'Không thể lấy hóa đơn'),
  getInvoiceById: async (id) => apiGet(`${base}/${id}`, 'Không thể lấy hóa đơn'),
  getInvoiceByBooking: async (bookingId) => apiGet(`${base}/GetByBooking/${bookingId}`, 'Không thể lấy hóa đơn theo booking'),
  createInvoice: async (data) => apiPost(`${base}`, data, 'Không thể tạo hóa đơn'),
  updateStatus: async (invoiceId, status) => apiPut(`${base}/UpdateStatus/${invoiceId}`, { status }, 'Không thể cập nhật trạng thái hóa đơn'),
  deleteInvoice: async (id) => apiDelete(`${base}/${id}`, 'Không thể xóa hóa đơn'),
=======
  // Base CRUD methods từ factory
  ...baseInvoiceService,

  // GET /api/Invoice/GetAll
  getAllInvoices: async () => {
    const res = await fetch(
      "http://localhost:5294/api/Invoice/GetAll",
      {
        method: "GET",
        headers: { accept: "*/*" },
      }
    );
    const data = await res.json();
    if (!res.ok)
      throw new Error(
        data.error || "Không thể lấy danh sách invoices"
      );
    return data;
  },

  // GET /api/Invoice/{invoiceId}
  getInvoiceById: async (id) => {
    const res = await fetch(
      `http://localhost:5294/api/Invoice/${id}`,
      {
        method: "GET",
        headers: { accept: "*/*" },
      }
    );
    const data = await res.json();
    if (!res.ok)
      throw new Error(
        data.error || "Không thể lấy thông tin invoice"
      );
    return data;
  },

  // DELETE /api/Invoice/{invoiceId}
  deleteInvoice: async (id) => {
    const res = await fetch(
      `http://localhost:5294/api/Invoice/${id}`,
      {
        method: "DELETE",
        headers: { accept: "*/*" },
      }
    );
    const data = await res.json();
    if (!res.ok)
      throw new Error(data.error || "Không thể xóa invoice");
    return data;
  },

  // GET /api/Invoice/GetByBooking/{bookingId}
  getInvoiceByBooking: async (bookingId) => {
    const res = await fetch(
      `http://localhost:5294/api/Invoice/GetByBooking/${bookingId}`,
      {
        method: "GET",
        headers: { accept: "*/*" },
      }
    );
    const data = await res.json();
    if (!res.ok)
      throw new Error(
        data.error || "Không thể lấy invoice theo booking"
      );
    return data;
  },

  // POST /api/Invoice
  createInvoice: async (invoiceData) => {
    // Validate required fields
    if (!invoiceData.bookingID || !invoiceData.content) {
      throw new Error("bookingID và content là bắt buộc");
    }

    const res = await fetch("http://localhost:5294/api/Invoice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(invoiceData),
    });
    const data = await res.json();
    if (!res.ok)
      throw new Error(data.error || "Tạo invoice thất bại");
    return data;
  },

  // PUT /api/Invoice/UpdateStatus/{invoiceId}
  updateInvoiceStatus: async (invoiceId, statusData) => {
    const res = await fetch(
      `http://localhost:5294/api/Invoice/UpdateStatus/${invoiceId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(statusData),
      }
    );
    const data = await res.json();
    if (!res.ok)
      throw new Error(
        data.error || "Cập nhật trạng thái invoice thất bại"
      );
    return data;
  },
>>>>>>> db1e4ce3df8f10ff666a59706497e56b933f9d10
};

export default invoiceService;
