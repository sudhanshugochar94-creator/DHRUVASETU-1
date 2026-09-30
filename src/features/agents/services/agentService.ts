import { supabase } from '@/shared/lib/supabase';

const API = (import.meta.env.VITE_AGENT_API_URL || 'http://localhost:8000').replace(/\/$/, '');

export interface AgentRun {
  id: string;
  status: 'queued' | 'running' | 'done' | 'failed';
  stage?: string;
  detail?: Record<string, unknown>;
  error?: string;
  created_at: string;
}

async function authHeaders(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function call<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(await authHeaders()), ...(init.headers || {}) }
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || `Agent API error (${res.status})`);
  }
  return res.json();
}

export const agentService = {
  startRun: () => call<{ run_id: string }>('/run', { method: 'POST' }),
  listRuns: () => call<AgentRun[]>('/runs'),
  chat: (question: string, history: [string, string][]) =>
    call<{ answer: string }>('/chat', { method: 'POST', body: JSON.stringify({ question, history }) })
};
