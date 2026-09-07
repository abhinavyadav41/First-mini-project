import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Users,
  FileText,
  Download,
  Eye,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Search,
  Trash2,
  Lock,
  Unlock,
  TrendingUp,
  BarChart3,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid,
} from 'recharts';
import { User, Note, Report } from '../types';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';

interface AdminDashboardPageProps {
  onNavigate: (view: string, param?: string) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onNavigate }) => {
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'analytics' | 'reports' | 'notes' | 'users'>('analytics');
  const [stats, setStats] = useState<any>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [allNotes, setAllNotes] = useState<Note[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Search in tables
  const [noteSearch, setNoteSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, reportsRes, notesRes, usersRes] = await Promise.all([
        api.getAdminStats(),
        api.getAdminReports(),
        api.getNotes({ limit: 50 }),
        api.getAdminUsers(),
      ]);
      setStats(statsRes);
      setReports(reportsRes.reports);
      setAllNotes(notesRes.notes);
      setAllUsers(usersRes.users);
    } catch {
      showToast('Admin authorization required or data load error', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateReport = async (reportId: string, status: 'reviewed' | 'dismissed') => {
    try {
      await api.updateReportStatus(reportId, status);
      setReports(prev => prev.map(r => r.id === reportId ? { ...r, status } : r));
      showToast(`Report marked as ${status}`, 'success');
    } catch {
      showToast('Failed to update report status', 'error');
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!confirm('Are you sure you want to delete this note as an administrator?')) return;
    try {
      await api.deleteNote(noteId);
      setAllNotes(prev => prev.filter(n => n.id !== noteId));
      showToast('Note deleted by administrator', 'info');
    } catch {
      showToast('Failed to delete note', 'error');
    }
  };

  const handleToggleSuspendUser = async (userId: string) => {
    try {
      const res = await api.toggleSuspendUser(userId);
      setAllUsers(prev => prev.map(u => u.id === userId ? res.user : u));
      showToast(res.user.isSuspended ? 'User account suspended' : 'User account reactivated', 'info');
    } catch {
      showToast('Failed to update user status', 'error');
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-500">Loading moderation console...</p>
      </div>
    );
  }

  // Sample analytics data for charts
  const downloadsTrendData = [
    { day: 'Mon', downloads: 1420, views: 3200 },
    { day: 'Tue', downloads: 1850, views: 4100 },
    { day: 'Wed', downloads: 2200, views: 5300 },
    { day: 'Thu', downloads: 2600, views: 6100 },
    { day: 'Fri', downloads: 3100, views: 7400 },
    { day: 'Sat', downloads: 2800, views: 5900 },
    { day: 'Sun', downloads: 3400, views: 8200 },
  ];

  const subjectDistributionData = [
    { name: 'Comp Sci', count: 18 },
    { name: 'Math', count: 12 },
    { name: 'EE', count: 8 },
    { name: 'Econ', count: 7 },
    { name: 'Biology', count: 5 },
    { name: 'Physics', count: 6 },
  ];

  const pendingReportsCount = reports.filter(r => r.status === 'pending').length;

  const filteredNotes = allNotes.filter(n =>
    n.title.toLowerCase().includes(noteSearch.toLowerCase()) ||
    n.course.toLowerCase().includes(noteSearch.toLowerCase()) ||
    n.author.name.toLowerCase().includes(noteSearch.toLowerCase())
  );

  const filteredUsers = allUsers.filter(u =>
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.university.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-amber-500/10 dark:bg-amber-950/30 border border-amber-500/30 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-md shadow-amber-500/20">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Admin Moderation & Governance
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white">
                Superuser
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Maintain academic integrity, review reported materials, and monitor platform activity.
            </p>
          </div>
        </div>

        {pendingReportsCount > 0 && (
          <div className="flex items-center gap-2 bg-amber-500/20 text-amber-900 dark:text-amber-200 px-4 py-2 rounded-2xl text-xs font-bold">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>{pendingReportsCount} Reports Pending Review</span>
          </div>
        )}
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Users</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {stats?.totalUsers || allUsers.length}
          </p>
          <span className="text-[11px] text-emerald-600 font-semibold">Active Scholars</span>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Notes</span>
            <FileText className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {stats?.totalNotes || allNotes.length}
          </p>
          <span className="text-[11px] text-indigo-600 font-semibold">Verified Materials</span>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Downloads</span>
            <Download className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
            {(stats?.totalDownloads || 15420).toLocaleString()}
          </p>
          <span className="text-[11px] text-emerald-600 font-semibold">+18% this week</span>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Pending Flags</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400">
            {pendingReportsCount}
          </p>
          <span className="text-[11px] text-amber-600 font-semibold">Requires Attention</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2 sm:gap-6 text-xs sm:text-sm font-bold overflow-x-auto">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`pb-3.5 px-2 border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'analytics'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Platform Analytics</span>
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`pb-3.5 px-2 border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'reports'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Report Queue ({pendingReportsCount})</span>
        </button>

        <button
          onClick={() => setActiveTab('notes')}
          className={`pb-3.5 px-2 border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'notes'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Notes Catalog</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3.5 px-2 border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'users'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User Accounts</span>
        </button>
      </div>

      {/* Tab 1: Recharts Analytics */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Downloads Trend Area Chart */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-600" />
                <span>Weekly Note Views & Downloads Activity</span>
              </h3>
              <p className="text-xs text-slate-400">Total downloads recorded across all course subjects</p>
            </div>

            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={downloadsTrendData}>
                  <defs>
                    <linearGradient id="downloadColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px',
                      border: 'none',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="downloads"
                    stroke="#4f46e5"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#downloadColor)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Subject Distribution Bar Chart */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-600" />
                <span>Study Materials by Academic Category</span>
              </h3>
              <p className="text-xs text-slate-400">Distribution of published notes across departments</p>
            </div>

            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subjectDistributionData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px',
                      border: 'none',
                    }}
                  />
                  <Bar dataKey="count" fill="#6366f1" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Report Queue */}
      {activeTab === 'reports' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Reported Study Materials
            </h3>
            <p className="text-xs text-slate-400">Review content flagged by university students for plagiarism, copyright, or inaccuracies.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-4">Reported Note</th>
                  <th className="p-4">Reason</th>
                  <th className="p-4">Reporter</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {reports.map(report => (
                  <tr key={report.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-4 font-bold text-slate-900 dark:text-white">
                      <button
                        onClick={() => onNavigate('note-detail', report.noteId)}
                        className="hover:text-indigo-600 text-left line-clamp-1"
                      >
                        {report.noteTitle}
                      </button>
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-rose-600 dark:text-rose-400">
                        {report.reason}
                      </span>
                      {report.details && (
                        <p className="text-[11px] text-slate-400 mt-0.5">{report.details}</p>
                      )}
                    </td>
                    <td className="p-4 font-medium">
                      {report.reporterName}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          report.status === 'pending'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : report.status === 'reviewed'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400'
                        }`}
                      >
                        {report.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {report.status === 'pending' ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleUpdateReport(report.id, 'reviewed')}
                            className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300 font-bold transition-colors"
                          >
                            Resolve
                          </button>
                          <button
                            onClick={() => handleUpdateReport(report.id, 'dismissed')}
                            className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 font-bold transition-colors"
                          >
                            Dismiss
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400">Action taken</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Notes Catalog */}
      {activeTab === 'notes' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-sm space-y-4">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Catalog Moderation
              </h3>
              <p className="text-xs text-slate-400">Audit, examine, or remove inappropriate course notes.</p>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search notes or authors..."
                value={noteSearch}
                onChange={e => setNoteSearch(e.target.value)}
                className="text-xs pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-4">Note Title</th>
                  <th className="p-4">Discipline</th>
                  <th className="p-4">Author</th>
                  <th className="p-4">Engagement</th>
                  <th className="p-4 text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredNotes.map(n => (
                  <tr key={n.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-4">
                      <p className="font-bold text-slate-900 dark:text-white line-clamp-1">{n.title}</p>
                      <p className="text-[11px] text-slate-400">{n.course} • {n.university}</p>
                    </td>
                    <td className="p-4 font-semibold text-indigo-600 dark:text-indigo-400">
                      {n.subject}
                    </td>
                    <td className="p-4 font-medium">
                      {n.author.name}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3 text-slate-400">
                        <span>{n.downloads} ↓</span>
                        <span>{n.views} 👁</span>
                        <span>{n.likesCount} ❤️</span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onNavigate('note-detail', n.id)}
                          className="px-2.5 py-1 text-xs text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 rounded-lg font-bold"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleDeleteNote(n.id)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors"
                          title="Delete Note"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: User Accounts */}
      {activeTab === 'users' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-sm space-y-4">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Member Directory & Permissions
              </h3>
              <p className="text-xs text-slate-400">Control account standing and suspend abusive accounts.</p>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search scholars..."
                value={userSearch}
                onChange={e => setUserSearch(e.target.value)}
                className="text-xs pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-4">Student Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">University</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Suspend / Restore</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredUsers.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-4 flex items-center gap-2.5 font-bold text-slate-900 dark:text-white">
                      <img src={u.avatar} alt="" className="w-7 h-7 rounded-full object-cover" />
                      <span>{u.name}</span>
                    </td>
                    <td className="p-4 text-slate-500 font-mono">
                      {u.email}
                    </td>
                    <td className="p-4">
                      {u.university}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        u.role === 'admin'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                      }`}>
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4">
                      {u.isSuspended ? (
                        <span className="text-rose-600 font-bold text-[11px]">Suspended</span>
                      ) : (
                        <span className="text-emerald-600 font-bold text-[11px]">Active</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      {u.role !== 'admin' && (
                        <button
                          onClick={() => handleToggleSuspendUser(u.id)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                            u.isSuspended
                              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-950 dark:text-rose-300'
                          }`}
                        >
                          {u.isSuspended ? 'Restore' : 'Suspend'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
