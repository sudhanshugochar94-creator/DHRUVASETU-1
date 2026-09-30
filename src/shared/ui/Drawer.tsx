import React, { useEffect, ReactNode } from 'react';
import { X } from 'lucide-react';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  position?: 'left' | 'right';
  width?: 'sm' | 'md' | 'lg';
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  position = 'right',
  width = 'md'
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const widthClasses = {
    sm: 'max-w-xs',
    md: 'max-w-md',
    lg: 'max-w-xl'
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/45 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className={`fixed inset-y-0 ${position === 'right' ? 'right-0' : 'left-0'} flex max-w-full`}>
        <div className={`w-screen ${widthClasses[width]} bg-[#f4f9fc] border-${position === 'right' ? 'l' : 'r'} border-sky-900/15 shadow-2xl flex flex-col p-6`}>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-sky-900/15 shrink-0">
            {title && <h3 className="text-lg font-bold text-slate-900 font-['Bricolage_Grotesque',sans-serif]">{title}</h3>}
            <button
              onClick={onClose}
              className="text-slate-600 hover:text-slate-900 p-1 rounded-lg hover:bg-sky-50/70 transition-colors"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="mt-4 flex-1 overflow-y-auto">{children}</div>
        </div>
      </div>
    </div>
  );
};
