
import React from 'react';

interface AnswerKeyInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}

const AnswerKeyInput: React.FC<AnswerKeyInputProps> = ({ value, onChange, disabled }) => {
  return (
    <div>
      <label htmlFor="answer-key" className="block text-lg font-bold text-slate-700 mb-2">
        1. Enter Answer Key
      </label>
      <textarea
        id="answer-key"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder="Enter answers without numbers or spaces, e.g., ACBDDA..."
        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out disabled:bg-slate-100 disabled:cursor-not-allowed"
        rows={4}
      />
      <p className="text-sm text-slate-500 mt-1">
        Example: For 10 questions, you might enter <span className="font-mono">BDACACDDBA</span>.
      </p>
    </div>
  );
};

export default AnswerKeyInput;
