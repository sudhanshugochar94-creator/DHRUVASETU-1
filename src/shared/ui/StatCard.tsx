import React, { ReactNode } from 'react';

export interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: ReactNode;
  trend?: string;
  trendPositive?: boolean;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subtext,
  icon,
  trend,
  trendPositive = true,
  className = ''
}) => {
  return (
    <div
      className={`polar-glass-card p-5 rounded-2xl relative overflow-hidden group ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-slate-600">
            {label}
          </span>
          <div className="text-3xl font-extrabold text-slate-900 mt-1 font-['Bricolage_Grotesque',sans-serif] tracking-tight group-hover:text-sky-700 transition-colors">
            {value}
          </div>
        </div>
        {icon && (
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-sky-700 border border-cyan-500/20 group-hover:scale-110 transition-transform">
            {icon}
          </div>
        )}
      </div>

      {(subtext || trend) && (
        <div className="mt-3 pt-3 border-t border-sky-900/10 flex items-center justify-between text-xs text-slate-600">
          {subtext && <span>{subtext}</span>}
          {trend && (
            <span className={`font-semibold ${trendPositive ? 'text-emerald-700' : 'text-rose-700'}`}>
              {trend}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
