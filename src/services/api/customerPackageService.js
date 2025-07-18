import customerPackages from '../../mock/CustomerPackage';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

const customerPackageService = {
  getCustomerPackages: async () => {
    if (USE_MOCK) return Promise.resolve(customerPackages);
    const res = await fetch('/api/customer-packages');
    return res.json();
  },
  getCustomerPackageById: async (id) => {
    if (USE_MOCK) return Promise.resolve(customerPackages.find(p => p.CustomerPackageID === id));
    const res = await fetch(`/api/customer-packages/${id}`);
    return res.json();
  },
  createCustomerPackage: async (data) => {
    if (USE_MOCK) return Promise.resolve({ ...data, CustomerPackageID: customerPackages.length + 1 });
    const res = await fetch('/api/customer-packages', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
    });
    return res.json();
  },
  updateCustomerPackage: async (id, data) => {
    if (USE_MOCK) return Promise.resolve({ ...customerPackages.find(p => p.CustomerPackageID === id), ...data });
    const res = await fetch(`/api/customer-packages/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
    });
    return res.json();
  },
  deleteCustomerPackage: async (id) => {
    if (USE_MOCK) return Promise.resolve(true);
    const res = await fetch(`/api/customer-packages/${id}`, { method: 'DELETE' });
    return res.ok;
  }
};

export default customerPackageService; 