import invoices from '../../mock/Invoice';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

const invoiceService = {
  getInvoices: async () => {
    if (USE_MOCK) {
      return Promise.resolve(invoices);
    }
    const res = await fetch('/api/invoices');
    return res.json();
  },
  getInvoiceById: async (id) => {
    if (USE_MOCK) {
      return Promise.resolve(invoices.find(i => i.InvoiceID === id));
    }
    const res = await fetch(`/api/invoices/${id}`);
    return res.json();
  },
  createInvoice: async (data) => {
    if (USE_MOCK) {
      return Promise.resolve({ ...data, InvoiceID: invoices.length + 1 });
    }
    const res = await fetch('/api/invoices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  updateInvoice: async (id, data) => {
    if (USE_MOCK) {
      return Promise.resolve({ ...invoices.find(i => i.InvoiceID === id), ...data });
    }
    const res = await fetch(`/api/invoices/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  deleteInvoice: async (id) => {
    if (USE_MOCK) {
      return Promise.resolve(true);
    }
    const res = await fetch(`/api/invoices/${id}`, { method: 'DELETE' });
    return res.ok;
  }
};

export default invoiceService; 