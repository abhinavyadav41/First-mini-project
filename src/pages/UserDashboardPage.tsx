import React, { useState, useEffect } from 'react';
import {
  Upload,
  Bookmark,
  Heart,
  User as UserIcon,
  Download,
  Eye,
  Trash2,
  Edit,
  Plus,
  Building,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { Note, User } from '../types';
import { NoteCard } from '../components/NoteCard';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import { SEED_UNIVERSITIES } from '../data/seedData';

interface UserDashboardPageProps {
  onNavigate: (view: string, param?: string) => void;
  onOpenUpload: () => void;
}

export const UserDashboardPage: React.FC<UserDashboardPageProps> = ({
  onNavigate,
  onOpenUpload,
}) => {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'uploads' | 'saved' | 'liked' | 'profile'>('uploads');

  const [myUploads, setMyUploads] = useState<Note[]>([]);
  const [savedNotes, setSavedNotes] = useState<Note[]>([]);
  const [likedNotes, setLikedNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  // Profile Form state
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [university, setUniversity] = useState(user?.university || 'Stanford University');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Edit Note modal state
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, [user?.id]);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setBio(user.bio || '');
      setUniversity(user.university);
      setAvatar(user.avatar || '');
    }
  }, [user]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [uploadsRes, savedRes, likedRes] = await Promise.all([
        api.getUserUploads(),
        api.getUserSaved(),
        api.getUserLiked(),
      ]);
      setMyUploads(uploadsRes.notes);
      setSavedNotes(savedRes.notes);
      setLikedNotes(likedRes.notes);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!confirm('Are you sure you want to delete this study note? This action cannot be undone.')) return;
    try {
      await api.deleteNote(noteId);
      setMyUploads(prev => prev.filter(n => n.id !== noteId));
      showToast('Note deleted successfully', 'info');
    } catch {
      showToast('Failed to delete note', 'error');
    }
  };

  const handleOpenEdit = (note: Note) => {
    setEditingNote(note);
    setEditTitle(note.title);
    setEditDescription(note.description);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNote) return;

    try {
      const res = await api.updateNote(editingNote.id, {
        title: editTitle,
        description: editDescription,
      });
      setMyUploads(prev => prev.map(n => n.id === editingNote.id ? res.note : n));
      setEditingNote(null);
      showToast('Note updated successfully', 'success');
    } catch {
      showToast('Failed to update note', 'error');
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      await updateProfile({ name, bio, university, avatar });
      showToast('Profile updated!', 'success');
    } catch {
      showToast('Failed to update profile', 'error');
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Compute metrics
  const totalDownloadsReceived = myUploads.reduce((acc, curr) => acc + (curr.downloads || 0), 0);
  const totalViewsReceived = myUploads.reduce((acc, curr) => acc + (curr.views || 0), 0);
  const totalLikesReceived = myUploads.reduce((acc, curr) => acc + (curr.likesCount || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Profile Header & Summary */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={user?.avatar}
              alt={user?.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-indigo-500/10 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {user?.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                  {user?.role === 'admin' ? '🛡️ Administrator' : '🎓 Verified Student'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-indigo-600" />
                {user?.university}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 max-w-xl line-clamp-2">
                {user?.bio || 'Passionate student exploring and sharing structured course materials.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onOpenUpload}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all"
            >
              <Upload className="w-4 h-4" />
              <span>Upload New Note</span>
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold transition-colors"
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* Aggregate KPI Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <Upload className="w-4 h-4 text-indigo-600" />
              <span>Uploaded Notes</span>
            </div>
            <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
              {myUploads.length}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <Download className="w-4 h-4 text-emerald-600" />
              <span>Downloads Received</span>
            </div>
            <p className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              {totalDownloadsReceived.toLocaleString()}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <Heart className="w-4 h-4 text-rose-500" />
              <span>Likes Received</span>
            </div>
            <p className="text-xl sm:text-2xl font-black text-rose-500 mt-1">
              {totalLikesReceived}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <Bookmark className="w-4 h-4 text-amber-500" />
              <span>Saved Bookmarks</span>
            </div>
            <p className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
              {savedNotes.length}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2 sm:gap-6 text-xs sm:text-sm font-bold overflow-x-auto">
        <button
          onClick={() => setActiveTab('uploads')}
          className={`pb-3.5 px-2 border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'uploads'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Upload className="w-4 h-4" />
          <span>My Uploads ({myUploads.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('saved')}
          className={`pb-3.5 px-2 border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'saved'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Saved Notes ({savedNotes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('liked')}
          className={`pb-3.5 px-2 border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'liked'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Liked Notes ({likedNotes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3.5 px-2 border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'profile'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <UserIcon className="w-4 h-4" />
          <span>Account Settings</span>
        </button>
      </div>

      {/* Tab 1: My Uploads */}
      {activeTab === 'uploads' && (
        <div className="space-y-4">
          {myUploads.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-8">
              <Upload className="w-12 h-12 text-indigo-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                You haven't uploaded any study materials yet
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-6">
                Share your lecture notes, summaries, or formula sheets to help fellow students and build your contributor score.
              </p>
              <button
                onClick={onOpenUpload}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm"
              >
                Upload First Note
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {myUploads.map(note => (
                <div
                  key={note.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm gap-4"
                >
                  <div
                    onClick={() => onNavigate('note-detail', note.id)}
                    className="flex-1 cursor-pointer"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                        {note.subject}
                      </span>
                      <span className="text-xs text-slate-400">
                        {note.course} • {note.semester}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white hover:text-indigo-600 transition-colors">
                      {note.title}
                    </h4>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                      <span>{note.downloads} Downloads</span>
                      <span>•</span>
                      <span>{note.views} Views</span>
                      <span>•</span>
                      <span>{note.likesCount} Likes</span>
                    </div>
                  </div>

                  {/* Actions: Edit & Delete */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEdit(note)}
                      className="p-2 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                      title="Edit note metadata"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="p-2 rounded-xl text-slate-600 hover:text-rose-600 hover:bg-rose-50 dark:text-slate-300 dark:hover:bg-rose-950/40 transition-colors"
                      title="Delete note"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Saved Notes */}
      {activeTab === 'saved' && (
        <div>
          {savedNotes.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-8">
              <Bookmark className="w-12 h-12 text-amber-500 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                No bookmarked notes yet
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-6">
                Click the bookmark icon on any note in the Explore feed to save it here for fast exam revision.
              </p>
              <button
                onClick={() => onNavigate('explore')}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm"
              >
                Browse Explore Feed
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedNotes.map(note => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onSelect={id => onNavigate('note-detail', id)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Liked Notes */}
      {activeTab === 'liked' && (
        <div>
          {likedNotes.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-8">
              <Heart className="w-12 h-12 text-rose-500 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                No liked notes yet
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-6">
                Like high-quality study materials to show appreciation to authors and bookmark them for reference.
              </p>
              <button
                onClick={() => onNavigate('explore')}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm"
              >
                Find Useful Notes
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {likedNotes.map(note => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onSelect={id => onNavigate('note-detail', id)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Profile Settings */}
      {activeTab === 'profile' && (
        <div className="max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
            Edit Public Profile
          </h3>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Display Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full text-xs sm:text-sm p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                University / Institution
              </label>
              <select
                value={university}
                onChange={e => setUniversity(e.target.value)}
                className="w-full text-xs sm:text-sm p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-200"
              >
                {SEED_UNIVERSITIES.map(u => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Bio / Academic Interests
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={e => setBio(e.target.value)}
                placeholder="What are you studying? What courses do you specialize in?"
                className="w-full text-xs sm:text-sm p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSavingProfile}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all"
              >
                {isSavingProfile ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Note Modal */}
      {editingNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              Edit Note Information
            </h3>
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  className="w-full text-xs sm:text-sm p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editDescription}
                  onChange={e => setEditDescription(e.target.value)}
                  className="w-full text-xs sm:text-sm p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingNote(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 dark:text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
