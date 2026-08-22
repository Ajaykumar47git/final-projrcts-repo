import { Badge } from './Badge';
import { AlertTriangle, AlertCircle, Info, Siren } from 'lucide-react';
import type { ReportSeverity } from '../../types';
import { SEVERITY_LABELS } from '../../types';

const severityConfig: Record<ReportSeverity, { color: string; icon: React.ReactNode }> = {
  low: {
    color: 'bg-blue-100 text-blue-800',
    icon: <Info className="w-3 h-3" />,
  },
  medium: {
    color: 'bg-yellow-100 text-yellow-800',
    icon: <AlertCircle className="w-3 h-3" />,
  },
  high: {
    color: 'bg-orange-100 text-orange-800',
    icon: <AlertTriangle className="w-3 h-3" />,
  },
  emergency: {
    color: 'bg-red-100 text-red-800',
    icon: <Siren className="w-3 h-3" />,
  },
};

export function SeverityBadge({ severity }: { severity: ReportSeverity }) {
  const config = severityConfig[severity];
  return (
    <Badge className={config.color}>
      {config.icon}
      {SEVERITY_LABELS[severity]}
    </Badge>
  );
}
