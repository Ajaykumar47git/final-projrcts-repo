import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusCircle,
  FileText,
  Clock,
  CheckCircle,
  Search,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { reports as reportsApi, notifications as notificationsApi } from '../services/mockApi';
import type { Report, Notification } from '../types';
import { CATEGORY_LABELS, STATUS_LABELS, SEVERITY_LABELS } from '../types';
import { SummaryCard } from '../components/ui/SummaryCard';
import { ReportCard } from '../components/ui/ReportCard';
import { EmptyState } from '../components/ui/EmptyState';
import { Skeleton } from '../components/ui/Skeleton';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { useToast } from '../context/ToastContext';

export default function ResidentDashboard() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [allReports, setAllReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data } = await reportsApi.list({ user_id: user.id });
      setAllReports(data);
      const notifs = await notificationsApi.list(user.id);
      setNotifications(notifs);
    } catch {
      showToast('error', 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const filtered = allReports.filter((r) => {
    if (search && !r.title.toLowerCase().includes(search.toLowerCase()) && !r.report_number.toLowerCase().includes(search.toLowerCase())) return false;
    if (categoryFilter && r.category !== categoryFilter) return false;
    if (statusFilter && r.status !== statusFilter) return false;
    if (severityFilter && r.severity !== severityFilter) return false;
    return true;
  });

  const stats = {
    total: allReports.length,
    submitted: allReports.filter((r) => r.status === 'submitted').length,
    inProgress: allReports.filter((r) => ['under_review', 'assigned', 'in_progress'].includes(r.status)).length,
    resolved: allReports.filter((r) => r.status === 'resolved').length,
  };

  const unreadNotifs = notifications.filter((n) => !n.is_read);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-40 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {user?.avatar_url && (
            <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0 shadow-lg ring-2 ring-teal-100">
              <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-navy-900">
              Welcome back, <span className="gradient-text">{user?.full_name?.split(' ')[0]}</span>
            </h1>
            <p className="text-navy-500 mt-1">Here's an overview of your reports</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              Notifications
              {unreadNotifs.length > 0 && (
                <span className="w-5 h-5 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                  {unreadNotifs.length}
                </span>
              )}
            </Button>
            {showNotifications && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                <div className="absolute right-0 top-full mt-1 w-80 bg-white rounded-2xl shadow-xl border border-navy-100 z-50 max-h-96 overflow-y-auto">
                  <div className="p-3 border-b border-navy-100 flex items-center justify-between">
                    <h3 className="font-semibold text-navy-900">Notifications</h3>
                    <button
                      onClick={async () => {
                        if (user) await notificationsApi.markAllRead(user.id);
                        setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
                      }}
                      className="text-xs text-teal-600 hover:text-teal-700 font-medium"
                    >
                      Mark all read
                    </button>
                  </div>
                  {notifications.length === 0 ? (
                    <p className="p-4 text-sm text-navy-500 text-center">No notifications yet</p>
                  ) : (
                    notifications.slice(0, 10).map((n) => (
                      <div
                        key={n.id}
                        className={`p-3 border-b border-navy-50 ${!n.is_read ? 'bg-teal-50/50' : ''}`}
                      >
                        <p className="text-sm font-medium text-navy-800">{n.title}</p>
                        <p className="text-xs text-navy-500 mt-0.5">{n.message}</p>
                        <p className="text-[10px] text-navy-400 mt-1">
                          {new Date(n.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
          <Link to="/report" className="btn-primary text-sm">
            <PlusCircle className="w-4 h-4" />
            Report Issue
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 perspective-1500">
        <SummaryCard
          title="My Reports"
          value={stats.total}
          icon={<FileText className="w-5 h-5 text-white" />}
          gradient="bg-gradient-to-br from-navy-600 to-navy-800"
        />
        <SummaryCard
          title="Awaiting Review"
          value={stats.submitted}
          icon={<Clock className="w-5 h-5 text-white" />}
          gradient="bg-gradient-to-br from-amber-400 to-orange-500"
        />
        <SummaryCard
          title="In Progress"
          value={stats.inProgress}
          icon={<ChevronRight className="w-5 h-5 text-white" />}
          gradient="bg-gradient-to-br from-blue-500 to-indigo-600"
        />
        <SummaryCard
          title="Resolved"
          value={stats.resolved}
          icon={<CheckCircle className="w-5 h-5 text-white" />}
          gradient="bg-gradient-to-br from-emerald-500 to-green-600"
        />
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              placeholder="Search reports..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>
          <div className="flex gap-3 flex-wrap">
            <Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              options={[
                { value: '', label: 'All Categories' },
                ...Object.entries(CATEGORY_LABELS).map(([k, v]) => ({ value: k, label: v })),
              ]}
              className="w-44"
            />
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: '', label: 'All Statuses' },
                ...Object.entries(STATUS_LABELS).map(([k, v]) => ({ value: k, label: v })),
              ]}
              className="w-40"
            />
            <Select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              options={[
                { value: '', label: 'All Severities' },
                ...Object.entries(SEVERITY_LABELS).map(([k, v]) => ({ value: k, label: v })),
              ]}
              className="w-36"
            />
          </div>
        </div>
      </div>

      {/* Reports List */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<FileText className="w-8 h-8" />}
          title={allReports.length === 0 ? 'No reports yet' : 'No matching reports'}
          description={
            allReports.length === 0
              ? 'Start by reporting an issue in your neighborhood.'
              : 'Try adjusting your filters or search terms.'
          }
          action={
            allReports.length === 0 ? (
              <Link to="/report" className="btn-primary">
                <PlusCircle className="w-4 h-4" />
                Report an Issue
              </Link>
            ) : undefined
          }
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 perspective-1500">
          {filtered.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
        </div>
      )}
    </div>
  );
}
