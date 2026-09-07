import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { dbStore } from './src/server/store.ts';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON middleware with support for base64 file payloads up to 30mb
  app.use(express.json({ limit: '30mb' }));
  app.use(express.urlencoded({ extended: true, limit: '30mb' }));

  // Helper middleware to extract current user from Authorization header
  const getAuthUser = (req: Request) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    const token = authHeader.split(' ')[1];
    // In our token implementation, token is either user ID or 'demo-token-<userId>'
    const userId = token.replace('demo-token-', '');
    return dbStore.getUserById(userId) || null;
  };

  // --- API ROUTES ---

  // Health check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', service: 'NoteNest API', timestamp: new Date().toISOString() });
  });

  // 1. Authentication Routes
  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = dbStore.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (user.isSuspended) {
      return res.status(403).json({ error: 'This account has been suspended by an administrator.' });
    }

    res.json({
      user,
      token: `demo-token-${user.id}`,
    });
  });

  app.post('/api/auth/register', (req: Request, res: Response) => {
    const { name, email, password, university } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const existing = dbStore.getUserByEmail(email);
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists' });
    }

    const newUser = dbStore.createUser({
      name,
      email,
      university: university || 'General University',
      role: 'student',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      bio: `Student at ${university || 'University'} passionate about learning and sharing notes.`,
    });

    res.status(201).json({
      user: newUser,
      token: `demo-token-${newUser.id}`,
    });
  });

  app.post('/api/auth/google', (req: Request, res: Response) => {
    const { email, name, avatar } = req.body;
    const targetEmail = email || 'google.student@stanford.edu';
    let user = dbStore.getUserByEmail(targetEmail);

    if (!user) {
      user = dbStore.createUser({
        name: name || 'Google Learner',
        email: targetEmail,
        university: 'Stanford University',
        role: 'student',
        avatar: avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name || 'Google')}`,
        bio: 'Joined via Google OAuth. Ready to explore and share top-tier study notes!',
      });
    }

    if (user.isSuspended) {
      return res.status(403).json({ error: 'Account suspended' });
    }

    res.json({
      user,
      token: `demo-token-${user.id}`,
    });
  });

  app.get('/api/auth/me', (req: Request, res: Response) => {
    const user = getAuthUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    res.json({ user });
  });

  app.post('/api/auth/forgot-password', (req: Request, res: Response) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    // Simulation
    res.json({ message: 'If an account exists with this email, a password reset link has been dispatched.' });
  });

  // 2. Notes Routes
  app.get('/api/notes', (req: Request, res: Response) => {
    const user = getAuthUser(req);
    const filters = {
      search: req.query.search as string,
      subject: req.query.subject as string,
      university: req.query.university as string,
      course: req.query.course as string,
      semester: req.query.semester as string,
      tag: req.query.tag as string,
      sortBy: (req.query.sortBy as 'newest' | 'downloads' | 'likes') || 'newest',
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 12,
    };

    const data = dbStore.getNotes(filters, user?.id);
    res.json(data);
  });

  app.get('/api/notes/:id', (req: Request, res: Response) => {
    const user = getAuthUser(req);
    const note = dbStore.getNoteById(req.params.id, user?.id);
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    // Increment view count
    dbStore.incrementViews(note.id);
    note.views += 1;

    res.json({ note });
  });

  app.post('/api/notes', (req: Request, res: Response) => {
    const user = getAuthUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required to upload notes' });
    }

    const {
      title,
      description,
      subject,
      university,
      course,
      semester,
      tags,
      visibility,
      fileName,
      fileSize,
      fileType,
      fileUrl,
      previewPages,
      pageCount,
    } = req.body;

    if (!title || !subject || !university || !course) {
      return res.status(400).json({ error: 'Title, subject, university, and course are required' });
    }

    const newNote = dbStore.createNote({
      title,
      description: description || 'No description provided.',
      subject,
      university,
      course,
      semester: semester || 'Semester 1',
      tags: Array.isArray(tags) ? tags : [],
      visibility: visibility === 'private' ? 'private' : 'public',
      authorId: user.id,
      author: {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        university: user.university,
      },
      fileName: fileName || `${title.replace(/\s+/g, '_')}.pdf`,
      fileSize: fileSize || 2400000,
      fileType: fileType || 'application/pdf',
      fileUrl: fileUrl || `/uploads/${Date.now()}.pdf`,
      previewPages: previewPages && previewPages.length > 0
        ? previewPages
        : [`# ${title}\n## Course: ${course} - ${subject}\n\n${description}\n\n*Uploaded by ${user.name} (${user.university})*`],
      pageCount: pageCount || 12,
    });

    res.status(201).json({ note: newNote });
  });

  app.put('/api/notes/:id', (req: Request, res: Response) => {
    const user = getAuthUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const updated = dbStore.updateNote(req.params.id, req.body, user.id, user.role === 'admin');
    if (!updated) {
      return res.status(403).json({ error: 'Permission denied or note not found' });
    }

    res.json({ note: updated });
  });

  app.delete('/api/notes/:id', (req: Request, res: Response) => {
    const user = getAuthUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const success = dbStore.deleteNote(req.params.id, user.id, user.role === 'admin');
    if (!success) {
      return res.status(403).json({ error: 'Permission denied or note not found' });
    }

    res.json({ success: true });
  });

  // 3. Social: Likes, Bookmarks, Downloads
  app.post('/api/notes/:id/like', (req: Request, res: Response) => {
    const user = getAuthUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required to like notes' });
    }

    const result = dbStore.toggleLike(user.id, req.params.id);
    if (!result) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.json(result);
  });

  app.post('/api/notes/:id/bookmark', (req: Request, res: Response) => {
    const user = getAuthUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required to bookmark notes' });
    }

    const result = dbStore.toggleBookmark(user.id, req.params.id);
    if (!result) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.json(result);
  });

  app.post('/api/notes/:id/download', (req: Request, res: Response) => {
    const note = dbStore.incrementDownloads(req.params.id);
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.json({
      success: true,
      downloads: note.downloads,
      downloadUrl: note.fileUrl,
      fileName: note.fileName,
    });
  });

  // 4. Comments
  app.get('/api/notes/:id/comments', (req: Request, res: Response) => {
    const comments = dbStore.getComments(req.params.id);
    res.json({ comments });
  });

  app.post('/api/notes/:id/comments', (req: Request, res: Response) => {
    const user = getAuthUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required to post comments' });
    }

    const { content } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Comment content cannot be empty' });
    }

    const comment = dbStore.addComment(user.id, req.params.id, content.trim());
    if (!comment) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.status(201).json({ comment });
  });

  app.delete('/api/comments/:id', (req: Request, res: Response) => {
    const user = getAuthUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const success = dbStore.deleteComment(req.params.id, user.id, user.role === 'admin');
    if (!success) {
      return res.status(403).json({ error: 'Permission denied or comment not found' });
    }

    res.json({ success: true });
  });

  // 5. Reports
  app.post('/api/notes/:id/report', (req: Request, res: Response) => {
    const user = getAuthUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required to submit reports' });
    }

    const { reason, details } = req.body;
    if (!reason) {
      return res.status(400).json({ error: 'Report reason is required' });
    }

    const report = dbStore.createReport(user.id, req.params.id, reason, details);
    if (!report) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.status(201).json({ report });
  });

  // 6. User Profiles & Dashboard collections
  app.get('/api/users/:id', (req: Request, res: Response) => {
    const user = dbStore.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const uploads = dbStore.getUserUploads(user.id).filter(n => n.visibility === 'public');
    res.json({ user, uploads });
  });

  app.put('/api/users/profile', (req: Request, res: Response) => {
    const user = getAuthUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { name, bio, university, avatar } = req.body;
    const updated = dbStore.updateUser(user.id, { name, bio, university, avatar });
    res.json({ user: updated });
  });

  app.get('/api/user/uploads', (req: Request, res: Response) => {
    const user = getAuthUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    const notes = dbStore.getUserUploads(user.id);
    res.json({ notes });
  });

  app.get('/api/user/saved', (req: Request, res: Response) => {
    const user = getAuthUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    const notes = dbStore.getUserSavedNotes(user.id);
    res.json({ notes });
  });

  app.get('/api/user/liked', (req: Request, res: Response) => {
    const user = getAuthUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    const notes = dbStore.getUserLikedNotes(user.id);
    res.json({ notes });
  });

  // 7. Notifications
  app.get('/api/notifications', (req: Request, res: Response) => {
    const user = getAuthUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    const notifications = dbStore.getNotifications(user.id);
    res.json({ notifications });
  });

  app.put('/api/notifications/:id/read', (req: Request, res: Response) => {
    const user = getAuthUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    dbStore.markNotificationAsRead(req.params.id);
    res.json({ success: true });
  });

  app.put('/api/notifications/read-all', (req: Request, res: Response) => {
    const user = getAuthUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    dbStore.markAllNotificationsAsRead(user.id);
    res.json({ success: true });
  });

  // 8. Admin Routes
  app.get('/api/admin/stats', (req: Request, res: Response) => {
    const user = getAuthUser(req);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    const stats = dbStore.getAdminStats();
    res.json(stats);
  });

  app.get('/api/admin/reports', (req: Request, res: Response) => {
    const user = getAuthUser(req);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    const reports = dbStore.getReports();
    res.json({ reports });
  });

  app.put('/api/admin/reports/:id', (req: Request, res: Response) => {
    const user = getAuthUser(req);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    const { status } = req.body;
    const report = dbStore.updateReportStatus(req.params.id, status);
    res.json({ report });
  });

  app.get('/api/admin/users', (req: Request, res: Response) => {
    const user = getAuthUser(req);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    const users = dbStore.getUsers();
    res.json({ users });
  });

  app.put('/api/admin/users/:id/suspend', (req: Request, res: Response) => {
    const user = getAuthUser(req);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    const target = dbStore.toggleSuspendUser(req.params.id);
    res.json({ user: target });
  });

  // --- VITE MIDDLEWARE / STATIC ASSETS ---
  // Ensure public directory assets (PWA manifest, icons, offline.html) are always served
  app.use(express.static(path.join(process.cwd(), 'public')));

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NoteNest Full-Stack Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
