import React, { useState, useEffect } from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) {
    return null;
  }

  const handleRetry = async () => {
    setIsChecking(true);
    try {
      // Test connectivity
      await fetch('/api/health', { method: 'HEAD', cache: 'no-store' });
      setIsOffline(false);
    } catch {
      setIsOffline(true);
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div
      id="offline-status-banner"
      role="status"
      aria-live="polite"
      className="bg-amber-500/90 dark:bg-amber-600/90 text-slate-950 font-medium px-4 py-2.5 shadow-md flex items-center justify-between text-xs transition-all z-50 sticky top-0 backdrop-blur-md"
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <WifiOff className="w-4 h-4 shrink-0" />
        <div className="min-w-0">
          <span className="font-bold">You're Offline.</span>{' '}
          <span className="opacity-90">Some NoteNest features require an internet connection.</span>
        </div>
      </div>

      <button
        onClick={handleRetry}
        disabled={isChecking}
        className="ml-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-950 text-white hover:bg-slate-900 font-bold shrink-0 transition-colors disabled:opacity-50"
      >
        <RefreshCw className={`w-3 h-3 ${isChecking ? 'animate-spin' : ''}`} />
        <span>Try Again</span>
      </button>
    </div>
  );
};

export const OfflineFallbackView: React.FC = () => {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div
      id="offline-fallback-view"
      className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center"
    >
      <div className="w-20 h-20 rounded-3xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/50 flex items-center justify-center shadow-lg shadow-indigo-600/10 mb-6">
        <WifiOff className="w-9 h-9" />
      </div>
      <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
        You're Offline
      </h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6 leading-relaxed">
        Some NoteNest features require an internet connection.
      </p>
      <button
        onClick={handleReload}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/25 transition-all"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        <span>Try Again</span>
      </button>
      <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-6 uppercase tracking-wider font-semibold">
        NoteNest Academic Hub
      </p>
    </div>
  );
};
