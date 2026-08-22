import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Map,
  List,
  MapPin,
} from 'lucide-react';
import { reports as reportsApi } from '../services/mockApi';
import type { Report } from '../types';
import { CATEGORY_LABELS, STATUS_LABELS, NEIGHBORHOODS } from '../types';
import { ReportCard } from '../components/ui/ReportCard';
import { StatusBadge } from '../components/ui/StatusBadge';
import { SeverityBadge } from '../components/ui/SeverityBadge';
import { EmptyState } from '../components/ui/EmptyState';
import { Skeleton } from '../components/ui/Skeleton';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';

export default function ExploreIssuesPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('list');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [severity, setSeverity] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setLoading(true);
    try {
      const { data } = await reportsApi.list();
      setReports(data);
    } catch {
      console.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const filtered = reports.filter((r) => {
    if (search && !r.title.toLowerCase().includes(search.toLowerCase()) && !r.report_number.toLowerCase().includes(search.toLowerCase())) return false;
    if (category && r.category !== category) return false;
    if (status && r.status !== status) return false;
    if (severity && r.severity !== severity) return false;
    if (neighborhood && r.neighborhood !== neighborhood) return false;
    return true;
  });

  const markerColors: Record<string, string> = {
    submitted: '#3B82F6',
    under_review: '#EAB308',
    assigned: '#A855F7',
    in_progress: '#F97316',
    resolved: '#22C55E',
    rejected: '#6B7280',
  };

  return (
    <div className="min-h-screen bg-navy-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy-900 mb-2">Explore Issues</h1>
          <p className="text-navy-500">
            See what issues are being reported across your community.
          </p>
        </div>

        {/* Filters */}
        <div className="card mb-6">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="flex-1">
              <Input
                placeholder="Search issues..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                icon={<Search className="w-4 h-4" />}
              />
            </div>
            <div className="flex gap-3 flex-wrap">
              <Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                options={[
                  { value: '', label: 'All Categories' },
                  ...Object.entries(CATEGORY_LABELS).map(([k, v]) => ({ value: k, label: v })),
                ]}
                className="w-44"
              />
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                options={[
                  { value: '', label: 'All Statuses' },
                  ...Object.entries(STATUS_LABELS).map(([k, v]) => ({ value: k, label: v })),
                ]}
                className="w-40"
              />
              <Select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                options={[
                  { value: '', label: 'All Severities' },
                  { value: 'low', label: 'Low' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'high', label: 'High' },
                  { value: 'emergency', label: 'Emergency' },
                ]}
                className="w-36"
              />
              <Select
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                options={[
                  { value: '', label: 'All Neighborhoods' },
                  ...NEIGHBORHOODS.map((n) => ({ value: n, label: n })),
                ]}
                className="w-44"
              />
            </div>
          </div>
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-navy-100">
            <p className="text-sm text-navy-500">
              {filtered.length} issue{filtered.length !== 1 ? 's' : ''} found
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'list' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
                List
              </Button>
              <Button
                variant={viewMode === 'map' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('map')}
              >
                <Map className="w-4 h-4" />
                Map
              </Button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))}
          </div>
        ) : viewMode === 'map' ? (
          <div className="card overflow-hidden">
            {/* Map View */}
            <div className="w-full h-[500px] bg-navy-100 relative rounded-lg overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-teal-50" />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Map className="w-12 h-12 text-navy-300 mb-3" />
                <p className="text-navy-600 font-medium mb-1">Interactive Map</p>
                <p className="text-sm text-navy-500 mb-4">Map integration ready for Leaflet/Mapbox</p>
                
                {/* Plot markers as dots */}
                {filtered.map((r) => (
                  <button
                    key={r.id}
                    className="absolute w-8 h-8 -ml-4 -mt-4 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg hover:scale-110 transition-transform cursor-pointer z-10"
                    style={{
                      left: `${((r.longitude + 74) * 1000) % 100}%`,
                      top: `${((r.latitude - 40) * 1000) % 100}%`,
                      backgroundColor: markerColors[r.status] || '#6B7280',
                    }}
                    onClick={() => setSelectedReport(selectedReport?.id === r.id ? null : r)}
                    aria-label={`${r.title} - ${STATUS_LABELS[r.status]}`}
                  >
                    {r.report_number.slice(-2)}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Preview card */}
            {selectedReport && (
              <div className="mt-4 p-4 bg-navy-50 rounded-lg border border-navy-200">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs text-navy-500 mb-1">{selectedReport.report_number}</p>
                    <h3 className="font-semibold text-navy-900">{selectedReport.title}</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <StatusBadge status={selectedReport.status} />
                      <SeverityBadge severity={selectedReport.severity} />
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm text-navy-500">
                      <span>{CATEGORY_LABELS[selectedReport.category]}</span>
                      <span>{selectedReport.neighborhood}</span>
                      <span>{new Date(selectedReport.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <Link
                    to={`/issues/${selectedReport.id}`}
                    className="btn-primary text-sm shrink-0"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            )}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<MapPin className="w-8 h-8" />}
            title="No issues found"
            description="Try adjusting your filters or search terms to find what you're looking for."
          />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
