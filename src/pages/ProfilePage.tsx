import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Building,
  GraduationCap,
  Download,
  Eye,
  FileText,
  Calendar,
  CheckCircle2,
  FolderOpen,
} from 'lucide-react';
import { Note, User } from '../types';
import { NoteCard } from '../components/NoteCard';
import { api } from '../services/api';

interface ProfilePageProps {
  userId: string;
  onNavigate: (view: string, param?: string) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  userId,
  onNavigate,
}) => {
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [userNotes, setUserNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, [userId]);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const res = await api.getUserPublicProfile(userId);
      setProfileUser(res.user);
      setUserNotes(res.uploads);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-500">Loading scholar profile...</p>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Scholar Not Found</h2>
        <p className="text-xs text-slate-500 mt-1 mb-6">This user profile could not be located.</p>
        <button
          onClick={() => onNavigate('explore')}
          className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl"
        >
          Return to Explore
        </button>
      </div>
    );
  }

  const totalDownloads = userNotes.reduce((acc, curr) => acc + (curr.downloads || 0), 0);
  const totalViews = userNotes.reduce((acc, curr) => acc + (curr.views || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <div>
        <button
          onClick={() => onNavigate('explore')}
          className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Notes</span>
        </button>
      </div>

      {/* Author Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <img
            src={profileUser.avatar}
            alt={profileUser.name}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-4 ring-indigo-500/10 shadow-md"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                {profileUser.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                🎓 Verified Contributor
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-indigo-600" />
              {profileUser.university}
            </p>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-3 max-w-2xl leading-relaxed">
              {profileUser.bio}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
          <div className="p-3">
            <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {userNotes.length}
            </p>
            <p className="text-xs font-semibold text-slate-400 mt-0.5">Published Notes</p>
          </div>
          <div className="p-3">
            <p className="text-xl sm:text-2xl font-black text-indigo-600 dark:text-indigo-400">
              {totalDownloads.toLocaleString()}
            </p>
            <p className="text-xs font-semibold text-slate-400 mt-0.5">Downloads Garnered</p>
          </div>
          <div className="p-3">
            <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {totalViews.toLocaleString()}
            </p>
            <p className="text-xs font-semibold text-slate-400 mt-0.5">Cumulative Views</p>
          </div>
        </div>
      </div>

      {/* Notes Published by User */}
      <div className="space-y-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Study Materials by {profileUser.name} ({userNotes.length})
        </h2>

        {userNotes.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-8">
            <FolderOpen className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-xs text-slate-400">No public materials published yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {userNotes.map(note => (
              <NoteCard
                key={note.id}
                note={note}
                onSelect={id => onNavigate('note-detail', id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
