export type UserRole = 'student' | 'admin' | 'moderator';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio?: string;
  university: string;
  role: UserRole;
  isSuspended?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Note {
  id: string;
  title: string;
  description: string;
  fileUrl: string;
  fileName: string;
  fileSize: number; // in bytes
  fileType: string;
  subject: string;
  university: string;
  course: string;
  semester: string;
  tags: string[];
  visibility: 'public' | 'private';
  authorId: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    university: string;
  };
  views: number;
  downloads: number;
  likesCount: number;
  bookmarksCount: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
  previewPages: string[]; // SVG / styled HTML preview pages
  pageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  userId: string;
  noteId: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    university: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Report {
  id: string;
  reporterId: string;
  reporterName: string;
  noteId: string;
  noteTitle: string;
  reason: string;
  details?: string;
  status: 'pending' | 'reviewed' | 'dismissed';
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  type: 'like' | 'comment' | 'upload' | 'admin' | 'report';
  title: string;
  message: string;
  read: boolean;
  noteId?: string;
  createdAt: string;
}

export interface SubjectInfo {
  name: string;
  iconName: string;
  noteCount: number;
  color: string;
  description: string;
}

export interface FilterOptions {
  search?: string;
  subject?: string;
  university?: string;
  course?: string;
  semester?: string;
  tag?: string;
  sortBy?: 'newest' | 'downloads' | 'likes';
  page?: number;
  limit?: number;
}
