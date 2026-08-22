import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Hash,
  Share2,
  Flag,
  MessageSquare,
  Clock,
  CheckCircle,
  Eye,
  UserCheck,
  Wrench,
  FileText,
} from 'lucide-react';
import {
  reports as reportsApi,
  images as imagesApi,
  comments as commentsApi,
  statusHistory as historyApi,
} from '../services/mockApi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { StatusBadge } from '../components/ui/StatusBadge';
import { SeverityBadge } from '../components/ui/SeverityBadge';
import { Button } from '../components/ui/Button';
import { Textarea } from '../components/ui/Textarea';
import { Modal } from '../components/ui/Modal';
import { Skeleton } from '../components/ui/Skeleton';
import type { Report, ReportImage, ReportComment, ReportStatusHistory } from '../types';
import { CATEGORY_LABELS } from '../types';

const statusSteps = [
  { status: 'submitted', icon: FileText, label: 'Submitted' },
  { status: 'under_review', icon: Eye, label: 'Under Review' },
  { status: 'assigned', icon: UserCheck, label: 'Assigned' },
  { status: 'in_progress', icon: Wrench, label: 'In Progress' },
  { status: 'resolved', icon: CheckCircle, label: 'Resolved' },
];

const statusOrder = ['submitted', 'under_review', 'assigned', 'in_progress', 'resolved'];

