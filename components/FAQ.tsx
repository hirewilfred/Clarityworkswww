
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  items: FAQItem[];
  darkMode?: boolean;
}

const FAQ: React.FC<FAQProps> = ({ items, darkMode = false }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-4">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={i}
            className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
              darkMode
                ? `glass-panel border-white/10 ${isOpen ? 'border-white/20' : ''}`
                : `bg-white border-slate-200 ${isOpen ? 'shadow-lg border-slate-300' : 'hover:border-slate-300'}`
            }`}
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className={`w-full flex items-center justify-between px-8 py-6 text-left transition-colors ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}
            >
              <span className="font-black text-base pr-4">{item.question}</span>
              <ChevronDown
                className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${
                  isOpen ? 'rotate-180' : ''
                } ${darkMode ? 'text-clarity-blue' : 'text-slate-400'}`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className={`px-8 pb-6 text-sm font-medium leading-relaxed ${
                darkMode ? 'text-slate-400' : 'text-slate-600'
              }`}>
                {item.answer}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FAQ;
