import { Note, User, Comment, Report, NotificationItem, FilterOptions } from '../types';

const API_BASE = '/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('notenest_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export const api = {
  // Auth
  async login(email: string, password?: string): Promise<{ user: User; token: string }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to sign in');
    }
    return res.json();
  },

  async register(name: string, email: string, password?: string, university?: string): Promise<{ user: User; token: string }> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, university }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to create account');
    }
    return res.json();
  },

  async loginWithGoogle(email?: string, name?: string, avatar?: string): Promise<{ user: User; token: string }> {
    const res = await fetch(`${API_BASE}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name, avatar }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Google login failed');
    }
    return res.json();
  },

  async getMe(): Promise<{ user: User }> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      throw new Error('Not authenticated');
    }
    return res.json();
  },

  // Notes
  async getNotes(filters: FilterOptions = {}): Promise<{ notes: Note[]; total: number; page: number; totalPages: number }> {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.subject) params.append('subject', filters.subject);
    if (filters.university) params.append('university', filters.university);
    if (filters.course) params.append('course', filters.course);
    if (filters.semester) params.append('semester', filters.semester);
    if (filters.tag) params.append('tag', filters.tag);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const res = await fetch(`${API_BASE}/notes?${params.toString()}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch notes');
    return res.json();
  },

  async getNoteById(id: string): Promise<{ note: Note }> {
    const res = await fetch(`${API_BASE}/notes/${id}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Note not found');
    return res.json();
  },

  async createNote(noteData: Partial<Note>): Promise<{ note: Note }> {
    const res = await fetch(`${API_BASE}/notes`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(noteData),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to upload note');
    }
    return res.json();
  },

  async updateNote(id: string, updates: Partial<Note>): Promise<{ note: Note }> {
    const res = await fetch(`${API_BASE}/notes/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update note');
    return res.json();
  },

  async deleteNote(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/notes/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return res.ok;
  },

  async toggleLike(id: string): Promise<{ isLiked: boolean; likesCount: number }> {
    const res = await fetch(`${API_BASE}/notes/${id}/like`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to toggle like');
    return res.json();
  },

  async toggleBookmark(id: string): Promise<{ isBookmarked: boolean; bookmarksCount: number }> {
    const res = await fetch(`${API_BASE}/notes/${id}/bookmark`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to toggle bookmark');
    return res.json();
  },

  async recordDownload(id: string): Promise<{ success: boolean; downloads: number; downloadUrl: string; fileName: string }> {
    const res = await fetch(`${API_BASE}/notes/${id}/download`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to download note');
    return res.json();
  },

  // Comments
  async getComments(noteId: string): Promise<{ comments: Comment[] }> {
    const res = await fetch(`${API_BASE}/notes/${noteId}/comments`);
    if (!res.ok) throw new Error('Failed to load comments');
    return res.json();
  },

  async addComment(noteId: string, content: string): Promise<{ comment: Comment }> {
    const res = await fetch(`${API_BASE}/notes/${noteId}/comments`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ content }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to post comment');
    }
    return res.json();
  },

  async deleteComment(commentId: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/comments/${commentId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return res.ok;
  },

  // Reports
  async reportNote(noteId: string, reason: string, details?: string): Promise<{ report: Report }> {
    const res = await fetch(`${API_BASE}/notes/${noteId}/report`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ reason, details }),
    });
    if (!res.ok) throw new Error('Failed to submit report');
    return res.json();
  },

  // User Dashboards
  async getUserUploads(): Promise<{ notes: Note[] }> {
    const res = await fetch(`${API_BASE}/user/uploads`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to load uploads');
    return res.json();
  },

  async getUserSaved(): Promise<{ notes: Note[] }> {
    const res = await fetch(`${API_BASE}/user/saved`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to load saved notes');
    return res.json();
  },

  async getUserLiked(): Promise<{ notes: Note[] }> {
    const res = await fetch(`${API_BASE}/user/liked`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to load liked notes');
    return res.json();
  },

  async getUserPublicProfile(id: string): Promise<{ user: User; uploads: Note[] }> {
    const res = await fetch(`${API_BASE}/users/${id}`);
    if (!res.ok) throw new Error('User not found');
    return res.json();
  },

  async updateUserProfile(profile: Partial<User>): Promise<{ user: User }> {
    const res = await fetch(`${API_BASE}/users/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(profile),
    });
    if (!res.ok) throw new Error('Failed to update profile');
    return res.json();
  },

  // Notifications
  async getNotifications(): Promise<{ notifications: NotificationItem[] }> {
    const res = await fetch(`${API_BASE}/notifications`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch notifications');
    return res.json();
  },

  async markNotificationRead(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/notifications/${id}/read`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    });
    return res.ok;
  },

  async markAllNotificationsRead(): Promise<boolean> {
    const res = await fetch(`${API_BASE}/notifications/read-all`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    });
    return res.ok;
  },

  // Admin
  async getAdminStats(): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/stats`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch admin stats');
    return res.json();
  },

  async getAdminReports(): Promise<{ reports: Report[] }> {
    const res = await fetch(`${API_BASE}/admin/reports`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to load reports');
    return res.json();
  },

  async updateReportStatus(reportId: string, status: 'reviewed' | 'dismissed'): Promise<{ report: Report }> {
    const res = await fetch(`${API_BASE}/admin/reports/${reportId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update report status');
    return res.json();
  },

  async getAdminUsers(): Promise<{ users: User[] }> {
    const res = await fetch(`${API_BASE}/admin/users`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to load users');
    return res.json();
  },

  async toggleSuspendUser(userId: string): Promise<{ user: User }> {
    const res = await fetch(`${API_BASE}/admin/users/${userId}/suspend`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to suspend/unsuspend user');
    return res.json();
  },
};
