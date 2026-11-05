/**
 * Cấu hình Endpoint kết nối Backend & CSDL MySQL
 * 
 * Thứ tự ưu tiên:
 * 1. URL tùy chỉnh do người dùng nhập (lưu trong localStorage 'app_custom_api_url')
 * 2. Biến môi trường VITE_API_URL từ file .env / Netlify
 * 3. Tự động kết nối Cloudflare Tunnel khi chạy trên website online
 * 4. Mặc định chạy nội bộ: 'http://localhost:3000'
 */

export const DEFAULT_ONLINE_API_URL = 'https://findlaw-task-communities-albuquerque.trycloudflare.com';

export const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    const custom = localStorage.getItem('app_custom_api_url');
    if (custom && custom.trim()) {
      return custom.trim().replace(/\/+$/, '');
    }

    // Nếu đang chạy trên website online (Netlify) và chưa có URL tùy chỉnh, dùng mặc định Tunnel
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      return (import.meta.env.VITE_API_URL || DEFAULT_ONLINE_API_URL).replace(/\/+$/, '');
    }
  }
  return (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/+$/, '');
};

export const setCustomApiUrl = (url) => {
  if (typeof window !== 'undefined') {
    if (!url || !url.trim()) {
      localStorage.removeItem('app_custom_api_url');
    } else {
      localStorage.setItem('app_custom_api_url', url.trim().replace(/\/+$/, ''));
    }
    // Phát sự kiện để các component khác tự động cập nhật
    window.dispatchEvent(new Event('api_url_changed'));
  }
};

export const checkDatabaseStatus = async () => {
  const baseUrl = getApiBaseUrl();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(`${baseUrl}/api/v1/db-status`, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (!res.ok) {
      return { connected: false, message: `Máy chủ phản hồi mã lỗi ${res.status}`, url: baseUrl };
    }
    const data = await res.json();
    return {
      connected: data.status === 'connected',
      database: data.database || 'giadungsmart',
      host: data.host,
      message: data.message,
      url: baseUrl
    };
  } catch (err) {
    return {
      connected: false,
      message: 'Không thể kết nối đến máy chủ backend',
      error: err.message,
      url: baseUrl
    };
  }
};
