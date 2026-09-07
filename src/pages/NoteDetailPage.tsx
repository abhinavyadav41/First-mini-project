import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Calendar,
  Building,
  GraduationCap,
  Download,
  Heart,
  Bookmark,
  Share2,
  AlertTriangle,
  Eye,
  FileText,
  User,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { Note } from '../types';
import { DocumentViewer } from '../components/DocumentViewer';
import { CommentSection } from '../components/CommentSection';
import { NoteCard } from '../components/NoteCard';
import { ShareModal } from '../components/ShareModal';
import { ReportModal } from '../components/ReportModal';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';

interface NoteDetailPageProps {
  noteId: string;
  onNavigate: (view: string, param?: string) => void;
  onAuthorClick: (authorId: string) => void;
}

export const NoteDetailPage: React.FC<NoteDetailPageProps> = ({
  noteId,
  onNavigate,
  onAuthorClick,
}) => {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const { showToast } = useToast();

  const [note, setNote] = useState<Note | null>(null);
  const [relatedNotes, setRelatedNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  // Engagement states
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [downloadsCount, setDownloadsCount] = useState(0);

  useEffect(() => {
    loadNote();
  }, [noteId]);

  const loadNote = async () => {
    setLoading(true);
    try {
      const res = await api.getNoteById(noteId);
      setNote(res.note);
      setIsLiked(!!res.note.isLiked);
      setLikesCount(res.note.likesCount);
      setIsBookmarked(!!res.note.isBookmarked);
      setDownloadsCount(res.note.downloads);

      // Fetch related notes from the same subject
      const related = await api.getNotes({ subject: res.note.subject, limit: 4 });
      setRelatedNotes(related.notes.filter(n => n.id !== noteId).slice(0, 3));
    } catch {
      showToast('Could not load note details', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleLike = async () => {
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }
    const prevLiked = isLiked;
    const prevCount = likesCount;
    setIsLiked(!prevLiked);
    setLikesCount(prevLiked ? prevCount - 1 : prevCount + 1);

    try {
      const res = await api.toggleLike(noteId);
      setIsLiked(res.isLiked);
      setLikesCount(res.likesCount);
    } catch {
      setIsLiked(prevLiked);
      setLikesCount(prevCount);
    }
  };

  const handleToggleBookmark = async () => {
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }
    const prev = isBookmarked;
    setIsBookmarked(!prev);
    try {
      const res = await api.toggleBookmark(noteId);
      setIsBookmarked(res.isBookmarked);
      showToast(res.isBookmarked ? 'Added to your bookmarks' : 'Removed from bookmarks', 'info');
    } catch {
      setIsBookmarked(prev);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-500">Loading verified notes...</p>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Note not found</h2>
        <p className="text-xs text-slate-500 mt-1 mb-6">The requested document might have been removed or set to private.</p>
        <button
          onClick={() => onNavigate('explore')}
          className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl"
        >
          Return to Explore
        </button>
      </div>
    );
  }

  const formattedDate = new Date(note.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumbs & Navigation */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => onNavigate('explore')}
          className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Explore</span>
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
          <span className="hover:underline cursor-pointer" onClick={() => onNavigate('landing')}>Home</span>
          <span>/</span>
          <span className="hover:underline cursor-pointer" onClick={() => onNavigate('explore')}>Explore</span>
          <span>/</span>
          <span className="text-slate-600 dark:text-slate-300 font-medium truncate max-w-xs">{note.subject}</span>
        </div>
      </div>

      {/* Note Header & Summary */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-3 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800">
                {note.subject}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                {note.course} • {note.semester}
              </span>
              {note.visibility === 'private' && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  Private Note
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              {note.title}
            </h1>

            {/* University & Upload Date */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5 font-medium">
                <Building className="w-3.5 h-3.5 text-indigo-600" />
                {note.university}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Published {formattedDate}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-slate-400" />
                {note.views.toLocaleString()} Total Views
              </span>
            </div>
          </div>

          {/* Author Card snippet */}
          <div
            onClick={() => onAuthorClick(note.authorId)}
            className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-700 transition-all shrink-0"
          >
            <img
              src={note.author.avatar}
              alt={note.author.name}
              className="w-12 h-12 rounded-xl object-cover ring-2 ring-indigo-500/20"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-bold text-slate-900 dark:text-white">{note.author.name}</p>
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">{note.author.university}</p>
              <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline mt-0.5 inline-block">
                View Contributor Profile →
              </span>
            </div>
          </div>
        </div>

        {/* Engagement Action Bar */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {/* Like */}
            <button
              onClick={handleToggleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                isLiked
                  ? 'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/60 dark:border-rose-900 dark:text-rose-300'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-rose-300'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>{likesCount} Likes</span>
            </button>

            {/* Bookmark */}
            <button
              onClick={handleToggleBookmark}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                isBookmarked
                  ? 'bg-amber-50 border-amber-200 text-amber-600 dark:bg-amber-950/60 dark:border-amber-900 dark:text-amber-300'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-amber-300'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500 text-amber-500' : ''}`} />
              <span>{isBookmarked ? 'Saved to Bookmarks' : 'Bookmark'}</span>
            </button>

            {/* Share */}
            <button
              onClick={() => setIsShareOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <Share2 className="w-4 h-4 text-slate-500" />
              <span>Share</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* Report */}
            <button
              onClick={() => setIsReportOpen(true)}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-rose-600 transition-colors"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Report Issue</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Layout: Document Viewer (Left/Top) + Details (Right/Below) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Document Interactive Viewer */}
        <div className="lg:col-span-2 space-y-6">
          <DocumentViewer
            note={note}
            onDownloadSuccess={() => setDownloadsCount(prev => prev + 1)}
          />

          {/* Description & Syllabus details */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Course Material Overview
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
              {note.description}
            </p>

            {/* Tags */}
            <div className="pt-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Document Topics
              </span>
              <div className="flex flex-wrap gap-2">
                {note.tags.map(t => (
                  <span
                    key={t}
                    onClick={() => onNavigate('explore', t)}
                    className="text-xs font-semibold px-3 py-1 rounded-xl bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 dark:bg-slate-800 dark:hover:bg-indigo-950/60 dark:text-slate-300 dark:hover:text-indigo-300 cursor-pointer transition-colors"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Comments & Discussion */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8">
            <CommentSection noteId={note.id} />
          </div>
        </div>

        {/* Sidebar: File Metadata & Related Notes */}
        <div className="space-y-6">
          {/* Metadata Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600" />
              <span>Document Details</span>
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">File Name</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[160px]">
                  {note.fileName}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">File Size</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {(note.fileSize / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Page Count</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {note.pageCount} Pages
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Downloads</span>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                  {downloadsCount.toLocaleString()} Total
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Format</span>
                <span className="font-bold text-slate-700 dark:text-slate-300 uppercase">
                  PDF
                </span>
              </div>
            </div>
          </div>

          {/* Related Notes */}
          {relatedNotes.length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Related in {note.subject}</span>
              </h3>

              <div className="space-y-3">
                {relatedNotes.map(rel => (
                  <div
                    key={rel.id}
                    onClick={() => onNavigate('note-detail', rel.id)}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 cursor-pointer transition-all"
                  >
                    <p className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1 hover:text-indigo-600">
                      {rel.title}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {rel.course} • {rel.author.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        note={note}
      />

      {/* Report Modal */}
      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        noteId={note.id}
        noteTitle={note.title}
      />
    </div>
  );
};
