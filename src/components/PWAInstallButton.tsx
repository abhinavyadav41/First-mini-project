import React from 'react';
import { Download, Smartphone, Share, PlusSquare, X, CheckCircle2 } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  variant?: 'button' | 'menu-item' | 'banner';
  className?: string;
  onInstalled?: () => void;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  variant = 'button',
  className = '',
  onInstalled,
}) => {
  const { canInstall, isInstalled, isIOS, showIOSModal, promptInstall, dismissIOSModal } = usePWAInstall();

  // If already installed, don't show install buttons
  if (isInstalled || !canInstall) {
    return null;
  }

  const handleClick = () => {
    promptInstall();
    onInstalled?.();
  };

  return (
    <>
      {variant === 'button' && (
        <button
          onClick={handleClick}
          id="pwa-install-btn"
          aria-label="Install NoteNest App"
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/80 text-indigo-700 dark:text-indigo-300 text-xs font-bold border border-indigo-200/60 dark:border-indigo-800/80 transition-all shadow-sm ${className}`}
        >
          <Download className="w-3.5 h-3.5" />
          <span>Install App</span>
        </button>
      )}

      {variant === 'menu-item' && (
        <button
          onClick={handleClick}
          id="pwa-install-menu-item"
          className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-left ${className}`}
        >
          <Download className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <div className="flex-1 min-w-0">
            <p className="font-bold text-slate-900 dark:text-white">Install NoteNest</p>
            <p className="text-[10px] text-slate-500 truncate">Run natively on your device</p>
          </div>
        </button>
      )}

      {variant === 'banner' && (
        <div
          id="pwa-install-banner"
          className={`flex items-center justify-between gap-3 p-3 rounded-2xl bg-gradient-to-r from-indigo-900/30 to-violet-900/30 border border-indigo-500/20 text-slate-200 ${className}`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/30 flex items-center justify-center shrink-0 text-indigo-400">
              <Smartphone className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">Install NoteNest App</p>
              <p className="text-[11px] text-slate-400 truncate">Fast access & offline study guides</p>
            </div>
          </div>
          <button
            onClick={handleClick}
            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shrink-0 shadow-sm shadow-indigo-600/30 transition-all"
          >
            Install
          </button>
        </div>
      )}

      {/* iOS Installation Instructions Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Install NoteNest on iOS
                  </h3>
                  <p className="text-[11px] text-slate-500">Add to your Home Screen for app experience</p>
                </div>
              </div>
              <button
                onClick={dismissIOSModal}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <div className="w-6 h-6 rounded-lg bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 font-bold">
                  1
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">Tap the Share button</p>
                  <p className="text-slate-500 text-[11px] mt-0.5 flex items-center gap-1">
                    Tap the Share icon <Share className="w-3.5 h-3.5 inline text-indigo-600 dark:text-indigo-400" /> at the bottom bar of Safari.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <div className="w-6 h-6 rounded-lg bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 font-bold">
                  2
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">Select "Add to Home Screen"</p>
                  <p className="text-slate-500 text-[11px] mt-0.5 flex items-center gap-1">
                    Scroll down the action sheet and tap <PlusSquare className="w-3.5 h-3.5 inline text-indigo-600 dark:text-indigo-400" /> Add to Home Screen.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <div className="w-6 h-6 rounded-lg bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 font-bold">
                  3
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">Tap "Add"</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    Confirm by tapping "Add" in the top-right corner to place NoteNest on your home screen.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={dismissIOSModal}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};
