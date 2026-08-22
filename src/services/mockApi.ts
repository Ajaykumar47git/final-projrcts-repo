import type {
  User,
  Report,
  ReportImage,
  ReportComment,
  ReportStatusHistory,
  Department,
  Notification,
  ReportStatus,
  ReportCategory,
  ReportSeverity,
} from '../types';
import {
  mockUsers,
  mockReports,
  mockImages,
  mockComments,
  mockStatusHistory,
  mockDepartments,
  mockNotifications,
} from '../data/mockData';
import { getStorageItem, setStorageItem, removeStorageItem } from './localStorage';

// Initialize storage with mock data if empty
function initializeStorage() {
  if (!getStorageItem('initialized', false)) {
    setStorageItem('users', mockUsers);
    setStorageItem('reports', mockReports);
    setStorageItem('images', mockImages);
    setStorageItem('comments', mockComments);
    setStorageItem('statusHistory', mockStatusHistory);
    setStorageItem('departments', mockDepartments);
    setStorageItem('notifications', mockNotifications);
    setStorageItem('initialized', true);
  }
}

initializeStorage();

function delay(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function generateId() {
  return 'id-' + Math.random().toString(36).slice(2, 11);
}

function generateReportNumber(reports: Report[]): string {
  const num = reports.length + 1;
  return `CF-2024-${String(num).padStart(4, '0')}`;
}

// Auth
export const auth = {
  currentUser: (): User | null => {
    return getStorageItem<User | null>('currentUser', null);
  },

  signUp: async (email: string, password: string, fullName: string, role: 'resident' | 'administrator'): Promise<User> => {
    await delay(500);
    const users = getStorageItem<User[]>('users', mockUsers);
    if (users.find((u) => u.email === email)) {
      throw new Error('An account with this email already exists.');
    }
    if (!email || !password || !fullName) {
      throw new Error('All fields are required.');
    }
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters.');
    }
    const newUser: User = {
      id: generateId(),
      email,
      full_name: fullName,
      phone: '',
      role,
      neighborhood: '',
      avatar_url: null,
      notification_preferences: {
        email_notifications: true,
        in_app_notifications: true,
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    users.push(newUser);
    setStorageItem('users', users);
    setStorageItem('currentUser', newUser);
    return newUser;
  },

  signIn: async (email: string, _password: string): Promise<User> => {
    await delay(500);
    const users = getStorageItem<User[]>('users', mockUsers);
    const user = users.find((u) => u.email === email);
    if (!user) {
      throw new Error('No account found with this email address.');
    }
    setStorageItem('currentUser', user);
    return user;
  },

  signOut: async (): Promise<void> => {
    await delay(200);
    removeStorageItem('currentUser');
  },

  resetPassword: async (email: string): Promise<void> => {
    await delay(500);
    const users = getStorageItem<User[]>('users', mockUsers);
    if (!users.find((u) => u.email === email)) {
      throw new Error('No account found with this email address.');
    }
    // In a real app, this would send an email
  },

  updateProfile: async (userId: string, updates: Partial<User>): Promise<User> => {
    await delay(400);
    const users = getStorageItem<User[]>('users', mockUsers);
    const idx = users.findIndex((u) => u.id === userId);
    if (idx === -1) throw new Error('User not found.');
    users[idx] = { ...users[idx], ...updates, updated_at: new Date().toISOString() };
    setStorageItem('users', users);
    setStorageItem('currentUser', users[idx]);
    return users[idx];
  },
};

// Reports
export const reports = {
  list: async (filters?: {
    user_id?: string;
    category?: ReportCategory;
    status?: ReportStatus;
    severity?: ReportSeverity;
    neighborhood?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: Report[]; total: number }> => {
    await delay(300);
    let data = getStorageItem<Report[]>('reports', mockReports);

    if (filters?.user_id) {
      data = data.filter((r) => r.user_id === filters.user_id);
    }
    if (filters?.category) {
      data = data.filter((r) => r.category === filters.category);
    }
    if (filters?.status) {
      data = data.filter((r) => r.status === filters.status);
    }
    if (filters?.severity) {
      data = data.filter((r) => r.severity === filters.severity);
    }
    if (filters?.neighborhood) {
      data = data.filter((r) => r.neighborhood === filters.neighborhood);
    }
    if (filters?.search) {
      const s = filters.search.toLowerCase();
      data = data.filter(
        (r) =>
          r.title.toLowerCase().includes(s) ||
          r.description.toLowerCase().includes(s) ||
          r.report_number.toLowerCase().includes(s)
      );
    }

    const total = data.length;

    // Sort by created_at descending
    data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    if (filters?.page && filters?.limit) {
      const start = (filters.page - 1) * filters.limit;
      data = data.slice(start, start + filters.limit);
    }

    return { data, total };
  },

  get: async (id: string): Promise<Report | null> => {
    await delay(200);
    const all = getStorageItem<Report[]>('reports', mockReports);
    return all.find((r) => r.id === id) || null;
  },

  create: async (report: Omit<Report, 'id' | 'report_number' | 'created_at' | 'updated_at' | 'resolved_at'>): Promise<Report> => {
    await delay(600);
    const all = getStorageItem<Report[]>('reports', mockReports);
    const newReport: Report = {
      ...report,
      id: generateId(),
      report_number: generateReportNumber(all),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      resolved_at: null,
    };
    all.unshift(newReport);
    setStorageItem('reports', all);
    return newReport;
  },

  update: async (id: string, updates: Partial<Report>): Promise<Report> => {
    await delay(400);
    const all = getStorageItem<Report[]>('reports', mockReports);
    const idx = all.findIndex((r) => r.id === id);
    if (idx === -1) throw new Error('Report not found.');
    all[idx] = { ...all[idx], ...updates, updated_at: new Date().toISOString() };
    setStorageItem('reports', all);
    return all[idx];
  },

  updateStatus: async (
    id: string,
    newStatus: ReportStatus,
    changedBy: string,
    changedByName: string,
    note?: string
  ): Promise<{ report: Report; history: ReportStatusHistory }> => {
    await delay(400);
    const all = getStorageItem<Report[]>('reports', mockReports);
    const idx = all.findIndex((r) => r.id === id);
    if (idx === -1) throw new Error('Report not found.');

    const oldStatus = all[idx].status;
    all[idx].status = newStatus;
    all[idx].updated_at = new Date().toISOString();
    if (newStatus === 'resolved') {
      all[idx].resolved_at = new Date().toISOString();
    }
    setStorageItem('reports', all);

    const historyEntry: ReportStatusHistory = {
      id: generateId(),
      report_id: id,
      old_status: oldStatus,
      new_status: newStatus,
      changed_by: changedBy,
      changed_by_name: changedByName,
      note: note || null,
      created_at: new Date().toISOString(),
    };
    const history = getStorageItem<ReportStatusHistory[]>('statusHistory', mockStatusHistory);
    history.push(historyEntry);
    setStorageItem('statusHistory', history);

    return { report: all[idx], history: historyEntry };
  },

  delete: async (id: string): Promise<void> => {
    await delay(300);
    const all = getStorageItem<Report[]>('reports', mockReports);
    setStorageItem(
      'reports',
      all.filter((r) => r.id !== id)
    );
  },
};

// Images
export const images = {
  list: async (reportId: string): Promise<ReportImage[]> => {
    await delay(200);
    const all = getStorageItem<ReportImage[]>('images', mockImages);
    return all.filter((i) => i.report_id === reportId);
  },

  upload: async (reportId: string, file: File): Promise<ReportImage> => {
    await delay(800);
    // Validate
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) {
      throw new Error('Only JPG, PNG, and WebP files are allowed.');
    }
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('File size must be less than 5MB.');
    }

    const url = URL.createObjectURL(file);
    const newImg: ReportImage = {
      id: generateId(),
      report_id: reportId,
      image_url: url,
      file_name: file.name,
      file_size: file.size,
      created_at: new Date().toISOString(),
    };
    const all = getStorageItem<ReportImage[]>('images', mockImages);
    all.push(newImg);
    setStorageItem('images', all);
    return newImg;
  },

  remove: async (id: string): Promise<void> => {
    await delay(200);
    const all = getStorageItem<ReportImage[]>('images', mockImages);
    setStorageItem(
      'images',
      all.filter((i) => i.id !== id)
    );
  },
};

// Comments
export const comments = {
  list: async (reportId: string, includeInternal = false): Promise<ReportComment[]> => {
    await delay(200);
    const all = getStorageItem<ReportComment[]>('comments', mockComments);
    return all
      .filter((c) => c.report_id === reportId && (includeInternal || c.visibility === 'public'))
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  },

  add: async (comment: Omit<ReportComment, 'id' | 'created_at'>): Promise<ReportComment> => {
    await delay(300);
    const newComment: ReportComment = {
      ...comment,
      id: generateId(),
      created_at: new Date().toISOString(),
    };
    const all = getStorageItem<ReportComment[]>('comments', mockComments);
    all.push(newComment);
    setStorageItem('comments', all);
    return newComment;
  },
};

// Status History
export const statusHistory = {
  list: async (reportId: string): Promise<ReportStatusHistory[]> => {
    await delay(200);
    const all = getStorageItem<ReportStatusHistory[]>('statusHistory', mockStatusHistory);
    return all
      .filter((h) => h.report_id === reportId)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  },
};

// Departments
export const departments = {
  list: async (): Promise<Department[]> => {
    await delay(200);
    return getStorageItem<Department[]>('departments', mockDepartments);
  },

  get: async (id: string): Promise<Department | null> => {
    await delay(100);
    const all = getStorageItem<Department[]>('departments', mockDepartments);
    return all.find((d) => d.id === id) || null;
  },
};

// Notifications
export const notifications = {
  list: async (userId: string): Promise<Notification[]> => {
    await delay(200);
    const all = getStorageItem<Notification[]>('notifications', mockNotifications);
    return all
      .filter((n) => n.user_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  unreadCount: async (userId: string): Promise<number> => {
    const all = getStorageItem<Notification[]>('notifications', mockNotifications);
    return all.filter((n) => n.user_id === userId && !n.is_read).length;
  },

  markRead: async (id: string): Promise<void> => {
    const all = getStorageItem<Notification[]>('notifications', mockNotifications);
    const idx = all.findIndex((n) => n.id === id);
    if (idx !== -1) {
      all[idx].is_read = true;
      setStorageItem('notifications', all);
    }
  },

  markAllRead: async (userId: string): Promise<void> => {
    const all = getStorageItem<Notification[]>('notifications', mockNotifications);
    all.forEach((n) => {
      if (n.user_id === userId) n.is_read = true;
    });
    setStorageItem('notifications', all);
  },

  add: async (notification: Omit<Notification, 'id' | 'created_at'>): Promise<Notification> => {
    const newNotif: Notification = {
      ...notification,
      id: generateId(),
      created_at: new Date().toISOString(),
    };
    const all = getStorageItem<Notification[]>('notifications', mockNotifications);
    all.unshift(newNotif);
    setStorageItem('notifications', all);
    return newNotif;
  },
};

// Stats for admin dashboard
export const stats = {
  getDashboardStats: async () => {
    await delay(300);
    const allReports = getStorageItem<Report[]>('reports', mockReports);

    const total = allReports.length;
    const byStatus = {
      submitted: allReports.filter((r) => r.status === 'submitted').length,
      under_review: allReports.filter((r) => r.status === 'under_review').length,
      assigned: allReports.filter((r) => r.status === 'assigned').length,
      in_progress: allReports.filter((r) => r.status === 'in_progress').length,
      resolved: allReports.filter((r) => r.status === 'resolved').length,
      rejected: allReports.filter((r) => r.status === 'rejected').length,
    };

    const byCategory = {
      pothole: allReports.filter((r) => r.category === 'pothole').length,
      streetlight: allReports.filter((r) => r.category === 'streetlight').length,
      garbage: allReports.filter((r) => r.category === 'garbage').length,
      water_leak: allReports.filter((r) => r.category === 'water_leak').length,
      damaged_sidewalk: allReports.filter((r) => r.category === 'damaged_sidewalk').length,
      traffic_signal: allReports.filter((r) => r.category === 'traffic_signal').length,
      public_safety: allReports.filter((r) => r.category === 'public_safety').length,
      other: allReports.filter((r) => r.category === 'other').length,
    };

    const bySeverity = {
      low: allReports.filter((r) => r.severity === 'low').length,
      medium: allReports.filter((r) => r.severity === 'medium').length,
      high: allReports.filter((r) => r.severity === 'high').length,
      emergency: allReports.filter((r) => r.severity === 'emergency').length,
    };

    const resolvedReports = allReports.filter((r) => r.resolved_at);
    let avgResolutionDays = 0;
    if (resolvedReports.length > 0) {
      const totalDays = resolvedReports.reduce((acc, r) => {
        const diff = new Date(r.resolved_at!).getTime() - new Date(r.created_at).getTime();
        return acc + diff / (1000 * 60 * 60 * 24);
      }, 0);
      avgResolutionDays = Math.round(totalDays / resolvedReports.length * 10) / 10;
    }

    const byNeighborhood: Record<string, number> = {};
    allReports.forEach((r) => {
      byNeighborhood[r.neighborhood] = (byNeighborhood[r.neighborhood] || 0) + 1;
    });

    const byMonth = [
      { month: 'May', count: 2 },
      { month: 'Jun', count: 3 },
      { month: 'Jul', count: 4 },
      { month: 'Aug', count: 5 },
      { month: 'Sep', count: 4 },
      { month: 'Oct', count: 5 },
    ];

    return {
      total,
      highPriority: bySeverity.high + bySeverity.emergency,
      byStatus,
      byCategory,
      bySeverity,
      byNeighborhood,
      byMonth,
      avgResolutionDays,
    };
  },
};
