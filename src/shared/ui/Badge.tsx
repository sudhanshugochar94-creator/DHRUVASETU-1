import React, { type ReactNode } from 'react';
import type { PolarRegion, ResourceType } from '@/shared/types/index';

export interface BadgeProps {
  children?: ReactNode;
  region?: PolarRegion;
  type?: ResourceType;
  status?: string;
  variant?: 'cyan' | 'blue' | 'purple' | 'emerald' | 'amber' | 'rose' | 'slate';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  region,
  type,
  status,
  variant,
  size = 'md',
  className = ''
}) => {
  let finalVariant = variant || 'cyan';
  let label = children;

  // Region specific styling
  if (region) {
    label = region;
    switch (region) {
      case 'Antarctica':
        finalVariant = 'cyan';
        break;
      case 'Arctic':
        finalVariant = 'blue';
        break;
      case 'Southern Ocean':
        finalVariant = 'purple';
        break;
      case 'Himalaya':
        finalVariant = 'emerald';
        break;
    }
  }

  // Type specific styling
  if (type) {
    label = type;
    switch (type) {
      case 'Expedition Reports':
        finalVariant = 'blue';
        break;
      case 'Scientific Datasets':
        finalVariant = 'emerald';
        break;
      case 'Publications':
        finalVariant = 'purple';
        break;
      case 'Photographs':
      case 'Videos':
        finalVariant = 'amber';
        break;
      case 'Educational Resources':
        finalVariant = 'cyan';
        break;
      default:
        finalVariant = 'slate';
    }
  }

  // Status specific styling
  if (status) {
    label = status;
    switch (status) {
      case 'Published':
      case 'Completed':
      case 'Approved':
      case 'Active':
        finalVariant = 'emerald';
        break;
      case 'Under Review':
      case 'Ongoing':
        finalVariant = 'amber';
        break;
      case 'Draft':
        finalVariant = 'slate';
        break;
      case 'Archived':
      case 'Decommissioned':
        finalVariant = 'purple';
        break;
    }
  }

  const variantStyles = {
    cyan: 'bg-cyan-500/10 text-sky-700 border-cyan-500/30',
    blue: 'bg-blue-500/10 text-blue-700 border-blue-500/30',
    purple: 'bg-purple-500/10 text-purple-700 border-purple-500/30',
    emerald: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30',
    amber: 'bg-amber-500/10 text-amber-700 border-amber-500/30',
    rose: 'bg-rose-500/10 text-rose-700 border-rose-500/30',
    slate: 'bg-sky-50/80 text-slate-700 border-sky-200'
  };

  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5 font-medium tracking-wide',
    md: 'text-xs px-2.5 py-1 font-medium'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border transition-colors ${variantStyles[finalVariant]} ${sizeStyles[size]} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {label}
    </span>
  );
};
