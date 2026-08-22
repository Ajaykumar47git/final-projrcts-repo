import type { ReactNode } from 'react';

interface SummaryCardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
  color?: string;
  subtitle?: string;
  gradient?: string;
}

export function SummaryCard({ title, value, icon, color = 'bg-teal-50 text-teal-600', subtitle, gradient }: SummaryCardProps) {
  return (
    <div className="card-tilt group">
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300 ${gradient || color}`}>
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-sm text-navy-500 font-medium">{title}</p>
          <p className="text-2xl font-bold text-navy-900 mt-0.5">{value}</p>
          {subtitle && <p className="text-xs text-navy-400 mt-1">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}
