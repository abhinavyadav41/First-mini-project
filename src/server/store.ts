import { User, Note, Comment, Report, NotificationItem, FilterOptions } from '../types';
import { SEED_USERS, SEED_NOTES, SEED_COMMENTS, SEED_REPORTS, SEED_NOTIFICATIONS } from '../data/seedData';

// Normalized In-Memory Relational Database Layer
class DatabaseStore {
  private users: Map<string, User> = new Map();
  private notes: Map<string, Note> = new Map();
  private comments: Map<string, Comment> = new Map();
  private reports: Map<string, Report> = new Map();
  private notifications: Map<string, NotificationItem> = new Map();

  // Relational link tables
  private likes: Set<string> = new Set(); // format: `${userId}:${noteId}`
  private bookmarks: Set<string> = new Set(); // format: `${userId}:${noteId}`

  constructor() {
    this.seed();
  }

  private seed() {
    SEED_USERS.forEach(u => this.users.set(u.id, { ...u }));
    SEED_NOTES.forEach(n => this.notes.set(n.id, { ...n }));
    SEED_COMMENTS.forEach(c => this.comments.set(c.id, { ...c }));
    SEED_REPORTS.forEach(r => this.reports.set(r.id, { ...r }));
    SEED_NOTIFICATIONS.forEach(notif => this.notifications.set(notif.id, { ...notif }));

    // Seed some initial likes & bookmarks
    this.likes.add('user-2:note-1');
    this.likes.add('user-3:note-1');
    this.likes.add('user-4:note-1');
    this.likes.add('user-1:note-2');
    this.likes.add('user-5:note-2');
    this.bookmarks.add('user-1:note-2');
    this.bookmarks.add('user-2:note-1');
    this.bookmarks.add('user-3:note-3');
  }

  // User queries
  public getUsers(): User[] {
    return Array.from(this.users.values());
  }

  public getUserById(id: string): User | undefined {
    return this.users.get(id);
  }

  public getUserByEmail(email: string): User | undefined {
    const normalized = email.toLowerCase().trim();
    return Array.from(this.users.values()).find(u => u.email.toLowerCase() === normalized);
  }

