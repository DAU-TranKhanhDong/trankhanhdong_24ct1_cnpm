import React, { useState, useEffect } from 'react';
import { Database, CheckCircle2, AlertCircle, RefreshCw, Globe, Settings, EyeOff } from 'lucide-react';
import { getApiBaseUrl, setCustomApiUrl, checkDatabaseStatus } from '../../config/api';

export default function TrangThaiDatabase() {
  const [status, setStatus] = useState({ loading: true, connected: false, message: '', url: getApiBaseUrl() });
  const [isOpen, setIsOpen] = useState(false);
  const [inputUrl, setInputUrl] = useState('');
  const [testing, setTesting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [isHidden, setIsHidden] = useState(() => {
    return localStorage.getItem('hide_db_badge') === 'true';
  });

  const fetchStatus = async () => {
    setStatus(prev => ({ ...prev, loading: true }));
    const res = await checkDatabaseStatus();
    setStatus({
      loading: false,
      connected: res.connected,
      message: res.message || '',
      database: res.database,
      url: res.url
    });
  };

  useEffect(() => {
    fetchStatus();

    const handleUrlChange = () => {
      fetchStatus();
    };

    const handleOpenFromFooter = () => {
      handleOpenModal();
    };

    window.addEventListener('api_url_changed', handleUrlChange);
    window.addEventListener('open_db_modal', handleOpenFromFooter);
    return () => {
      window.removeEventListener('api_url_changed', handleUrlChange);
      window.removeEventListener('open_db_modal', handleOpenFromFooter);
    };
  }, []);

  const handleOpenModal = () => {
    setInputUrl(localStorage.getItem('app_custom_api_url') || getApiBaseUrl());
    setFeedback(null);
    setIsOpen(true);
  };

  const handleSaveAndTest = async (e) => {
    e.preventDefault();
    setTesting(true);
    setFeedback(null);

    const cleanUrl = inputUrl.trim().replace(/\/+$/, '');
    setCustomApiUrl(cleanUrl);

    const testRes = await checkDatabaseStatus();
    setTesting(false);

    if (testRes.connected) {
      setFeedback({ type: 'success', message: '✅ Kết nối CSDL MySQL thành công rực rỡ!' });
      setStatus({
        loading: false,
        connected: true,
        message: testRes.message,
        database: testRes.database,
        url: testRes.url
      });
    } else {
      setFeedback({
        type: 'warning',
        message: `⚠️ Chưa kết nối được CSDL: ${testRes.message || 'Kiểm tra xem XAMPP và Tunnel đã bật chưa.'}`
      });
      setStatus(prev => ({ ...prev, connected: false, url: testRes.url }));
    }
  };

  const handleReset = () => {
    setCustomApiUrl('');
    setInputUrl('http://localhost:3000');
    setFeedback({ type: 'info', message: 'Đã hoàn tác về địa chỉ mặc định' });
    setTimeout(() => {
      fetchStatus();
    }, 200);
  };

  const toggleHide = (e) => {
    e.stopPropagation();
    const next = !isHidden;
    setIsHidden(next);
    localStorage.setItem('hide_db_badge', String(next));
  };

  return (
    <>
      {/* Nút bấm tinh gọn dạng Floating Widget ở góc dưới bên trái màn hình */}
      {!isHidden && (
        <div className="fixed bottom-3 left-3 z-40 group">
          <button
            onClick={handleOpenModal}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[11px] font-semibold transition-all shadow-md backdrop-blur-md cursor-pointer border opacity-30 hover:opacity-100 ${
              status.connected
                ? 'bg-slate-900/90 text-emerald-400 border-emerald-500/40 hover:bg-slate-900'
                : 'bg-slate-900/90 text-amber-400 border-amber-500/40 hover:bg-slate-900'
            }`}
            title="Bấm để xem/cấu hình kết nối CSDL MySQL"
          >
            <span className={`w-2 h-2 rounded-full ${status.connected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <Database size={12} />
            <span className="hidden group-hover:inline transition-all duration-200">
              {status.connected ? 'MySQL Online' : 'CSDL Demo'}
            </span>
            <span
              onClick={toggleHide}
              title="Ẩn nút này khỏi màn hình (vẫn mở lại được ở cuối chân trang)"
              className="ml-1 text-slate-400 hover:text-white hidden group-hover:inline p-0.5"
            >
              <EyeOff size={11} />
            </span>
          </button>
        </div>
      )}

      {/* Modal Cấu hình Kết nối CSDL */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden text-slate-800">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center">
                  <Database size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Trạng Thái Kết Nối CSDL MySQL</h3>
                  <p className="text-[11px] text-slate-400">Website Bán Hàng - GiaDụngSmart</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg text-lg leading-none cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Card trạng thái hiện tại */}
              <div
                className={`p-3.5 rounded-xl border flex items-start gap-3 ${
                  status.connected
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-amber-50 border-amber-200 text-amber-900'
                }`}
              >
                {status.connected ? (
                  <CheckCircle2 size={20} className="text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle size={20} className="text-amber-600 shrink-0 mt-0.5" />
                )}
                <div className="text-xs">
                  <p className="font-bold">
                    {status.connected
                      ? 'Đang kết nối CSDL MySQL thành công!'
                      : 'Đang ở chế độ lưu trữ trình duyệt (LocalStorage)'}
                  </p>
                  <p className="mt-0.5 text-slate-600 break-all">
                    Địa chỉ Backend hiện tại:{' '}
                    <code className="bg-white/80 px-1 py-0.5 rounded font-mono text-[11px] text-slate-800 border border-slate-300">
                      {status.url}
                    </code>
                  </p>
                </div>
              </div>

              {/* Form nhập Cloudflare Tunnel Link */}
              <form onSubmit={handleSaveAndTest} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Link Cloudflare Tunnel Backend (hoặc Render / Localhost):
                  </label>
                  <input
                    type="url"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    placeholder="https://xxxxx.trycloudflare.com hoặc http://localhost:3000"
                    className="w-full text-xs font-mono px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    👉 Bấm chạy file <b className="text-slate-800">CHAY-SERVER-CLOUDFLARE.bat</b> trên máy tính để lấy link.
                  </p>
                </div>

                {feedback && (
                  <div
                    className={`p-2.5 rounded-lg text-xs font-medium ${
                      feedback.type === 'success'
                        ? 'bg-emerald-100 text-emerald-800'
                        : feedback.type === 'warning'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {feedback.message}
                  </div>
                )}

                <div className="flex gap-2 pt-1">
                  <button
                    type="submit"
                    disabled={testing}
                    className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-60"
                  >
                    {testing ? (
                      <>
                        <RefreshCw size={13} className="animate-spin" />
                        Đang kiểm tra kết nối...
                      </>
                    ) : (
                      <>
                        <Globe size={13} />
                        Lưu & Kết Nối CSDL
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-3 py-2 border border-slate-300 hover:bg-slate-100 rounded-lg text-xs font-medium text-slate-700 cursor-pointer"
                  >
                    Mặc định
                  </button>
                </div>
              </form>

              {/* Tùy chọn ẩn hiện icon */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
                <span>Trạng thái nút nổi ở góc màn hình:</span>
                <button
                  type="button"
                  onClick={() => {
                    const next = !isHidden;
                    setIsHidden(next);
                    localStorage.setItem('hide_db_badge', String(next));
                  }}
                  className="text-orange-600 hover:underline font-medium cursor-pointer"
                >
                  {isHidden ? '👁️ Hiện lại nút nổi' : '🙈 Ẩn nút nổi (cho web giống thật 100%)'}
                </button>
              </div>
            </div>

            <div className="bg-slate-100 px-6 py-3 flex justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold px-4 py-1.5 rounded-lg cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
