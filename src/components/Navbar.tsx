import React, { useState, useEffect, useRef } from 'react';
import {
  BookOpen,
  Search,
  Upload,
  Compass,
  LayoutDashboard,
  ShieldAlert,
  Bell,
  Sun,
  Moon,
  LogOut,
  User as UserIcon,
  Check,
  CheckCheck,
  Menu,
  X,
  Sparkles,
  ArrowRight,
  Layers,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { api } from '../services/api';
import { NotificationItem } from '../types';
import { PWAInstallButton } from './PWAInstallButton';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, param?: string) => void;
  onOpenUpload: () => void;
  onSearchSubmit: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenUpload,
  onSearchSubmit,
}) => {
  const { user, isAuthenticated, isAdmin, logout, openAuthModal, switchDemoUser } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Fetch notifications
  useEffect(() => {
    if (!isAuthenticated) {
      setNotifications([]);
      return;
    }
    api.getNotifications()
      .then(res => setNotifications(res.notifications))
      .catch(() => {});
  }, [isAuthenticated, user?.id]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = async () => {
    await api.markAllNotificationsRead();
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleNotificationClick = async (notif: NotificationItem) => {
    if (!notif.read) {
      await api.markNotificationRead(notif.id);
      setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
    }
    if (notif.noteId) {
      setIsNotificationsOpen(false);
      onNavigate('note-detail', notif.noteId);
    }
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      onSearchSubmit(searchQuery.trim());
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <button
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2.5 group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="text-left">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 dark:from-white dark:via-indigo-200 dark:to-slate-200 bg-clip-text text-transparent">
                NoteNest
              </span>
              <span className="hidden sm:block text-[10px] uppercase font-bold tracking-widest text-indigo-600 dark:text-indigo-400">
                Study Hub
              </span>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-semibold">
            <button
              onClick={() => onNavigate('explore')}
              className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-all ${
                currentView === 'explore'
                  ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 dark:text-indigo-400'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <Compass className="w-4 h-4" />
              Explore
            </button>
            <button
              onClick={() => onNavigate('explore', 'subjects')}
              className="px-3.5 py-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800/60 flex items-center gap-1.5 transition-all"
            >
              <Layers className="w-4 h-4" />
              Subjects
            </button>
            {isAuthenticated && (
              <button
                onClick={() => onNavigate('dashboard')}
                className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-all ${
                  currentView === 'dashboard'
                    ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 dark:text-indigo-400'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </button>
            )}
            {isAdmin && (
              <button
                onClick={() => onNavigate('admin')}
                className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-all ${
                  currentView === 'admin'
                    ? 'text-amber-600 bg-amber-50 dark:bg-amber-950/60 dark:text-amber-400'
                    : 'text-slate-600 hover:text-amber-600 hover:bg-amber-50 dark:text-slate-400 dark:hover:text-amber-300 dark:hover:bg-amber-950/30'
                }`}
              >
                <ShieldAlert className="w-4 h-4 text-amber-500" />
                Admin
              </button>
            )}
          </nav>
        </div>

        {/* Search Bar (Desktop) */}
        <div className="hidden lg:flex flex-1 max-w-xs xl:max-w-sm mx-4">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search notes, courses, professors..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyPress}
              className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-900 transition-all outline-none"
            />
          </div>
        </div>

        {/* Actions & User Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* PWA Install Button */}
          <PWAInstallButton variant="button" className="hidden lg:inline-flex" />

          {/* Upload CTA button */}
          <button
            onClick={() => {
              if (isAuthenticated) {
                onOpenUpload();
              } else {
                openAuthModal('login');
              }
            }}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm shadow-indigo-600/20 hover:shadow-md transition-all"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Notes</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2.5 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Notifications Dropdown */}
          {isAuthenticated && (
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                aria-label="Notifications"
                className="p-2.5 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-slate-900">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">Notifications</h3>
                      {unreadCount > 0 && (
                        <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-xs text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 font-medium flex items-center gap-1"
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-slate-400 text-sm">
                        No notifications yet
                      </div>
                    ) : (
                      notifications.map(notif => (
                        <div
                          key={notif.id}
                          onClick={() => handleNotificationClick(notif)}
                          className={`p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors ${
                            !notif.read ? 'bg-indigo-50/50 dark:bg-indigo-950/20' : ''
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 rounded-full mt-1.5 shrink-0 bg-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                              {!notif.read && <div className="w-2 h-2 rounded-full bg-indigo-600" />}
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-semibold text-slate-900 dark:text-white">
                                {notif.title}
                              </p>
                              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                                {notif.message}
                              </p>
                              <p className="text-[10px] text-slate-400 mt-1">
                                {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* User Profile / Auth State */}
          {isAuthenticated ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
              >
                <img
                  src={user?.avatar}
                  alt={user?.name}
                  className="w-8 h-8 rounded-lg object-cover ring-2 ring-indigo-500/20"
                />
                <span className="hidden sm:inline-block text-xs font-bold text-slate-700 dark:text-slate-200 max-w-[90px] truncate">
                  {user?.name}
                </span>
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user?.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                    <div className="mt-2 flex items-center gap-1.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        user?.role === 'admin'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                      }`}>
                        {user?.role === 'admin' ? '🛡️ Administrator' : '🎓 Student'}
                      </span>
                      <span className="text-[10px] text-slate-400 truncate max-w-[120px]">
                        {user?.university}
                      </span>
                    </div>
                  </div>

                  <div className="p-1.5 text-xs font-medium text-slate-700 dark:text-slate-300">
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onNavigate('profile', user?.id);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-slate-400" />
                      Public Profile
                    </button>
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onNavigate('dashboard');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-slate-400" />
                      My Study Dashboard
                    </button>

                    <PWAInstallButton
                      variant="menu-item"
                      onInstalled={() => setIsUserMenuOpen(false)}
                    />

                    {isAdmin && (
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onNavigate('admin');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-950/40 text-amber-700 dark:text-amber-300 transition-colors"
                      >
                        <ShieldAlert className="w-4 h-4 text-amber-500" />
                        Admin Portal
                      </button>
                    )}

                    {/* Quick Demo Switcher */}
                    <div className="my-1.5 border-t border-slate-100 dark:border-slate-800 pt-1.5 px-3">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                        Test Role Persona
                      </p>
                      <div className="flex gap-1">
                        <button
                          onClick={() => switchDemoUser('student')}
                          className={`flex-1 py-1 px-2 rounded text-[11px] font-semibold border ${
                            user?.role !== 'admin'
                              ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-950 dark:border-indigo-800 dark:text-indigo-300'
                              : 'border-slate-200 text-slate-600 dark:border-slate-800 dark:text-slate-400'
                          }`}
                        >
                          Student
                        </button>
                        <button
                          onClick={() => switchDemoUser('admin')}
                          className={`flex-1 py-1 px-2 rounded text-[11px] font-semibold border ${
                            user?.role === 'admin'
                              ? 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-300'
                              : 'border-slate-200 text-slate-600 dark:border-slate-800 dark:text-slate-400'
                          }`}
                        >
                          Admin
                        </button>
                      </div>
                    </div>

                    <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => openAuthModal('login')}
                className="px-3.5 py-1.5 rounded-xl text-sm font-semibold text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => openAuthModal('register')}
                className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm transition-all"
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-6 space-y-3">
          {/* Mobile Search */}
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search notes, subjects..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyPress}
              className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-sm outline-none"
            />
          </div>

          <div className="flex flex-col gap-1 font-medium text-sm">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onNavigate('explore');
              }}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-left"
            >
              <Compass className="w-4 h-4 text-indigo-600" />
              Explore Notes
            </button>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onNavigate('explore', 'subjects');
              }}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-left"
            >
              <Layers className="w-4 h-4 text-indigo-600" />
              Subjects
            </button>
            {isAuthenticated && (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onNavigate('dashboard');
                }}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-left"
              >
                <LayoutDashboard className="w-4 h-4 text-indigo-600" />
                User Dashboard
              </button>
            )}
            {isAdmin && (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onNavigate('admin');
                }}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/30 text-left"
              >
                <ShieldAlert className="w-4 h-4 text-amber-500" />
                Admin Dashboard
              </button>
            )}

            <div className="pt-1.5 pb-0.5 border-t border-slate-100 dark:border-slate-800">
              <PWAInstallButton
                variant="menu-item"
                onInstalled={() => setIsMobileMenuOpen(false)}
              />
            </div>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                if (isAuthenticated) {
                  onOpenUpload();
                } else {
                  openAuthModal('login');
                }
              }}
              className="flex items-center justify-center gap-2 mt-2 w-full py-2.5 rounded-xl bg-indigo-600 text-white font-semibold shadow-sm"
            >
              <Upload className="w-4 h-4" />
              Upload Study Notes
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
