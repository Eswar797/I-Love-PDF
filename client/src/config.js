// API Configuration
// In production, use full backend URL. In development, use /api proxy
const getApiUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) {
    // If VITE_API_URL is set, use it and append /api if needed
    let url = envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl;
    // If it's a full URL (starts with http), ensure /api is included
    if (url.startsWith('http') && !url.includes('/api')) {
      url = `${url}/api`;
    }
    return url;
  }
  // In development, use /api which will be proxied by Vite
  return '/api';
};

export const API_URL = getApiUrl();

