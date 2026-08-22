import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  AlertTriangle,
  Clock,
  CheckCircle,
  TrendingUp,
  Search,
  Eye,
  ChevronUp,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line,
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  reports as reportsApi,
  stats as statsApi,
  departments as departmentsApi,
} from '../services/mockApi';
import type { Report, Department, ReportStatus } from '../types';
import { CATEGORY_LABELS, STATUS_LABELS } from '../types';
import { SummaryCard } from '../components/ui/SummaryCard';
import { StatusBadge } from '../components/ui/StatusBadge';
import { SeverityBadge } from '../components/ui/SeverityBadge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Modal } from '../components/ui/Modal';
import { Pagination } from '../components/ui/Pagination';
import { RequireAuth } from '../components/layout/RequireAuth';

const COLORS = ['#0D9488', '#3B82F6', '#F59E0B', '#8B5CF6', '#EF4444', '#6B7280', '#F97316', '#06B6D4'];

export default function AdminDashboard() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [allReports, setAllReports] = useState<Report[]>([]);
  const [dashboardStats, setDashboardStats] = useState<ReturnType<typeof statsApi.getDashboardStats> extends Promise<infer R> ? R : never>();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('');
  const [filterDept] = useState('');
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState<'created_at' | 'severity' | 'status'>('created_at');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'reports' | 'analytics'>('overview');
  const [statusUpdate, setStatusUpdate] = useState('');
  const [assignDept, setAssignDept] = useState('');
  const [internalNote, setInternalNote] = useState('');
  const limit = 10;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [reportsRes, statsData, depts] = await Promise.all([
        reportsApi.list(),
        statsApi.getDashboardStats(),
        departmentsApi.list(),
      ]);
      setAllReports(reportsRes.data);
      setDashboardStats(statsData);
      setDepartments(depts);
    } catch {
      showToast('error', 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const filtered = allReports.filter((r) => {
    if (search && !r.title.toLowerCase().includes(search.toLowerCase()) && !r.report_number.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterCategory && r.category !== filterCategory) return false;
    if (filterStatus && r.status !== filterStatus) return false;
    if (filterSeverity && r.severity !== filterSeverity) return false;
    if (filterDept && r.assigned_department_id !== filterDept) return false;
    return true;
  }).sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    return 0;
  });

  const totalPages = Math.ceil(filtered.length / limit);
  const paginated = filtered.slice((page - 1) * limit, page * limit);

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const openDetail = (report: Report) => {
    setSelectedReport(report);
    setStatusUpdate(report.status);
    setAssignDept(report.assigned_department_id || '');
    setInternalNote('');
    setShowDetailModal(true);
  };

  const updateReport = async () => {
    if (!selectedReport || !user) return;
    try {
      await reportsApi.updateStatus(
        selectedReport.id,
        statusUpdate as ReportStatus,
        user.id,
        user.full_name,
        internalNote || undefined
      );
      if (assignDept) {
        await reportsApi.update(selectedReport.id, { assigned_department_id: assignDept });
      }
      showToast('success', 'Report updated successfully');
      setShowDetailModal(false);
      loadData();
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Failed to update');
    }
  };

  const chartData = dashboardStats ? {
    byCategory: Object.entries(dashboardStats.byCategory)
      .map(([k, v]) => ({ name: CATEGORY_LABELS[k as keyof typeof CATEGORY_LABELS]?.slice(0, 12) || k, value: v }))
      .filter((d) => d.value > 0),
    byStatus: Object.entries(dashboardStats.byStatus)
      .map(([k, v]) => ({ name: STATUS_LABELS[k as keyof typeof STATUS_LABELS] || k, value: v }))
      .filter((d) => d.value > 0),
    byNeighborhood: Object.entries(dashboardStats.byNeighborhood)
      .map(([k, v]) => ({ name: k, count: v })),
    byMonth: dashboardStats.byMonth,
  } : null;

  return (
    <RequireAuth requiredRole="administrator">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-navy-900">Administrator <span className="gradient-text">Dashboard</span></h1>
            <p className="text-navy-500 mt-1">Manage and track all community reports</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={activeTab === 'overview' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </Button>
            <Button
              variant={activeTab === 'reports' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('reports')}
            >
              Reports
            </Button>
            <Button
              variant={activeTab === 'analytics' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('analytics')}
            >
              Analytics
            </Button>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && !loading && dashboardStats && (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 perspective-1500">
              <SummaryCard
                title="Total Reports"
                value={dashboardStats.total}
                icon={<FileText className="w-5 h-5 text-white" />}
                gradient="bg-gradient-to-br from-navy-600 to-navy-800"
              />
              <SummaryCard
                title="New"
                value={dashboardStats.byStatus.submitted}
                icon={<Clock className="w-5 h-5 text-white" />}
                gradient="bg-gradient-to-br from-blue-400 to-blue-600"
              />
              <SummaryCard
                title="High Priority"
                value={dashboardStats.highPriority}
                icon={<AlertTriangle className="w-5 h-5 text-white" />}
                gradient="bg-gradient-to-br from-red-400 to-red-600"
              />
              <SummaryCard
                title="In Progress"
                value={dashboardStats.byStatus.in_progress}
                icon={<TrendingUp className="w-5 h-5 text-white" />}
                gradient="bg-gradient-to-br from-amber-400 to-orange-500"
              />
              <SummaryCard
                title="Resolved"
                value={dashboardStats.byStatus.resolved}
                icon={<CheckCircle className="w-5 h-5 text-white" />}
                gradient="bg-gradient-to-br from-emerald-400 to-green-600"
              />
              <SummaryCard
                title="Avg Resolution"
                value={`${dashboardStats.avgResolutionDays}d`}
                icon={<Clock className="w-5 h-5 text-white" />}
                gradient="bg-gradient-to-br from-teal-400 to-teal-600"
              />
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-6">
              {chartData && (
                <>
                  <div className="card">
                    <h3 className="font-semibold text-navy-900 mb-4">Reports by Category</h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={chartData.byCategory}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#0D9488" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="card">
                    <h3 className="font-semibold text-navy-900 mb-4">Reports by Status</h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie data={chartData.byStatus} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}>
                          {chartData.byStatus.map((_, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="card">
                    <h3 className="font-semibold text-navy-900 mb-4">Reports by Neighborhood</h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={chartData.byNeighborhood} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Bar dataKey="count" fill="#0D9488" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="card">
                    <h3 className="font-semibold text-navy-900 mb-4">Reports by Month</h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={chartData.byMonth}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="count" stroke="#0D9488" strokeWidth={2} dot={{ r: 4 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </>
              )}
            </div>
          </>
        )}

        {/* Reports Tab */}
        {(activeTab === 'reports' || activeTab === 'overview') && (
          <div className={`${activeTab === 'overview' ? 'mt-6' : ''}`}>
            <div className="card">
              <div className="flex flex-col lg:flex-row gap-3 mb-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search reports..."
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    icon={<Search className="w-4 h-4" />}
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Select
                    value={filterCategory}
                    onChange={(e) => { setFilterCategory(e.target.value); setPage(1); }}
                    options={[{ value: '', label: 'All Categories' }, ...Object.entries(CATEGORY_LABELS).map(([k, v]) => ({ value: k, label: v }))]}
                    className="w-40"
                  />
                  <Select
                    value={filterStatus}
                    onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
                    options={[{ value: '', label: 'All Statuses' }, ...Object.entries(STATUS_LABELS).map(([k, v]) => ({ value: k, label: v }))]}
                    className="w-36"
                  />
                  <Select
                    value={filterSeverity}
                    onChange={(e) => { setFilterSeverity(e.target.value); setPage(1); }}
                    options={[{ value: '', label: 'All Severities' }, { value: 'low', label: 'Low' }, { value: 'medium', label: 'Medium' }, { value: 'high', label: 'High' }, { value: 'emergency', label: 'Emergency' }]}
                    className="w-36"
                  />
                </div>
              </div>

              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-navy-100">
                      <th className="text-left py-3 px-2 text-navy-500 font-medium">ID</th>
                      <th className="text-left py-3 px-2 text-navy-500 font-medium">Title</th>
                      <th className="text-left py-3 px-2 text-navy-500 font-medium">Category</th>
                      <th className="text-left py-3 px-2 text-navy-500 font-medium">Neighborhood</th>
                      <th className="text-left py-3 px-2 text-navy-500 font-medium cursor-pointer" onClick={() => toggleSort('severity')}>
                        Severity {sortField === 'severity' && (sortDir === 'asc' ? <ChevronUp className="w-3 h-3 inline" /> : <ChevronDown className="w-3 h-3 inline" />)}
                      </th>
                      <th className="text-left py-3 px-2 text-navy-500 font-medium cursor-pointer" onClick={() => toggleSort('status')}>
                        Status {sortField === 'status' && (sortDir === 'asc' ? <ChevronUp className="w-3 h-3 inline" /> : <ChevronDown className="w-3 h-3 inline" />)}
                      </th>
                      <th className="text-left py-3 px-2 text-navy-500 font-medium cursor-pointer" onClick={() => toggleSort('created_at')}>
                        Date {sortField === 'created_at' && (sortDir === 'asc' ? <ChevronUp className="w-3 h-3 inline" /> : <ChevronDown className="w-3 h-3 inline" />)}
                      </th>
                      <th className="text-left py-3 px-2 text-navy-500 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map((r) => (
                      <tr key={r.id} className="border-b border-navy-50 hover:bg-navy-50/50">
                        <td className="py-3 px-2 text-navy-600 font-mono text-xs">{r.report_number}</td>
                        <td className="py-3 px-2 text-navy-800 font-medium max-w-[200px] truncate">{r.title}</td>
                        <td className="py-3 px-2 text-navy-600">{CATEGORY_LABELS[r.category]}</td>
                        <td className="py-3 px-2 text-navy-600">{r.neighborhood}</td>
                        <td className="py-3 px-2"><SeverityBadge severity={r.severity} /></td>
                        <td className="py-3 px-2"><StatusBadge status={r.status} /></td>
                        <td className="py-3 px-2 text-navy-500 text-xs">{new Date(r.created_at).toLocaleDateString()}</td>
                        <td className="py-3 px-2">
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" onClick={() => openDetail(r)}>
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Link to={`/issues/${r.id}`} className="btn-ghost p-1.5">
                              <ChevronRight className="w-4 h-4" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden space-y-3">
                {paginated.map((r) => (
                  <div key={r.id} className="p-4 bg-navy-50 rounded-lg">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <p className="text-xs text-navy-500 font-mono">{r.report_number}</p>
                        <h3 className="font-medium text-navy-800">{r.title}</h3>
                      </div>
                      <StatusBadge status={r.status} />
                    </div>
                    <div className="flex items-center gap-3 text-xs text-navy-500 mb-2">
                      <span>{CATEGORY_LABELS[r.category]}</span>
                      <span>{r.neighborhood}</span>
                      <span>{new Date(r.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <SeverityBadge severity={r.severity} />
                      <Button variant="ghost" size="sm" onClick={() => openDetail(r)}>
                        Manage
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {filtered.length === 0 && (
                <p className="text-center py-8 text-navy-500">No reports match your filters.</p>
              )}

              <div className="mt-4">
                <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && chartData && (
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="font-semibold text-navy-900 mb-4">Reports by Category</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData.byCategory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#0D9488" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="card">
              <h3 className="font-semibold text-navy-900 mb-4">Reports by Status</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={chartData.byStatus} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}>
                    {chartData.byStatus.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="card">
              <h3 className="font-semibold text-navy-900 mb-4">Reports by Neighborhood</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData.byNeighborhood} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#0D9488" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="card">
              <h3 className="font-semibold text-navy-900 mb-4">Monthly Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData.byMonth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#0D9488" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Detail Modal */}
        <Modal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} title="Manage Report" maxWidth="max-w-2xl">
          {selectedReport && (
            <div className="space-y-4">
              <div>
                <p className="text-xs text-navy-500">{selectedReport.report_number}</p>
                <h3 className="text-lg font-semibold text-navy-900">{selectedReport.title}</h3>
                <p className="text-sm text-navy-600 mt-2">{selectedReport.description}</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Select
                  label="Update Status"
                  value={statusUpdate}
                  onChange={(e) => setStatusUpdate(e.target.value)}
                  options={Object.entries(STATUS_LABELS).map(([k, v]) => ({ value: k, label: v }))}
                />
                <Select
                  label="Assign Department"
                  value={assignDept}
                  onChange={(e) => setAssignDept(e.target.value)}
                  options={[
                    { value: '', label: 'Unassigned' },
                    ...departments.map((d) => ({ value: d.id, label: d.name })),
                  ]}
                />
              </div>
              <div>
                <label className="label-text">Internal Note</label>
                <textarea
                  className="input-field min-h-[80px]"
                  placeholder="Add an internal note..."
                  value={internalNote}
                  onChange={(e) => setInternalNote(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" onClick={() => setShowDetailModal(false)}>
                  Cancel
                </Button>
                <Button onClick={updateReport}>Save Changes</Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </RequireAuth>
  );
}
