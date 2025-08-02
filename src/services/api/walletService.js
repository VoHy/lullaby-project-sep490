// import { createService } from './serviceFactory';

// const baseWalletService = createService('wallets', 'Wallet');

// const walletService = {
//   ...baseWalletService,
//   getWalletHistories: async (walletId) => {
//     const res = await fetch(`/api/wallets/${walletId}/histories`);
//     if (!res.ok) {
//       throw new Error('Failed to fetch wallet histories');
//     }
//     return res.json();
//   },
//   deposit: async (depositData) => {
//     const res = await fetch('/api/wallets/deposit', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(depositData),
//     });
//     if (!res.ok) {
//       throw new Error('Failed to deposit');
//     }
//     return res.json();
//   },
//   getWalletByAccountId: async (accountId) => {
//     const res = await fetch(`/api/wallets/account/${accountId}`);
//     if (!res.ok) {
//       throw new Error('Failed to fetch wallet by account ID');
//     }
//     return res.json();
//   },
//   updateWalletBalance: async (walletId, newBalance) => {
//     const res = await fetch(`/api/wallets/${walletId}`, {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ Balance: newBalance }),
//     });
//     if (!res.ok) {
//       throw new Error('Failed to update wallet balance');
//     }
//     return res.json();
//   },
//   getWalletHistory: async (walletId) => {
//     const res = await fetch(`/api/wallets/${walletId}/histories`);
//     if (!res.ok) {
//       throw new Error('Failed to fetch wallet history');
//     }
//     return res.json();
//   },
//   createWallet: async (walletData) => {
//     const res = await fetch('/api/wallets', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(walletData),
//     });
//     if (!res.ok) {
//       throw new Error('Failed to create wallet');
//     }
//     return res.json();
//   },
//   deleteWallet: async (walletId) => {
//     const res = await fetch(`/api/wallets/${walletId}`, {
//       method: 'DELETE',
//     });
//     if (!res.ok) {
//       throw new Error('Failed to delete wallet');
//     }
//     return res.json();
//   },
// };

// export default walletService; 