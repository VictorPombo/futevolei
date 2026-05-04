import { ReactNode } from 'react';

interface KpiCardProps {
  title: string;
  value: string | number;
  trend?: string;
  trendColor?: 'success' | 'danger' | 'warning' | 'info' | 'primary' | 'muted';
  borderColor?: string;
  isDataFont?: boolean;
}

export function KpiCard({ title, value, trend, trendColor = 'muted', borderColor, isDataFont = true }: KpiCardProps) {
  const colorClassMap = {
    success: 'text-[var(--admin-success)]',
    danger: 'text-[var(--admin-danger)]',
    warning: 'text-[var(--admin-warning)]',
    info: 'text-[var(--admin-info)]',
    primary: 'text-[var(--admin-primary)]',
    muted: 'text-[var(--admin-text2)]'
  };

  return (
    <div 
      className="bg-[rgba(17,17,32,0.6)] backdrop-blur-md border border-[var(--admin-border)] rounded-2xl p-6 shadow-lg transition-all duration-300 hover:bg-[rgba(22,22,42,0.6)] hover:border-[var(--admin-border2)] flex flex-col"
      style={borderColor ? { borderColor } : {}}
    >
      <div className="text-sm font-medium text-[var(--admin-text2)] mb-2">{title}</div>
      <div className={`text-3xl font-bold text-[var(--admin-text)] ${isDataFont ? 'font-dm-mono' : ''}`}>
        {value}
      </div>
      {trend && (
        <div className={`text-sm mt-1 font-medium ${colorClassMap[trendColor]}`}>
          {trend}
        </div>
      )}
    </div>
  );
}
