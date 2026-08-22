export type UserRole = 'resident' | 'administrator';

export type ReportCategory =
  | 'pothole'
  | 'streetlight'
  | 'garbage'
  | 'water_leak'
  | 'damaged_sidewalk'
  | 'traffic_signal'
  | 'public_safety'
  | 'other';

export type ReportSeverity = 'low' | 'medium' | 'high' | 'emergency';

export type ReportStatus =
  | 'submitted'
  | 'under_review'
  | 'assigned'
  | 'in_progress'
  | 'resolved'
  | 'rejected';

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  role: UserRole;
  neighborhood: string;
  avatar_url: string | null;
  notification_preferences: NotificationPreferences;
  created_at: string;
  updated_at: string;
}

export interface NotificationPreferences {
  email_notifications: boolean;
  in_app_notifications: boolean;
}

export interface Report {
  id: string;
  report_number: string;
  user_id: string;
  title: string;
  description: string;
  category: ReportCategory;
  severity: ReportSeverity;
  status: ReportStatus;
  address: string;
  neighborhood: string;
  latitude: number;
  longitude: number;
  assigned_department_id: string | null;
  assigned_staff_id: string | null;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
  author_name?: string;
}

export interface ReportImage {
  id: string;
  report_id: string;
  image_url: string;
  file_name: string;
  file_size: number;
  created_at: string;
}

export interface ReportComment {
  id: string;
  report_id: string;
  author_id: string;
  author_name?: string;
  comment: string;
  visibility: 'public' | 'internal';
  created_at: string;
}

export interface ReportStatusHistory {
  id: string;
  report_id: string;
  old_status: ReportStatus | null;
  new_status: ReportStatus;
  changed_by: string;
  changed_by_name?: string;
  note: string | null;
  created_at: string;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  contact_email: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  report_id: string | null;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export const CATEGORY_LABELS: Record<ReportCategory, string> = {
  pothole: 'Pothole',
  streetlight: 'Broken Streetlight',
  garbage: 'Garbage/Overflowing Bin',
  water_leak: 'Water Leak',
  damaged_sidewalk: 'Damaged Sidewalk',
  traffic_signal: 'Traffic Signal',
  public_safety: 'Public Safety',
  other: 'Other',
};

export const SEVERITY_LABELS: Record<ReportSeverity, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  emergency: 'Emergency',
};

export const STATUS_LABELS: Record<ReportStatus, string> = {
  submitted: 'Submitted',
  under_review: 'Under Review',
  assigned: 'Assigned',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  rejected: 'Rejected',
};

export const STATUS_COLORS: Record<ReportStatus, string> = {
  submitted: 'bg-blue-100 text-blue-800',
  under_review: 'bg-yellow-100 text-yellow-800',
  assigned: 'bg-purple-100 text-purple-800',
  in_progress: 'bg-orange-100 text-orange-800',
  resolved: 'bg-green-100 text-green-800',
  rejected: 'bg-gray-100 text-gray-600',
};

export const SEVERITY_COLORS: Record<ReportSeverity, string> = {
  low: 'bg-blue-100 text-blue-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  emergency: 'bg-red-100 text-red-800',
};

export const CATEGORY_ICONS: Record<ReportCategory, string> = {
  pothole: 'CircleDashed',
  streetlight: 'Lightbulb',
  garbage: 'Trash2',
  water_leak: 'Droplets',
  damaged_sidewalk: 'Footprints',
  traffic_signal: 'TrafficCone',
  public_safety: 'Shield',
  other: 'HelpCircle',
};

export const NEIGHBORHOODS = [
  'Central District',
  'Northside',
  'Green Valley',
  'Parkview',
  'Downtown',
  'Riverside',
  'West End',
  'Eastgate',
  'Hilltop',
  'Lakeside',
];
