import axios from './axios';

export const api = {
  auth: {
    login: (data) => axios.post('auth/login', data),
    register: (data) => axios.post('auth/register', data),
    verify: () => axios.get('auth/verify'),
  },
  user: {
    getMenu: () => axios.get('user/menu'),
    placeOrder: (data) => axios.post('user/orders', data),
    getOrders: (params = {}) => axios.get('user/orders', { params }),
    submitFeedback: (data) => axios.post('user/feedback', data),
    getItemById: (id) => axios.get(`user/item/${id}`),
    addAddress: (data) => axios.post('user/addresses', data),
    getAddresses: () => axios.get('user/addresses'),
  },
  admin: {
    getItems: () => axios.get('admin/items'),
    addItem: (data) => axios.post('admin/items', data),
    updateItem: (id, data) => axios.put(`admin/items/${id}`, data),
    getOrders: () => axios.get('admin/orders'),
    updateOrderStatus: (id, status) => axios.put(`admin/orders/${id}/status`, { status }),
    getFeedback: () => axios.get('admin/feedback'),
    getAnalytics: () => axios.get('admin/analytics'),
    getUsage: (period) => axios.get(`admin/usage?period=${period}`),
    getWaste: () => axios.get('admin/waste'),
    recordWaste: (data) => axios.post('admin/waste', data),
    getReorders: () => axios.get('admin/reorders'),
    createReorder: (data) => axios.post('admin/reorders', data),
    updateReorderStatus: (id, status) => axios.put(`admin/reorders/${id}/status`, { status }),
    getLowStock: () => axios.get('admin/reorders/low-stock'),

  },
};
