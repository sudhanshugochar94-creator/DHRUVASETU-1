import React, { ReactNode } from 'react';
import { SearchX } from 'lucide-react';
import { Button } from '@/shared/ui/Button';

export interface EmptyStateProps {
  title: string;
  description: string;
  icon?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  actionLabel,
  onAction,
  className = ''
}) => {
  return (
    <div
      className={`polar-glass-card rounded-2xl p-10 text-center flex flex-col items-center justify-center max-w-md mx-auto my-12 ${className}`}
    >
      <div className="p-4 rounded-2xl bg-cyan-500/10 text-sky-700 border border-cyan-500/20 mb-4 animate-bounce-gentle">
        {icon || <SearchX className="w-8 h-8" />}
      </div>
      <h3 className="text-lg font-bold text-slate-900 font-['Bricolage_Grotesque',sans-serif]">{title}</h3>
      <p className="text-sm text-slate-600 mt-2 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <div className="mt-6">
          <Button variant="outline" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
};
