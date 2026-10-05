import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-sky-500 shrink-0" />
  };

  const borderColors = {
    success: 'border-emerald-500 bg-white text-slate-800',
    error: 'border-rose-500 bg-white text-slate-800',
    info: 'border-sky-500 bg-white text-slate-800'
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-short">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl border-l-4 ${
          borderColors[toast.type || 'info']
        } min-w-[300px] max-w-md`}
      >
        {icons[toast.type || 'info']}
        <div className="flex-1 text-sm font-medium">{toast.message}</div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
