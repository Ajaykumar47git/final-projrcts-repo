import { Link } from 'react-router-dom';
import { MapPin, Calendar, Hash } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { SeverityBadge } from './SeverityBadge';
import type { Report } from '../../types';
import { CATEGORY_LABELS } from '../../types';

export function ReportCard({ report }: { report: Report }) {
  return (
    <Link
      to={`/issues/${report.id}`}
      className="card-tilt block group"
    >
      {/* Gradient accent top bar */}
      <div className="h-1 -mx-6 -mt-6 mb-4 rounded-t-2xl bg-gradient-to-r from-teal-500 via-blue-500 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="font-semibold text-navy-900 line-clamp-2 group-hover:text-teal-700 transition-colors">{report.title}</h3>
        <StatusBadge status={report.status} />
      </div>
      <div className="flex items-center gap-4 text-sm text-navy-500 mb-3">
        <span className="flex items-center gap-1">
          <Hash className="w-3.5 h-3.5" />
          {report.report_number}
        </span>
        <span className="bg-navy-50 px-2 py-0.5 rounded-full text-xs font-medium">{CATEGORY_LABELS[report.category]}</span>
      </div>
      <div className="flex items-center gap-1 text-sm text-navy-400 mb-3">
        <MapPin className="w-3.5 h-3.5 shrink-0" />
        <span className="truncate">{report.neighborhood}</span>
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-navy-50">
        <SeverityBadge severity={report.severity} />
        <span className="flex items-center gap-1 text-xs text-navy-400">
          <Calendar className="w-3 h-3" />
          {new Date(report.created_at).toLocaleDateString()}
        </span>
      </div>
    </Link>
  );
}
