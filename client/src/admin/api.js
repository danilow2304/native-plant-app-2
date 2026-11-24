const API = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export const getToken = () => sessionStorage.getItem('adminToken');
export const setToken = (t) => sessionStorage.setItem('adminToken', t);
export const clearToken = () => sessionStorage.removeItem('adminToken');

async function request(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (res.status === 401 && token) clearToken(); // expired/invalid token
  if (!res.ok) {
    const err = new Error(data.message || 'Request failed');
    err.status = res.status;
    err.details = data.errors;
    throw err;
  }
  return data;
}

export const login = (username, password) =>
  request('/api/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) });
export const listPlants = () => request('/api/admin/plants');
export const getPlant = (id) => request(`/api/admin/plants/${id}`);
export const createPlant = (p) => request('/api/admin/plants', { method: 'POST', body: JSON.stringify(p) });
export const updatePlant = (id, p) => request(`/api/admin/plants/${id}`, { method: 'PUT', body: JSON.stringify(p) });
export const deletePlant = (id) => request(`/api/admin/plants/${id}`, { method: 'DELETE' });
