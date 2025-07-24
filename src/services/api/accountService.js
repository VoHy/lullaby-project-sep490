import accounts from '../../mock/Account';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

const accountService = {
  getAccount: async (id) => {
    if (USE_MOCK) {
      return Promise.resolve(accounts.find(acc => acc.AccountID === id));
    }
    const res = await fetch(`/api/accounts/${id}`);
    return res.json();
  },
  getAllAccounts: async () => {
    if (USE_MOCK) {
      return Promise.resolve(accounts);
    }
    const res = await fetch('/api/accounts');
    return res.json();
  },
  updateAccount: async (id, data) => {
    if (USE_MOCK) {
      return Promise.resolve({ ...accounts.find(acc => acc.AccountID === id), ...data });
    }
    const res = await fetch(`/api/accounts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  deleteAccount: async (id) => {
    if (USE_MOCK) {
      return Promise.resolve(true);
    }
    const res = await fetch(`/api/accounts/${id}`, { method: 'DELETE' });
    return res.ok;
  }
};

export default accountService; 