  public createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): User {
    const id = `user-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const now = new Date().toISOString();
    const newUser: User = {
      ...userData,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.users.set(id, newUser);
    return newUser;
  }

  public updateUser(id: string, updates: Partial<User>): User | null {
    const existing = this.users.get(id);
    if (!existing) return null;
    const updated: User = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.users.set(id, updated);
    return updated;
  }

  public toggleSuspendUser(id: string): User | null {
    const existing = this.users.get(id);
    if (!existing) return null;
    existing.isSuspended = !existing.isSuspended;
    existing.updatedAt = new Date().toISOString();
    this.users.set(id, existing);
    return existing;
  }

  // Note queries & filtering
  public getNotes(filters: FilterOptions = {}, currentUserId?: string): { notes: Note[]; total: number; page: number; totalPages: number } {
    let result = Array.from(this.notes.values());

    // Filter out private notes unless author matches currentUserId
    result = result.filter(n => {
      if (n.visibility === 'public') return true;
      return currentUserId && n.authorId === currentUserId;
    });

    // Search query (matches title, description, subject, course, university, author name, or tags)
    if (filters.search && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(n =>
        n.title.toLowerCase().includes(q) ||
        n.description.toLowerCase().includes(q) ||
        n.subject.toLowerCase().includes(q) ||
        n.course.toLowerCase().includes(q) ||
        n.university.toLowerCase().includes(q) ||
        n.author.name.toLowerCase().includes(q) ||
        n.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    // Filter by subject
    if (filters.subject && filters.subject !== 'All') {
      result = result.filter(n => n.subject.toLowerCase() === filters.subject?.toLowerCase());
    }

    // Filter by university
    if (filters.university && filters.university !== 'All') {
      result = result.filter(n => n.university.toLowerCase() === filters.university?.toLowerCase());
    }

    // Filter by course
    if (filters.course && filters.course !== 'All') {
      result = result.filter(n => n.course.toLowerCase() === filters.course?.toLowerCase());
    }

    // Filter by semester
    if (filters.semester && filters.semester !== 'All') {
      result = result.filter(n => n.semester.toLowerCase() === filters.semester?.toLowerCase());
    }

    // Filter by tag
    if (filters.tag) {
      const tagLower = filters.tag.toLowerCase();
      result = result.filter(n => n.tags.some(t => t.toLowerCase() === tagLower));
    }

    // Sorting
    const sort = filters.sortBy || 'newest';
    if (sort === 'downloads') {
      result.sort((a, b) => b.downloads - a.downloads);
    } else if (sort === 'likes') {
      result.sort((a, b) => b.likesCount - a.likesCount);
    } else {
      // Newest
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    const total = result.length;
    const page = filters.page || 1;
    const limit = filters.limit || 12;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginated = result.slice(startIndex, startIndex + limit);

    // Decorate with user-specific like & bookmark state
    const decorated = paginated.map(note => ({
      ...note,
      isLiked: currentUserId ? this.likes.has(`${currentUserId}:${note.id}`) : false,
      isBookmarked: currentUserId ? this.bookmarks.has(`${currentUserId}:${note.id}`) : false,
    }));

    return {
      notes: decorated,
      total,
      page,
      totalPages,
    };
  }

  public getNoteById(id: string, currentUserId?: string): Note | null {
    const note = this.notes.get(id);
    if (!note) return null;

    return {
      ...note,
      isLiked: currentUserId ? this.likes.has(`${currentUserId}:${note.id}`) : false,
      isBookmarked: currentUserId ? this.bookmarks.has(`${currentUserId}:${note.id}`) : false,
    };
  }

  public incrementViews(id: string): Note | null {
    const note = this.notes.get(id);
    if (!note) return null;
    note.views += 1;
    this.notes.set(id, note);
    return note;
  }

  public incrementDownloads(id: string): Note | null {
    const note = this.notes.get(id);
    if (!note) return null;
    note.downloads += 1;
    this.notes.set(id, note);
    return note;
  }

  public createNote(noteData: Omit<Note, 'id' | 'views' | 'downloads' | 'likesCount' | 'bookmarksCount' | 'createdAt' | 'updatedAt'>): Note {
    const id = `note-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const now = new Date().toISOString();

    const newNote: Note = {
      ...noteData,
      id,
      views: 0,
      downloads: 0,
      likesCount: 0,
      bookmarksCount: 0,
      createdAt: now,
      updatedAt: now,
    };

    this.notes.set(id, newNote);

    // Add upload notification
    this.createNotification({
      userId: newNote.authorId,
      type: 'upload',
      title: 'Note Published!',
      message: `Your study material "${newNote.title}" is now available to learners worldwide.`,
      noteId: id,
    });

    return newNote;
  }

  public updateNote(id: string, updates: Partial<Note>, userId: string, isAdmin = false): Note | null {
    const note = this.notes.get(id);
    if (!note) return null;
    if (note.authorId !== userId && !isAdmin) return null;

    const updated: Note = {
      ...note,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.notes.set(id, updated);
    return updated;
  }

  public deleteNote(id: string, userId: string, isAdmin = false): boolean {
    const note = this.notes.get(id);
    if (!note) return false;
    if (note.authorId !== userId && !isAdmin) return false;

    this.notes.delete(id);

    // Clean up related likes, bookmarks, comments, reports
    for (const key of Array.from(this.likes)) {
      if (key.endsWith(`:${id}`)) this.likes.delete(key);
    }
    for (const key of Array.from(this.bookmarks)) {
      if (key.endsWith(`:${id}`)) this.bookmarks.delete(key);
    }
    for (const [commentId, c] of Array.from(this.comments.entries())) {
      if (c.noteId === id) this.comments.delete(commentId);
    }
    for (const [repId, r] of Array.from(this.reports.entries())) {
      if (r.noteId === id) this.reports.delete(repId);
    }

    return true;
  }

  // Likes with duplicate prevention
  public toggleLike(userId: string, noteId: string): { isLiked: boolean; likesCount: number } | null {
    const note = this.notes.get(noteId);
    if (!note) return null;

    const key = `${userId}:${noteId}`;
    const wasLiked = this.likes.has(key);

    if (wasLiked) {
      this.likes.delete(key);
      note.likesCount = Math.max(0, note.likesCount - 1);
    } else {
      this.likes.add(key);
      note.likesCount += 1;

      // Notify author if liker is not author
      if (note.authorId !== userId) {
        const liker = this.users.get(userId);
        this.createNotification({
          userId: note.authorId,
          type: 'like',
          title: 'New Like!',
          message: `${liker ? liker.name : 'A student'} liked your note "${note.title}".`,
          noteId,
        });
      }
    }

    this.notes.set(noteId, note);
    return { isLiked: !wasLiked, likesCount: note.likesCount };
  }

  // Bookmarks with duplicate prevention
  public toggleBookmark(userId: string, noteId: string): { isBookmarked: boolean; bookmarksCount: number } | null {
    const note = this.notes.get(noteId);
    if (!note) return null;

    const key = `${userId}:${noteId}`;
    const wasBookmarked = this.bookmarks.has(key);

    if (wasBookmarked) {
      this.bookmarks.delete(key);
      note.bookmarksCount = Math.max(0, note.bookmarksCount - 1);
    } else {
      this.bookmarks.add(key);
      note.bookmarksCount += 1;
    }

    this.notes.set(noteId, note);
    return { isBookmarked: !wasBookmarked, bookmarksCount: note.bookmarksCount };
  }

  // User dashboard collections
  public getUserUploads(userId: string): Note[] {
    return Array.from(this.notes.values())
      .filter(n => n.authorId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getUserSavedNotes(userId: string): Note[] {
    const bookmarkedIds = new Set<string>();
    for (const key of Array.from(this.bookmarks)) {
      if (key.startsWith(`${userId}:`)) {
        bookmarkedIds.add(key.split(':')[1]);
      }
    }
    return Array.from(this.notes.values())
      .filter(n => bookmarkedIds.has(n.id))
      .map(n => ({
        ...n,
        isLiked: this.likes.has(`${userId}:${n.id}`),
        isBookmarked: true,
      }));
  }

  public getUserLikedNotes(userId: string): Note[] {
    const likedIds = new Set<string>();
    for (const key of Array.from(this.likes)) {
      if (key.startsWith(`${userId}:`)) {
        likedIds.add(key.split(':')[1]);
      }
    }
    return Array.from(this.notes.values())
      .filter(n => likedIds.has(n.id))
      .map(n => ({
        ...n,
        isLiked: true,
        isBookmarked: this.bookmarks.has(`${userId}:${n.id}`),
      }));
  }

  // Comments
  public getComments(noteId: string): Comment[] {
    return Array.from(this.comments.values())
      .filter(c => c.noteId === noteId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public addComment(userId: string, noteId: string, content: string): Comment | null {
    const user = this.users.get(userId);
    const note = this.notes.get(noteId);
    if (!user || !note) return null;

    const id = `comment-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const now = new Date().toISOString();

    const comment: Comment = {
      id,
      userId,
      noteId,
      content,
      author: {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        university: user.university,
      },
      createdAt: now,
      updatedAt: now,
    };

    this.comments.set(id, comment);

    // Notify author if commenter is not author
    if (note.authorId !== userId) {
      this.createNotification({
        userId: note.authorId,
        type: 'comment',
        title: 'New Comment',
        message: `${user.name} commented on your note "${note.title}".`,
        noteId,
      });
    }

    return comment;
  }

  public deleteComment(commentId: string, userId: string, isAdmin = false): boolean {
    const comment = this.comments.get(commentId);
    if (!comment) return false;
    if (comment.userId !== userId && !isAdmin) return false;
    return this.comments.delete(commentId);
  }

  // Reports
  public getReports(): Report[] {
    return Array.from(this.reports.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public createReport(reporterId: string, noteId: string, reason: string, details?: string): Report | null {
    const user = this.users.get(reporterId);
    const note = this.notes.get(noteId);
    if (!user || !note) return null;

    const id = `rep-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const report: Report = {
      id,
      reporterId,
      reporterName: user.name,
      noteId,
      noteTitle: note.title,
      reason,
      details,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    this.reports.set(id, report);
    return report;
  }

  public updateReportStatus(reportId: string, status: 'reviewed' | 'dismissed'): Report | null {
    const report = this.reports.get(reportId);
    if (!report) return null;
    report.status = status;
    this.reports.set(reportId, report);
    return report;
  }

  // Notifications
  public getNotifications(userId: string): NotificationItem[] {
    return Array.from(this.notifications.values())
      .filter(n => n.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public createNotification(data: Omit<NotificationItem, 'id' | 'read' | 'createdAt'>): NotificationItem {
    const id = `notif-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const notif: NotificationItem = {
      ...data,
      id,
      read: false,
      createdAt: new Date().toISOString(),
    };
    this.notifications.set(id, notif);
    return notif;
  }

  public markNotificationAsRead(id: string): boolean {
    const notif = this.notifications.get(id);
    if (!notif) return false;
    notif.read = true;
    this.notifications.set(id, notif);
    return true;
  }

  public markAllNotificationsAsRead(userId: string): void {
    for (const notif of Array.from(this.notifications.values())) {
      if (notif.userId === userId) {
        notif.read = true;
        this.notifications.set(notif.id, notif);
      }
    }
  }

  // Admin stats
  public getAdminStats() {
    const users = Array.from(this.users.values());
    const notes = Array.from(this.notes.values());
    const reports = Array.from(this.reports.values());

    const totalUsers = users.length;
    const totalNotes = notes.length;
    const totalDownloads = notes.reduce((acc, n) => acc + n.downloads, 0);
    const totalViews = notes.reduce((acc, n) => acc + n.views, 0);
    const pendingReports = reports.filter(r => r.status === 'pending').length;

    // Subject breakdown
    const subjectCounts: Record<string, number> = {};
    notes.forEach(n => {
      subjectCounts[n.subject] = (subjectCounts[n.subject] || 0) + 1;
    });

    const subjectData = Object.entries(subjectCounts).map(([name, value]) => ({
      name,
      notes: value,
    }));

    // University breakdown
    const universityCounts: Record<string, number> = {};
    notes.forEach(n => {
      universityCounts[n.university] = (universityCounts[n.university] || 0) + 1;
    });

    const universityData = Object.entries(universityCounts).map(([name, value]) => ({
      name,
      notes: value,
    }));

    // Simulated weekly trend data
    const weeklyTrends = [
      { day: 'Mon', downloads: 340, views: 980 },
      { day: 'Tue', downloads: 410, views: 1240 },
      { day: 'Wed', downloads: 520, views: 1560 },
      { day: 'Thu', downloads: 480, views: 1420 },
      { day: 'Fri', downloads: 610, views: 1890 },
      { day: 'Sat', downloads: 390, views: 1150 },
      { day: 'Sun', downloads: 550, views: 1670 },
    ];

    return {
      totalUsers,
      totalNotes,
      totalDownloads,
      totalViews,
      pendingReports,
      subjectData,
      universityData,
      weeklyTrends,
      recentUploads: notes.slice(-5).reverse(),
      pendingReportsList: reports.filter(r => r.status === 'pending').slice(0, 5),
    };
  }
}

export const dbStore = new DatabaseStore();
