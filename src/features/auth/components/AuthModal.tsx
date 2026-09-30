// ====================================================================
// SIH26063: Authentication Modal
// National Centre for Polar and Ocean Research (NCPOR) • MoES
// ====================================================================

import React, { useState } from 'react';
import { Modal } from '@/shared/ui/Modal';
import { Button } from '@/shared/ui/Button';
import { authService } from '../services/authService';
import { isSupabaseConfigured } from '@/shared/lib/supabase';
import { useRole } from '../RoleContext';
import { useToast } from '@/shared/context/ToastContext';
import type { UserRole } from '@/shared/types/index';
import { Lock, Mail, User, ShieldCheck, Database } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('Researcher');
  const [isLoading, setIsLoading] = useState(false);

  const { setRole } = useRole();
  const { showToast } = useToast();
  const hasSupabase = isSupabaseConfigured();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please enter both email and password.', 'error');
      return;
    }

    setIsLoading(true);
    try {
      if (mode === 'signin') {
        const { user, error } = await authService.login(email, password);
        if (error) {
          showToast(error.message || 'Login failed. Please check credentials.', 'error');
        } else {
          showToast(`Welcome back, ${user?.email || 'Researcher'}!`, 'success');
          // Map user role if available, or update simulation
          setRole(selectedRole);
          onClose();
        }
      } else {
        const roleMapping: Record<UserRole, 'researcher' | 'content_manager' | 'administrator'> = {
          'Researcher': 'researcher',
          'Content Manager': 'content_manager',
          'Administrator': 'administrator',
          'Public Visitor': 'researcher'
        };

        const dbRole = roleMapping[selectedRole];
        const { error } = await authService.signup(email, password, fullName || 'Polar Researcher', dbRole);
        if (error) {
          showToast(error.message || 'Registration failed.', 'error');
        } else {
          showToast('Account created successfully! Logged in as ' + selectedRole, 'success');
          setRole(selectedRole);
          onClose();
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'signin' ? 'NCPOR Portal Sign In' : 'Register Research Profile'}
      subtitle="Authenticate with National Centre for Polar and Ocean Research access gateway"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        {/* Backend Connectivity Status Badge */}
        <div className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 ${
          hasSupabase 
            ? 'bg-emerald-50 border-emerald-500/30 text-emerald-700'
            : 'bg-indigo-50 border-indigo-500/30 text-indigo-700'
        }`}>
          <Database className="w-3.5 h-3.5 shrink-0" />
          <span>
            {hasSupabase 
              ? 'Connected to Live Supabase Authentication'
              : 'Local Sandbox Mode (Supabase URL pending in .env)'}
          </span>
        </div>

        {mode === 'signup' && (
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Full Name & Title
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g., Dr. Ananya Sen"
                className="w-full pl-9 pr-3 py-2 bg-white/90 border border-sky-900/15 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-sky-500 placeholder:text-slate-500"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Official Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g., researcher@ncpor.res.in"
              className="w-full pl-9 pr-3 py-2 bg-white/90 border border-sky-900/15 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-sky-500 placeholder:text-slate-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full pl-9 pr-3 py-2 bg-white/90 border border-sky-900/15 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-sky-500 placeholder:text-slate-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-700" />
            <span>Institutional Role</span>
          </label>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value as UserRole)}
            className="w-full px-3 py-2 bg-white/90 border border-sky-900/15 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-sky-500 cursor-pointer"
          >
            <option value="Researcher">Researcher (Data Ingest & Scientific Cataloging)</option>
            <option value="Content Manager">Content Manager (Outreach & Editorial Review)</option>
            <option value="Administrator">Administrator (Full Institutional Management)</option>
          </select>
        </div>

        <div className="pt-2 space-y-2">
          <Button
            variant="primary"
            className="w-full"
            isLoading={isLoading}
          >
            {mode === 'signin' ? 'Sign In to Portal' : 'Create Research Profile'}
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
              className="text-xs text-sky-700 hover:text-sky-700 hover:underline cursor-pointer"
            >
              {mode === 'signin' 
                ? 'Need an institutional account? Register profile'
                : 'Already have an account? Sign in here'}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
