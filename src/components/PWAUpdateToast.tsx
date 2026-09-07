import React from 'react';
import { RefreshCw, Sparkles, X } from 'lucide-react';
import { useRegisterSW } from 'virtual:pwa-register/react';

export const PWAUpdateToast: React.FC = () => {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, r) {
      // Periodic check for SW updates every 60 minutes
      if (r) {
        setInterval(() => {
          r.update();
        }, 60 * 60 * 1000);
      }
    },
    onRegisterError(error) {
      console.error('SW registration error', error);
    },
  });

  if (!needRefresh) {
    return null;
  }

  const handleUpdate = () => {
    updateServiceWorker(true);
  };

  const handleDismiss = () => {
    setNeedRefresh(false);
  };

  return (
    <div
      id="pwa-update-toast"
      className="fixed bottom-5 right-5 z-50 max-w-sm w-[calc(100vw-40px)] bg-slate-900 dark:bg-slate-900 text-white rounded-2xl p-4 shadow-2xl border border-indigo-500/30 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded-xl bg-indigo-600/30 text-indigo-400 flex items-center justify-center shrink-0">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold text-white">New version available</p>
          <p className="text-[11px] text-slate-400 truncate">Update NoteNest to get latest features</p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={handleUpdate}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-sm shadow-indigo-600/40 transition-colors"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Update</span>
        </button>
        <button
          onClick={handleDismiss}
          className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
          aria-label="Dismiss update notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
