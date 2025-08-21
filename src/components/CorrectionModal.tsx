import React, { useState, useEffect } from 'react';
import type { StudentAnswer } from '../types';

interface CorrectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newUnmarkedOptions: string) => void;
  answer: StudentAnswer;
}

const CorrectionModal: React.FC<CorrectionModalProps> = ({ isOpen, onClose, onSubmit, answer }) => {
  const [currentValue, setCurrentValue] = useState(answer.unmarkedOptions);

  useEffect(() => {
    if (isOpen) {
        setCurrentValue(answer.unmarkedOptions);
    }
  }, [isOpen, answer]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedValue = currentValue
        .toUpperCase()
        .split(/[\s,]+/)
        .filter(c => c.length > 0 && ['A','B','C','D'].includes(c))
        .sort()
        .join(' ');
    onSubmit(normalizedValue);
  };

  return (
    <div 
      className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex justify-center items-center p-4 transition-all duration-300 animate-fade-in-up" 
      aria-modal="true"
      role="dialog"
      onClick={onClose}
    >
      <div 
        className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-elegant border border-white/20 p-8 w-full max-w-lg transform transition-all duration-300 hover:shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Edit Answer</h2>
                <p className="text-sm text-slate-600">Question {answer.questionNumber}</p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="w-8 h-8 bg-slate-100 hover:bg-red-100 text-slate-400 hover:text-red-500 rounded-full flex items-center justify-center transition-all duration-200 focus-ring"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span className="sr-only">Close</span>
            </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="unmarked-options-input" className="block text-sm font-bold text-slate-700 mb-2">
              Unmarked Options
            </label>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-xs text-blue-700">
                  <p className="font-medium mb-1">How to format your input:</p>
                  <ul className="space-y-1">
                    <li>• Enter options that were <strong>NOT marked</strong> by the student</li>
                    <li>• Separate multiple options with spaces (e.g., "A C D")</li>
                    <li>• Leave empty if all options were marked</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <input
                id="unmarked-options-input"
                type="text"
                value={currentValue}
                onChange={(e) => setCurrentValue(e.target.value)}
                className="w-full p-4 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 font-mono text-lg bg-white/80 backdrop-blur-sm placeholder-slate-400"
                placeholder="e.g., A C D or leave empty"
                autoFocus
                onKeyDown={(e) => e.key === 'Escape' && onClose()}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="flex gap-1">
                  {['A', 'B', 'C', 'D'].map((option) => (
                    <span
                      key={option}
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                        currentValue.includes(option)
                          ? 'bg-red-100 border-red-300 text-red-600'
                          : 'bg-green-100 border-green-300 text-green-600'
                      }`}
                    >
                      {option}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">Current input shows: Red = Unmarked, Green = Marked</p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-6 py-3 bg-white border-2 border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 focus-ring"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-6 py-3 bg-gradient-primary text-white font-semibold rounded-xl hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 focus-ring"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CorrectionModal;