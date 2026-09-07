import React, { useState } from 'react';
import { FileText, Heart, Download, Eye, Bookmark, Calendar, Building, Sparkles } from 'lucide-react';
import { Note } from '../types';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';

interface NoteCardProps {
  note: Note;
  onSelect: (noteId: string) => void;
  onAuthorClick?: (authorId: string) => void;
  layout?: 'grid' | 'list';
}

export const NoteCard: React.FC<NoteCardProps> = ({
  note,
  onSelect,
  onAuthorClick,
  layout = 'grid',
}) => {
  const { isAuthenticated, openAuthModal } = useAuth();
  const { showToast } = useToast();

  const [isLiked, setIsLiked] = useState<boolean>(!!note.isLiked);
  const [likesCount, setLikesCount] = useState<number>(note.likesCount);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(!!note.isBookmarked);
  const [isLiking, setIsLiking] = useState(false);
  const [isBookmarking, setIsBookmarking] = useState(false);

  const handleToggleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }
    if (isLiking) return;
    setIsLiking(true);

    // Optimistic UI
    const prevLiked = isLiked;
    const prevCount = likesCount;
    setIsLiked(!prevLiked);
    setLikesCount(prevLiked ? prevCount - 1 : prevCount + 1);

    try {
      const res = await api.toggleLike(note.id);
      setIsLiked(res.isLiked);
      setLikesCount(res.likesCount);
    } catch {
      setIsLiked(prevLiked);
      setLikesCount(prevCount);
      showToast('Could not update like', 'error');
    } finally {
      setIsLiking(false);
    }
  };

  const handleToggleBookmark = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }
    if (isBookmarking) return;
    setIsBookmarking(true);

    // Optimistic UI
    const prevBookmarked = isBookmarked;
    setIsBookmarked(!prevBookmarked);

    try {
      const res = await api.toggleBookmark(note.id);
      setIsBookmarked(res.isBookmarked);
      showToast(res.isBookmarked ? 'Saved to bookmarks!' : 'Removed from bookmarks', 'info');
    } catch {
      setIsBookmarked(prevBookmarked);
      showToast('Could not update bookmark', 'error');
    } finally {
      setIsBookmarking(false);
    }
  };

  const formattedDate = new Date(note.createdAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });

  const formatNumber = (num: number) => {
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  if (layout === 'list') {
    return (
      <div
        onClick={() => onSelect(note.id)}
        className="group relative flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-900 transition-all cursor-pointer gap-4"
      >
        <div className="flex items-start gap-3.5 flex-1 min-w-0">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-100 dark:border-indigo-800 group-hover:scale-105 transition-transform">
            <FileText className="w-6 h-6" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                {note.subject}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {note.course} • {note.semester}
              </span>
            </div>

            <h3 className="text-base font-bold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {note.title}
            </h3>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1.5">
              <span
                onClick={e => {
                  e.stopPropagation();
                  onAuthorClick?.(note.authorId);
                }}
                className="hover:text-indigo-600 dark:hover:text-indigo-400 font-medium cursor-pointer"
              >
                {note.author.name}
              </span>
              <span>•</span>
              <span className="truncate">{note.university}</span>
              <span>•</span>
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>

        {/* Right action & stats */}
        <div className="flex items-center gap-4 shrink-0 w-full sm:w-auto justify-between sm:justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <button
              onClick={handleToggleLike}
              className={`flex items-center gap-1 hover:text-rose-500 transition-colors ${
                isLiked ? 'text-rose-500 font-bold' : ''
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>{formatNumber(likesCount)}</span>
            </button>
            <div className="flex items-center gap-1">
              <Download className="w-4 h-4 text-slate-400" />
              <span>{formatNumber(note.downloads)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4 text-slate-400" />
              <span>{formatNumber(note.views)}</span>
            </div>
          </div>

          <button
            onClick={handleToggleBookmark}
            aria-label="Bookmark note"
            className={`p-2 rounded-xl transition-colors ${
              isBookmarked
                ? 'bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400'
                : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500 text-amber-500' : ''}`} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => onSelect(note.id)}
      className="group relative flex flex-col justify-between p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-indigo-300 dark:hover:border-indigo-800 transition-all duration-200 cursor-pointer overflow-hidden"
    >
      {/* Top Header with PDF badge & Bookmark */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500/10 to-indigo-600/20 dark:from-indigo-950/60 dark:to-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-800/80 group-hover:scale-110 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300">
                {note.subject}
              </span>
            </div>
          </div>

          <button
            onClick={handleToggleBookmark}
            aria-label="Bookmark note"
            className={`p-2 rounded-xl transition-colors ${
              isBookmarked
                ? 'bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400'
                : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500 text-amber-500' : ''}`} />
          </button>
        </div>

        {/* Note Title */}
        <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {note.title}
        </h3>

        {/* Subtitle / Course / Semester */}
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium flex items-center gap-1.5 truncate">
          <span>{note.course}</span>
          <span>•</span>
          <span className="truncate">{note.semester}</span>
        </p>

        {/* Description preview */}
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
          {note.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mt-3">
          {note.tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
            >
              #{tag}
            </span>
          ))}
          {note.tags.length > 3 && (
            <span className="text-[10px] text-slate-400 py-0.5">
              +{note.tags.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Footer Details: Author & Stats */}
      <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <div
            onClick={e => {
              e.stopPropagation();
              onAuthorClick?.(note.authorId);
            }}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <img
              src={note.author.avatar}
              alt={note.author.name}
              className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
            />
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-[120px]">
                {note.author.name}
              </p>
              <p className="text-[10px] text-slate-400 truncate max-w-[120px]">
                {note.university}
              </p>
            </div>
          </div>
          <span className="text-[10px] text-slate-400">
            {formattedDate}
          </span>
        </div>

        {/* Engagement Stats: Likes, Downloads, Views */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
          <button
            onClick={handleToggleLike}
            className={`flex items-center gap-1.5 hover:text-rose-500 transition-colors ${
              isLiked ? 'text-rose-500 font-bold' : ''
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span>{formatNumber(likesCount)}</span>
          </button>

          <div className="flex items-center gap-1.5" title="Total downloads">
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>{formatNumber(note.downloads)}</span>
          </div>

          <div className="flex items-center gap-1.5" title="Total views">
            <Eye className="w-3.5 h-3.5 text-slate-400" />
            <span>{formatNumber(note.views)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