export default function IssueDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [report, setReport] = useState<Report | null>(null);
  const [images, setImages] = useState<ReportImage[]>([]);
  const [comments, setComments] = useState<ReportComment[]>([]);
  const [history, setHistory] = useState<ReportStatusHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [, setShareTooltip] = useState(false);

  useEffect(() => {
    if (id) loadReport(id);
  }, [id]);

  const loadReport = async (reportId: string) => {
    setLoading(true);
    try {
      const [r, imgs, cmts, hist] = await Promise.all([
        reportsApi.get(reportId),
        imagesApi.list(reportId),
        commentsApi.list(reportId, user?.role === 'administrator'),
        historyApi.list(reportId),
      ]);
      setReport(r);
      setImages(imgs);
      setComments(cmts);
      setHistory(hist);
    } catch {
      showToast('error', 'Failed to load report details');
    } finally {
      setLoading(false);
    }
  };

  const addComment = async () => {
    if (!user || !report || !newComment.trim()) return;
    setCommentLoading(true);
    try {
      const cmt = await commentsApi.add({
        report_id: report.id,
        author_id: user.id,
        author_name: user.full_name,
        comment: newComment.trim(),
        visibility: 'public',
      });
      setComments((prev) => [...prev, cmt]);
      setNewComment('');
      showToast('success', 'Comment added');
    } catch {
      showToast('error', 'Failed to add comment');
    } finally {
      setCommentLoading(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareTooltip(true);
    showToast('success', 'Link copied to clipboard');
    setTimeout(() => setShareTooltip(false), 2000);
  };

  const handleReport = async () => {
    if (!reportReason.trim()) {
      showToast('error', 'Please provide a reason');
      return;
    }
    setShowReportModal(false);
    setReportReason('');
    showToast('success', 'Report submitted. Our team will review it.');
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 rounded-xl" />
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="max-w-3xl mx-auto text-center py-16">
        <FileText className="w-16 h-16 text-navy-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-navy-900 mb-2">Report not found</h1>
        <p className="text-navy-500 mb-6">The report you're looking for doesn't exist or has been removed.</p>
        <Link to="/explore" className="btn-primary">
          <ArrowLeft className="w-4 h-4" />
          Explore Issues
        </Link>
      </div>
    );
  }

  const currentStatusIdx = statusOrder.indexOf(report.status === 'rejected' ? 'submitted' : report.status);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-navy-500 hover:text-navy-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      {/* Header */}
      <div className="card relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 via-blue-500 to-violet-500" />
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-navy-500 flex items-center gap-1">
                <Hash className="w-3.5 h-3.5" />
                {report.report_number}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-navy-900">{report.title}</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleShare} className="relative">
              <Share2 className="w-4 h-4" />
              Share
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowReportModal(true)}>
              <Flag className="w-4 h-4" />
              Report
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <StatusBadge status={report.status} />
          <SeverityBadge severity={report.severity} />
          <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full bg-navy-100 text-navy-700">
            {CATEGORY_LABELS[report.category]}
          </span>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-navy-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-navy-800">{report.address}</p>
              <p className="text-navy-500">{report.neighborhood}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Calendar className="w-4 h-4 text-navy-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-navy-800">Reported {new Date(report.created_at).toLocaleDateString()}</p>
              <p className="text-navy-500">Updated {new Date(report.updated_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="card">
        <h2 className="text-lg font-semibold text-navy-900 mb-3">Description</h2>
        <p className="text-navy-700 leading-relaxed whitespace-pre-wrap">{report.description}</p>
      </div>

      {/* Images */}
      {images.length > 0 && (
        <div className="card">
          <h2 className="text-lg font-semibold text-navy-900 mb-3">Images</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {images.map((img) => (
              <img
                key={img.id}
                src={img.image_url}
                alt={`Report image: ${img.file_name}`}
                className="w-full h-40 object-cover rounded-lg"
              />
            ))}
          </div>
        </div>
      )}

      {/* Location Map */}
      <div className="card">
        <h2 className="text-lg font-semibold text-navy-900 mb-3">Location</h2>
        <div className="w-full h-48 bg-navy-100 rounded-lg flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-50 to-blue-50" />
          <div className="relative text-center">
            <MapPin className="w-8 h-8 text-teal-600 mx-auto mb-1" />
            <p className="text-sm text-navy-700">{report.address}</p>
            <p className="text-xs text-navy-500">
              {report.latitude.toFixed(4)}, {report.longitude.toFixed(4)}
            </p>
          </div>
        </div>
      </div>

      {/* Status Timeline */}
      <div className="card">
        <h2 className="text-lg font-semibold text-navy-900 mb-4">Progress Timeline</h2>
        <div className="flex flex-col sm:flex-row sm:items-center gap-0 sm:gap-0">
          {statusSteps.map((s, i) => {
            const isComplete = i <= currentStatusIdx;
            const isCurrent = i === currentStatusIdx;
            const Icon = s.icon;
            return (
              <div key={s.status} className="flex sm:flex-col items-center sm:items-center flex-1">
                <div className="flex items-center sm:flex-col gap-2 sm:gap-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isComplete ? 'bg-teal-600 text-white' : 'bg-navy-100 text-navy-400'
                    } ${isCurrent ? 'ring-4 ring-teal-200' : ''}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-xs font-medium ${isComplete ? 'text-navy-800' : 'text-navy-400'}`}>
                    {s.label}
                  </span>
                </div>
                {i < statusSteps.length - 1 && (
                  <div className={`h-0.5 w-full sm:w-full sm:h-0.5 mx-4 sm:mx-0 sm:my-1 ${
                    i < currentStatusIdx ? 'bg-teal-600' : 'bg-navy-200'
                  }`} style={{ minWidth: 40 }} />
                )}
              </div>
            );
          })}
        </div>
        {report.rejection_reason && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm font-medium text-red-800">Rejection Reason</p>
            <p className="text-sm text-red-700 mt-1">{report.rejection_reason}</p>
          </div>
        )}
      </div>

      {/* Status History */}
      {history.length > 0 && (
        <div className="card">
          <h2 className="text-lg font-semibold text-navy-900 mb-4">Status History</h2>
          <div className="space-y-4">
            {history.map((h) => (
              <div key={h.id} className="flex gap-3">
                <div className="w-8 h-8 bg-navy-100 rounded-full flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-navy-500" />
                </div>
                <div>
                  <p className="text-sm text-navy-800">
                    <span className="font-medium">{h.changed_by_name}</span>
                    {' '}changed status from{' '}
                    <span className="font-medium">{h.old_status || 'new'}</span>
                    {' '}to{' '}
                    <span className="font-medium">{h.new_status}</span>
                  </p>
                  {h.note && <p className="text-sm text-navy-600 mt-0.5">{h.note}</p>}
                  <p className="text-xs text-navy-400 mt-1">
                    {new Date(h.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Public Comments */}
      <div className="card">
        <h2 className="text-lg font-semibold text-navy-900 mb-4">Updates & Comments</h2>
        {comments.length === 0 ? (
          <p className="text-sm text-navy-500">No public updates yet.</p>
        ) : (
          <div className="space-y-4 mb-6">
            {comments.map((c) => (
              <div key={c.id} className={`p-4 rounded-lg ${c.visibility === 'internal' ? 'bg-yellow-50 border border-yellow-200' : 'bg-navy-50'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 bg-navy-200 rounded-full flex items-center justify-center text-navy-600 text-xs font-medium">
                    {c.author_name?.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-navy-800">{c.author_name}</span>
                  <span className="text-xs text-navy-400">{new Date(c.created_at).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-navy-700">{c.comment}</p>
              </div>
            ))}
          </div>
        )}
        {user && (
          <div className="flex gap-3">
            <Textarea
              placeholder="Add a comment or additional information..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[80px]"
            />
          </div>
        )}
        {user && (
          <div className="flex justify-end mt-3">
            <Button onClick={addComment} loading={commentLoading} size="sm" disabled={!newComment.trim()}>
              <MessageSquare className="w-4 h-4" />
              Add Comment
            </Button>
          </div>
        )}
      </div>

      {/* Report Modal */}
      <Modal isOpen={showReportModal} onClose={() => setShowReportModal(false)} title="Report Incorrect Information">
        <div className="space-y-4">
          <p className="text-sm text-navy-600">
            If this report contains incorrect or misleading information, please describe the issue below.
          </p>
          <Textarea
            label="Reason"
            placeholder="Describe what information is incorrect..."
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
          />
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowReportModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleReport}>Submit Report</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
