import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { UploadModal } from './components/UploadModal';
import { AuthModal } from './components/AuthModal';
import { LandingPage } from './pages/LandingPage';
import { ExplorePage } from './pages/ExplorePage';
import { NoteDetailPage } from './pages/NoteDetailPage';
import { UserDashboardPage } from './pages/UserDashboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { OfflineIndicator } from './components/OfflineIndicator';
import { PWAUpdateToast } from './components/PWAUpdateToast';
import { api } from './services/api';
import { Note } from './types';

function MainApp() {
  const { user, isAuthenticated, isAdmin } = useAuth();

  // Navigation state
  const [currentView, setCurrentView] = useState<'landing' | 'explore' | 'note-detail' | 'dashboard' | 'profile' | 'admin'>('landing');
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [exploreFilter, setExploreFilter] = useState<string | undefined>(undefined);

  // Global upload modal state
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // Trending notes for Landing page
  const [trendingNotes, setTrendingNotes] = useState<Note[]>([]);

  useEffect(() => {
    // Check URL parameters for direct link sharing or PWA shortcuts e.g. ?note=..., ?action=upload, ?view=explore
    const urlParams = new URLSearchParams(window.location.search);
    const noteParam = urlParams.get('note');
    const viewParam = urlParams.get('view');
    const actionParam = urlParams.get('action');

    if (noteParam) {
      setSelectedNoteId(noteParam);
      setCurrentView('note-detail');
    } else if (viewParam === 'explore') {
      setCurrentView('explore');
    } else if (viewParam === 'dashboard') {
      setCurrentView('dashboard');
    }

    if (actionParam === 'upload') {
      setIsUploadOpen(true);
    }

    // Load trending notes for landing page
    api.getNotes({ sortBy: 'downloads', limit: 6 })
      .then(res => setTrendingNotes(res.notes))
      .catch(() => {});
  }, []);

  const handleNavigate = (view: string, param?: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (view === 'note-detail' && param) {
      setSelectedNoteId(param);
      setCurrentView('note-detail');
      return;
    }

    if (view === 'profile' && param) {
      setSelectedUserId(param);
      setCurrentView('profile');
      return;
    }

    if (view === 'explore') {
      setExploreFilter(param);
      setCurrentView('explore');
      return;
    }

    if (view === 'admin' && !isAdmin) {
      // Fallback
      setCurrentView('landing');
      return;
    }

    setCurrentView(view as any);
  };

  const handleSearchSubmit = (query: string) => {
    setExploreFilter(query);
    setCurrentView('explore');
  };

  const handleUploadSuccess = (noteId: string) => {
    setSelectedNoteId(noteId);
    setCurrentView('note-detail');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Offline Status Banner */}
      <OfflineIndicator />

      {/* Top Navigation Bar */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenUpload={() => setIsUploadOpen(true)}
        onSearchSubmit={handleSearchSubmit}
      />

      {/* Main Routed Content */}
      <main className="flex-1">
        {currentView === 'landing' && (
          <LandingPage
            trendingNotes={trendingNotes}
            onNavigate={handleNavigate}
            onOpenUpload={() => setIsUploadOpen(true)}
            onSearchSubmit={handleSearchSubmit}
          />
        )}

        {currentView === 'explore' && (
          <ExplorePage
            initialFilter={exploreFilter}
            onNavigate={handleNavigate}
            onAuthorClick={authorId => handleNavigate('profile', authorId)}
          />
        )}

        {currentView === 'note-detail' && selectedNoteId && (
          <NoteDetailPage
            noteId={selectedNoteId}
            onNavigate={handleNavigate}
            onAuthorClick={authorId => handleNavigate('profile', authorId)}
          />
        )}

        {currentView === 'dashboard' && (
          <UserDashboardPage
            onNavigate={handleNavigate}
            onOpenUpload={() => setIsUploadOpen(true)}
          />
        )}

        {currentView === 'profile' && selectedUserId && (
          <ProfilePage
            userId={selectedUserId}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'admin' && (
          <AdminDashboardPage
            onNavigate={handleNavigate}
          />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Global Upload Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />

      {/* Global Auth Modal */}
      <AuthModal />

      {/* PWA Service Worker Update Notification */}
      <PWAUpdateToast />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <MainApp />
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
