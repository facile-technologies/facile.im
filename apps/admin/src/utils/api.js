import { BASE_URL } from './endpoints';

/**
 * Generic API request utility using fetch
 */
export const request = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  const fullUrl = url.startsWith('/') ? `${BASE_URL}${url}` : url;

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(fullUrl, config);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Something went wrong');
    }

    return result;
  } catch (error) {
    throw error;
  }
};

export const api = {
  get: (url, options) => request(url, { ...options, method: 'GET' }),
  post: (url, data, options) => request(url, { ...options, method: 'POST', body: JSON.stringify(data) }),
  put: (url, data, options) => request(url, { ...options, method: 'PUT', body: JSON.stringify(data) }),
  delete: (url, options) => request(url, { ...options, method: 'DELETE' }),
};
