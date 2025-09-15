// Wishlist (Favorites) Service
// customerID ở backend là accountID ở frontend
import { API_ENDPOINTS } from '../../config/api';
import { apiGet, apiPost, apiDelete } from './serviceUtils';

const base = API_ENDPOINTS.WISHLIST; // '/Wishlist'

const wishlistService = {
  // GET /api/Wishlist/GetAllByCustomer/{accountId}
  getAllByAccount: async (accountId) =>
    apiGet(`${base}/GetAllByCustomer/${accountId}`, 'Không thể tải danh sách yêu thích'),

  // POST /api/Wishlist  { nursingID, customerID }
  add: async ({ nursingID, accountID }) =>
    apiPost(`${base}`, { nursingID, customerID: accountID }, 'Không thể thêm vào yêu thích'),

  // DELETE /api/Wishlist/{wishlistId}
  remove: async (wishlistId) =>
    apiDelete(`${base}/${wishlistId}`, 'Không thể xóa khỏi yêu thích'),
};

export default wishlistService;


