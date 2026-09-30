import React, { useCallback, useEffect, useState } from 'react';
import { Bot, Play, Send } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { useToast } from '@/shared/context/ToastContext';
import { agentService, type AgentRun } from '../services/agentService';

const STAGES = ['ingest', 'extract', 'knowledge', 'plan', 'awaiting_review'];

export const AgentHub: React.FC = () => {
  const { showToast } = useToast();
  const [runs, setRuns] = useState<AgentRun[]>([]);
  const [starting, setStarting] = useState(false);
  const [history, setHistory] = useState<[string, string][]>([]);
  const [question, setQuestion] = useState('');
  const [asking, setAsking] = useState(false);

  const refresh = useCallback(async () => {
    try { setRuns(await agentService.listRuns()); } catch { /* not signed in as staff */ }
  }, []);

  useEffect(() => {
    refresh();
    const t = setInterval(refresh, 4000);
    return () => clearInterval(t);
  }, [refresh]);

  const start = async () => {
    setStarting(true);
    try {
      await agentService.startRun();
      showToast('Agent pipeline started', 'success');
      refresh();
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Could not start the pipeline', 'error');
    } finally { setStarting(false); }
  };

  const ask = async () => {
    const q = question.trim();
    if (!q) return;
    setAsking(true);
    setQuestion('');
    try {
      const { answer } = await agentService.chat(q, history);
      setHistory((h) => [...h, [q, answer]]);
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Chat failed', 'error');
    } finally { setAsking(false); }
  };

  return (
    <div className="space-y-10">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 uppercase tracking-widest">
          <Bot className="w-4 h-4" /><span>Multi-Agent Pipeline</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">AI Agents</h1>
        <p className="text-sm sm:text-base text-slate-700 max-w-3xl">
          Ingest new repository resources, build the knowledge graph, and draft validated outreach content.
          Drafts land in the Review queue for human approval before anything is published.
        </p>
      </div>

      <section className="space-y-4">
        <Button icon={<Play className="w-4 h-4" />} isLoading={starting} onClick={start}>Run pipeline</Button>
        <ul className="space-y-2">
          {runs.map((r) => (
            <li key={r.id} className="p-3 rounded-xl bg-white/80 border border-sky-900/10 text-xs text-slate-800">
              <div className="flex justify-between font-semibold">
                <span>{new Date(r.created_at).toLocaleString()}</span>
                <span>{r.status}{r.stage ? ` · ${r.stage}` : ''}</span>
              </div>
              {r.status === 'running' && (
                <div className="mt-2 h-1.5 rounded bg-sky-100">
                  <div className="h-1.5 rounded bg-sky-600 transition-all"
                       style={{ width: `${((STAGES.indexOf(r.stage || '') + 1) / STAGES.length) * 100}%` }} />
                </div>
              )}
              {r.error && <p className="mt-1 text-red-700">{r.error}</p>}
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Ask the knowledge base</h2>
        <div className="space-y-3">
          {history.map(([q, a], i) => (
            <div key={i} className="space-y-1 text-sm">
              <p className="font-semibold text-slate-900">{q}</p>
              <p className="p-3 rounded-xl bg-sky-50 border border-sky-900/10 whitespace-pre-wrap text-slate-800">{a}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !asking && ask()}
            placeholder="e.g. What did the 43rd expedition find about sea ice?"
            className="flex-1 px-3 py-2 rounded-xl border border-sky-900/20 text-sm bg-white"
          />
          <Button icon={<Send className="w-4 h-4" />} isLoading={asking} onClick={ask}>Ask</Button>
        </div>
      </section>
    </div>
  );
};
