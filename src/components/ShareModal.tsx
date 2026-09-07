import React, { useState } from 'react';
import { X, Copy, Check, Share2, Twitter, Linkedin, MessageCircle, Mail } from 'lucide-react';
import { Note } from '../types';
import { useToast } from '../context/ToastContext';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  note: Note;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, note }) => {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareUrl = `${window.location.origin}/?note=${note.id}`;
  const shareText = `Check out "${note.title}" for ${note.course} on NoteNest!`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    showToast('Link copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleTwitterShare = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const handleLinkedInShare = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const handleWhatsAppShare = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Share Study Material
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-4">
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Share <span className="font-bold text-slate-800 dark:text-slate-200">"{note.title}"</span> with study groups, classmates, and Discord servers.
          </p>

          {/* Copy Link input */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 text-xs p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none select-all text-slate-700 dark:text-slate-300 font-mono"
            />
            <button
              onClick={handleCopy}
              className="px-3.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          {/* Social share options */}
          <div className="grid grid-cols-3 gap-2 pt-2">
            <button
              onClick={handleTwitterShare}
              className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-sky-950/40 text-slate-700 dark:text-slate-300 hover:text-sky-600 text-xs font-semibold flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 transition-colors"
            >
              <Twitter className="w-4 h-4 text-sky-500" />
              <span>Twitter / X</span>
            </button>
            <button
              onClick={handleLinkedInShare}
              className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-slate-700 dark:text-slate-300 hover:text-blue-600 text-xs font-semibold flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 transition-colors"
            >
              <Linkedin className="w-4 h-4 text-blue-600" />
              <span>LinkedIn</span>
            </button>
            <button
              onClick={handleWhatsAppShare}
              className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-slate-300 hover:text-emerald-600 text-xs font-semibold flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-emerald-500" />
              <span>WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
