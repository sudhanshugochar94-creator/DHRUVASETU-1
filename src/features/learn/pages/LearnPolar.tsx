import React, { useState } from 'react';
import { 
  GraduationCap, 
  Clock, 
  HelpCircle,
  RotateCcw
} from 'lucide-react';
import { mockLearnModules } from '../data/mockLearnModules';
import type { LearnModule } from '@/shared/types/index';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { Modal } from '@/shared/ui/Modal';
import { useToast } from '@/shared/context/ToastContext';

export const LearnPolar: React.FC = () => {
  const [selectedLevel, setSelectedLevel] = useState<'All' | 'Beginner' | 'Intermediate' | 'Advanced'>('All');
  const [activeModule, setActiveModule] = useState<LearnModule | null>(null);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const { showToast } = useToast();

  const filteredModules = selectedLevel === 'All'
    ? mockLearnModules
    : mockLearnModules.filter((m) => m.level === selectedLevel);

  const handleOpenQuiz = (module: LearnModule) => {
    setActiveModule(module);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setIsQuizOpen(true);
  };

  const handleSelectOption = (questionIndex: number, optionIndex: number) => {
    if (quizSubmitted) return;
    setQuizAnswers((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const handleSubmitQuiz = () => {
    if (!activeModule) return;
    setQuizSubmitted(true);

    let score = 0;
    activeModule.quiz.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correctIndex) score++;
    });

    showToast(`Quiz completed! You scored ${score} out of ${activeModule.quiz.length}`, 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 uppercase tracking-widest">
          <GraduationCap className="w-4 h-4" />
          <span>Smart Education Layer</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-['Bricolage_Grotesque',sans-serif] tracking-tight">
          Learn Polar Science
        </h1>
        <p className="text-sm sm:text-base text-slate-700 max-w-3xl leading-relaxed">
          Structured learning curricula designed to take learners from foundational cryospheric concepts to advanced polar dynamics, teleconnections with India's Monsoon, and Antarctic ice sheet stability.
        </p>
      </div>

      {/* Difficulty Level Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-white border border-sky-900/15 w-fit">
        {(['All', 'Beginner', 'Intermediate', 'Advanced'] as const).map((lvl) => (
          <button
            key={lvl}
            onClick={() => setSelectedLevel(lvl)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              selectedLevel === lvl
                ? 'bg-sky-600 text-white font-bold shadow-md shadow-cyan-500/20'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {lvl} Tracks
          </button>
        ))}
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredModules.map((mod) => (
          <div
            key={mod.id}
            className="polar-glass-card rounded-2xl p-6 flex flex-col justify-between group hover:border-cyan-500/40 transition-all duration-300"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge region={mod.region} size="sm" />
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  mod.level === 'Beginner'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-500/30'
                    : mod.level === 'Intermediate'
                    ? 'bg-blue-50 text-blue-700 border border-blue-500/30'
                    : 'bg-purple-50 text-purple-700 border border-purple-500/30'
                }`}>
                  {mod.level}
                </span>
              </div>

              <h3 className="text-xl font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                {mod.title}
              </h3>

              <p className="text-xs text-slate-700 leading-relaxed">
                {mod.description}
              </p>

              {/* Lesson breakdown preview */}
              <div className="space-y-1.5 pt-2">
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                  Syllabus Lessons ({mod.lessons.length}):
                </span>
                {mod.lessons.map((les, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs text-slate-600 py-1 border-b border-sky-900/10">
                    <span className="truncate max-w-[280px] text-slate-700">&bull; {les.title}</span>
                    <span className="font-mono text-[10px] shrink-0 text-slate-600">{les.duration}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions: Start Quiz / Learn */}
            <div className="pt-6 border-t border-sky-900/10 flex items-center justify-between gap-3">
              <span className="text-xs text-slate-600 font-mono flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-sky-700" />
                {mod.estimatedTime}
              </span>

              <Button
                size="sm"
                variant="primary"
                icon={<HelpCircle className="w-4 h-4" />}
                onClick={() => handleOpenQuiz(mod)}
              >
                Take Module Quiz ({mod.quiz.length} Qs)
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Quiz Modal */}
      {activeModule && (
        <Modal
          isOpen={isQuizOpen}
          onClose={() => setIsQuizOpen(false)}
          title={`Quiz: ${activeModule.title}`}
          subtitle={`Test your knowledge on ${activeModule.region} polar science (${activeModule.level})`}
          maxWidth="2xl"
        >
          <div className="space-y-6">
            {activeModule.quiz.map((q, qIdx) => {
              const selectedOption = quizAnswers[qIdx];
              const isCorrect = selectedOption === q.correctIndex;

              return (
                <div key={qIdx} className="p-4 rounded-xl bg-white/80 border border-sky-900/15 space-y-3">
                  <h4 className="text-sm font-bold text-slate-900 leading-relaxed">
                    {qIdx + 1}. {q.question}
                  </h4>

                  <div className="space-y-2">
                    {q.options.map((opt, optIdx) => {
                      const isThisSelected = selectedOption === optIdx;
                      let btnStyle = 'bg-sky-50 border-sky-900/10 text-slate-700 hover:bg-sky-50';

                      if (quizSubmitted) {
                        if (optIdx === q.correctIndex) {
                          btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold';
                        } else if (isThisSelected && !isCorrect) {
                          btnStyle = 'bg-rose-50 border-rose-500 text-rose-800';
                        }
                      } else if (isThisSelected) {
                        btnStyle = 'bg-cyan-500/20 border-sky-500 text-sky-800 font-semibold';
                      }

                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectOption(qIdx, optIdx)}
                          className={`w-full text-left p-2.5 rounded-lg border text-xs transition-colors flex items-start gap-2 cursor-pointer ${btnStyle}`}
                        >
                          <span className="font-mono text-slate-600 font-bold shrink-0">
                            {String.fromCharCode(65 + optIdx)}.
                          </span>
                          <span className="leading-relaxed">{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {quizSubmitted && (
                    <div className="p-2.5 rounded-lg bg-sky-50 border border-sky-900/15 text-xs leading-relaxed text-slate-700">
                      <strong className="text-sky-700">Scientific Rationale: </strong>
                      {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Quiz Action Buttons */}
            <div className="pt-3 border-t border-sky-900/15 flex items-center justify-between">
              <Button size="sm" variant="outline" onClick={() => setIsQuizOpen(false)}>
                Close
              </Button>

              {!quizSubmitted ? (
                <Button
                  size="sm"
                  variant="primary"
                  disabled={Object.keys(quizAnswers).length !== activeModule.quiz.length}
                  onClick={handleSubmitQuiz}
                >
                  Submit & Score Answers
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  icon={<RotateCcw className="w-3.5 h-3.5" />}
                  onClick={() => {
                    setQuizAnswers({});
                    setQuizSubmitted(false);
                  }}
                >
                  Retake Quiz
                </Button>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
