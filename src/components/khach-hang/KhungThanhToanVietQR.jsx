import React, { useState, useEffect } from 'react';
import { QrCode, Copy, Check, ShieldCheck, Download, ExternalLink, Sparkles, CheckCircle2, Clock, AlertCircle, RefreshCw, Eye } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useOrders } from '../../context/OrderContext';

export default function KhungThanhToanVietQR({
  orderId,
  amount,
  isPaid = false,
  onPaymentConfirmed,
  compact = false
}) {
  const { confirmPayment } = useOrders();
  const [copiedField, setCopiedField] = useState(null);
  const [isSuccessPaid, setIsSuccessPaid] = useState(isPaid);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 phút
  const [showFullPoster, setShowFullPoster] = useState(false);

  useEffect(() => {
    setIsSuccessPaid(isPaid);
  }, [isPaid]);

  // Đếm ngược 15 phút
  useEffect(() => {
    if (isSuccessPaid) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isSuccessPaid]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCopy = (text, fieldName) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  const handleConfirmPaid = () => {
    if (confirmPayment && orderId) {
      confirmPayment(orderId);
    }
    setIsSuccessPaid(true);
    if (onPaymentConfirmed) {
      onPaymentConfirmed();
    }
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }
  };

  const transferMemo = orderId ? `TT ${orderId}` : 'THANH TOAN DON HANG';

  return (
    <div className="bg-gradient-to-b from-blue-50/60 to-white rounded-3xl border border-blue-200/80 p-5 sm:p-7 shadow-lg space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-blue-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
            <QrCode size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-slate-900 text-base">Thanh Toán Bằng Mã VietQR</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">MB Bank</span>
            </div>
            <p className="text-xs text-slate-500">Quét mã bằng app mọi ngân hàng & ví điện tử</p>
          </div>
        </div>

        {/* Trạng thái thanh toán hoặc Đếm ngược */}
        {isSuccessPaid ? (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold shadow-xs">
            <CheckCircle2 size={16} className="text-emerald-600" />
            <span>Đã xác nhận thanh toán</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-xs">
            <Clock size={14} className="text-orange-500 animate-pulse" />
            <span>Thời gian thanh toán:</span>
            <span className="font-mono font-bold text-orange-600 text-sm">{formatTime(timeLeft)}</span>
          </div>
        )}
      </div>

      {/* Main Grid: QR image + Transfer Info */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* QR Code Container */}
        <div className="md:col-span-5 flex flex-col items-center">
          <div className="relative group p-2 bg-white rounded-2xl border-2 border-blue-100 shadow-md transition-all hover:shadow-xl hover:border-blue-300">
            <img
              src={showFullPoster ? '/qr-payment-clean.png' : '/qr-card-clean.png'}
              alt="Mã QR thanh toán MB Bank"
              className={`rounded-xl object-contain transition-all ${
                showFullPoster ? 'max-h-[380px] w-auto' : 'w-56 sm:w-60 h-auto'
              }`}
            />

            {/* Cảnh báo / Badge xác minh */}
            <div className="absolute top-4 right-4 bg-emerald-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1 backdrop-blur-xs">
              <ShieldCheck size={12} />
              MB Napas247
            </div>
          </div>

          {/* Công cụ ảnh QR */}
          <div className="flex items-center gap-2 mt-3 text-xs">
            <a
              href={showFullPoster ? '/qr-payment-clean.png' : '/qr-card-clean.png'}
              download="Ma-QR-Thanh-Toan-GiaDungSmart.png"
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Tải mã QR về điện thoại"
            >
              <Download size={13} />
              <span>Tải mã QR</span>
            </a>
            <button
              type="button"
              onClick={() => setShowFullPoster(!showFullPoster)}
              className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Eye size={13} />
              <span>{showFullPoster ? 'Mã gọn' : 'Xem ảnh gốc'}</span>
            </button>
          </div>
        </div>

        {/* Thông tin chuyển khoản */}
        <div className="md:col-span-7 space-y-3.5">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 shadow-xs text-xs">
            {/* Ngân hàng */}
            <div className="flex justify-between items-center py-1 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Ngân hàng thụ hưởng:</span>
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-600 inline-block"></span>
                MB Bank (Ngân hàng TMCP Quân Đội)
              </span>
            </div>

            {/* Chủ tài khoản */}
            <div className="flex justify-between items-center py-1 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Tên chủ tài khoản:</span>
              <span className="font-bold text-blue-700 tracking-wide">
                TRAN KHANH DONG
              </span>
            </div>

            {/* Số tài khoản - Đã xóa / ẩn theo yêu cầu */}
            <div className="flex justify-between items-center py-1 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Số tài khoản:</span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded text-[11px] italic">
                  •••••••••• (Đã bảo mật theo yêu cầu)
                </span>
                <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-1">
                  <ShieldCheck size={11} /> Tự nhận diện khi quét QR
                </span>
              </div>
            </div>

            {/* Số tiền thanh toán */}
            <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Số tiền thanh toán:</span>
              <div className="flex items-center gap-2">
                <span className="font-black text-orange-600 text-base">
                  {(amount || 0).toLocaleString('vi-VN')} đ
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(amount.toString(), 'amount')}
                  className="p-1.5 text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  title="Sao chép số tiền"
                >
                  {copiedField === 'amount' ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                </button>
              </div>
            </div>

            {/* Nội dung chuyển khoản */}
            <div className="flex justify-between items-center py-1.5">
              <div>
                <span className="text-slate-500 font-medium block">Nội dung chuyển khoản:</span>
                <span className="text-[10px] text-slate-400 italic">Vui lòng ghi đúng để hệ thống tự động xác nhận</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-blue-900 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200 text-xs">
                  {transferMemo}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(transferMemo, 'memo')}
                  className="p-1.5 text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  title="Sao chép nội dung"
                >
                  {copiedField === 'memo' ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                </button>
              </div>
            </div>
          </div>

          {/* Hướng dẫn 3 bước */}
          <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-3.5 text-[11px] text-slate-600 space-y-1.5">
            <p className="font-bold text-blue-900 flex items-center gap-1.5">
              <Sparkles size={14} className="text-blue-600" />
              Cách thanh toán đơn giản trong 3 bước:
            </p>
            <ol className="list-decimal list-inside space-y-1 pl-1 text-slate-600">
              <li>Mở ứng dụng <b>Ngân hàng (MB, VCB, TCB...)</b> hoặc <b>MoMo, ZaloPay</b></li>
              <li>Chọn biểu tượng <b>Quét QR</b> và quét mã bên cạnh</li>
              <li>Kiểm tra tên người nhận <b>TRAN KHANH DONG</b> và xác nhận chuyển khoản</li>
            </ol>
          </div>

          {/* Nút bấm xác nhận đã chuyển khoản */}
          {!isSuccessPaid ? (
            <button
              type="button"
              onClick={handleConfirmPaid}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <CheckCircle2 size={16} />
              <span>Tôi Đã Chuyển Khoản Xong</span>
            </button>
          ) : (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-center gap-2 text-emerald-800 text-xs font-bold">
              <CheckCircle2 size={16} className="text-emerald-600" />
              <span>Hệ thống đã ghi nhận! Đơn hàng sẽ được chuẩn bị ngay.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
