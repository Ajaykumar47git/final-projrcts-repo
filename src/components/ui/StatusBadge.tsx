import { Badge } from './Badge';
import {
  Clock,
  Eye,
  UserCheck,
  Wrench,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import type { ReportStatus } from '../../types';
import { STATUS_LABELS } from '../../types';

const statusConfig: Record<ReportStatus, { color: string; icon: React.ReactNode }> = {
  submitted: {
    color: 'bg-blue-100 text-blue-800',
    icon: <Clock className="w-3 h-3" />,
  },
  under_review: {
    color: 'bg-yellow-100 text-yellow-800',
    icon: <Eye className="w-3 h-3" />,
  },
  assigned: {
    color: 'bg-purple-100 text-purple-800',
    icon: <UserCheck className="w-3 h-3" />,
  },
  in_progress: {
    color: 'bg-orange-100 text-orange-800',
    icon: <Wrench className="w-3 h-3" />,
  },
  resolved: {
    color: 'bg-green-100 text-green-800',
    icon: <CheckCircle className="w-3 h-3" />,
  },
  rejected: {
    color: 'bg-gray-100 text-gray-600',
    icon: <XCircle className="w-3 h-3" />,
  },
};

export function StatusBadge({ status }: { status: ReportStatus }) {
  const config = statusConfig[status];
  return (
    <Badge className={config.color}>
      {config.icon}
      {STATUS_LABELS[status]}
    </Badge>
  );
}
