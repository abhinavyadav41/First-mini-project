import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Trash2 } from 'lucide-react';
import { Comment } from '../types';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';

interface CommentSectionProps {
  noteId: string;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ noteId }) => {
  const { user, isAuthenticated, isAdmin, openAuthModal } = useAuth();
  const { showToast } = useToast();

  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadComments();
  }, [noteId]);

  const loadComments = async () => {
    try {
      const res = await api.getComments(noteId);
      setComments(res.comments);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await api.addComment(noteId, newComment.trim());
      setComments(prev => [res.comment, ...prev]);
      setNewComment('');
      showToast('Comment posted!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to post comment', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;
    try {
      await api.deleteComment(commentId);
      setComments(prev => prev.filter(c => c.id !== commentId));
      showToast('Comment removed', 'info');
    } catch {
      showToast('Failed to delete comment', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-indigo-600" />
          <span>Discussion & Peer Feedback ({comments.length})</span>
        </h3>
      </div>

      {/* Add comment form */}
      <form onSubmit={handlePostComment} className="flex gap-3 items-start">
        <img
          src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Guest'}
          alt="Avatar"
          className="w-9 h-9 rounded-xl object-cover ring-2 ring-indigo-500/20 shrink-0"
        />
        <div className="flex-1 relative">
          <textarea
            rows={2}
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            placeholder={
              isAuthenticated
                ? 'Ask a question about these notes or leave peer review...'
                : 'Sign in to ask questions or share feedback...'
            }
            className="w-full text-xs sm:text-sm p-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all resize-none"
          />
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              disabled={isSubmitting || !newComment.trim()}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold shadow-sm transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Post Comment</span>
            </button>
          </div>
        </div>
      </form>

      {/* Comment List */}
      <div className="space-y-3 pt-2">
        {loading ? (
          <div className="py-6 text-center text-xs text-slate-400">Loading comments...</div>
        ) : comments.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
            No peer comments yet. Be the first to start the discussion!
          </div>
        ) : (
          comments.map(c => {
            const canDelete = user && (user.id === c.userId || isAdmin);
            const dateStr = new Date(c.createdAt).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={c.id}
                className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 flex gap-3 text-xs"
              >
                <img
                  src={c.user.avatar}
                  alt={c.user.name}
                  className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {c.user.name}
                      </span>
                      <span className="text-[10px] text-slate-400 truncate max-w-[140px]">
                        {c.user.university}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400">{dateStr}</span>
                      {canDelete && (
                        <button
                          onClick={() => handleDeleteComment(c.id)}
                          aria-label="Delete comment"
                          className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="mt-1 text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {c.content}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
