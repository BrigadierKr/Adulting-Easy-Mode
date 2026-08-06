import React, { useState } from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const TipOfTheDay: React.FC = () => {
  const { content } = useApp();
  const [tipIndex, setTipIndex] = useState(0);

  const handleNextTip = () => {
    setTipIndex((prev) => (prev + 1) % content.tips.length);
  };

  return (
    <div className="bg-[#FFD600] border-4 border-black p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden transition-all text-black">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 bg-black text-white shrink-0 mt-0.5 border-2 border-black shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
            <Sparkles className="w-5 h-5 text-[#FFD600]" />
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-black flex items-center gap-1">
              <span>⚡</span> {content.tipTitle}
            </h4>
            <p className="text-sm font-bold text-black mt-1 leading-relaxed italic">
              «{content.tips[tipIndex]}»
            </p>
          </div>
        </div>
        <button
          onClick={handleNextTip}
          className="p-2 bg-white border-2 border-black text-black font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-black hover:text-white transition-all active:translate-x-[1px] active:translate-y-[1px] shrink-0"
          title="Наступна порада"
        >
          <RefreshCw className="w-4 h-4 stroke-[3]" />
        </button>
      </div>
    </div>
  );
};
