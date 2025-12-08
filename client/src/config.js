// API Configuration
// In production, use full backend URL. In development, use /api proxy
const getApiUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) {
    // If VITE_API_URL is set, use it (should include full URL like https://backend.railway.app)
    return envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl;
  }
  // In development, use /api which will be proxied by Vite
  return '/api';
};

export const API_URL = getApiUrl();

