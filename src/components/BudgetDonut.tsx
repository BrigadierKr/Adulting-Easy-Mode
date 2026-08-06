import React, { useState } from 'react';
import { BudgetData } from '../types';
import { useApp } from '../context/AppContext';
import { PieChart } from 'lucide-react';

interface BudgetDonutProps {
  budget: BudgetData;
}

export const BudgetDonut: React.FC<BudgetDonutProps> = ({ budget }) => {
  const { content } = useApp();
  const [selectedKey, setSelectedKey] = useState<keyof BudgetData>('food');

  const categories: { key: keyof BudgetData; color: string }[] = [
    { key: 'housing', color: '#FF5252' },
    { key: 'utilities', color: '#FF9100' },
    { key: 'food', color: '#FFD600' },
    { key: 'transport', color: '#B2FF59' },
    { key: 'phone', color: '#00E5FF' },
    { key: 'joy', color: '#D500F9' },
    { key: 'reserve', color: '#9E9E9E' },
  ];

  const total = categories.reduce((sum, item) => sum + Number(budget[item.key] || 0), 0);

  const r = 60;
  const strokeWidth = 26;
  const C = 2 * Math.PI * r;

  let accumulatedOffset = 0;

  const activeCategory = categories.find((c) => c.key === selectedKey) || categories[0];
  const activeAmount = Number(budget[activeCategory.key] || 0);
  const activePercent = total > 0 ? Math.round((activeAmount / total) * 100) : 0;
  const activeLabel =
    content.utilities.budgetLabels?.[
      activeCategory.key as keyof typeof content.utilities.budgetLabels
    ] || activeCategory.key;

  return (
    <div className="p-5 bg-white dark:bg-slate-800 border-3 border-black dark:border-slate-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-6 text-black dark:text-white">
      <div className="flex items-center gap-2 mb-4">
        <PieChart className="w-5 h-5 stroke-[2.5]" />
        <h3 className="text-base font-black uppercase">
          {content.utilities.chartTitle || 'Витрати за місяць'} (Donut)
        </h3>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-around gap-6">
        {/* SVG Donut */}
        <div className="relative w-52 h-52 shrink-0 flex items-center justify-center">
          <svg viewBox="0 0 180 180" className="w-full h-full transform -rotate-90">
            {categories.map((item) => {
              const val = Number(budget[item.key] || 0);
              const frac = total > 0 ? val / total : 0;
              const strokeDasharray = `${frac * C} ${C}`;
              const strokeDashoffset = -accumulatedOffset;
              accumulatedOffset += frac * C;

              const isSelected = selectedKey === item.key;

              return (
                <circle
                  key={item.key}
                  cx="90"
                  cy="90"
                  r={r}
                  fill="transparent"
                  stroke={item.color}
                  strokeWidth={isSelected ? strokeWidth + 6 : strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  onClick={() => setSelectedKey(item.key)}
                  className="cursor-pointer transition-all duration-200 stroke-black/20"
                />
              );
            })}
          </svg>

          {/* Center Info Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2 pointer-events-none">
            <span className="text-[10px] font-black uppercase text-black/70 dark:text-slate-300">
              {activeLabel}
            </span>
            <span className="text-base font-black text-black dark:text-white leading-tight">
              {activeAmount} грн
            </span>
            <span className="mt-1 text-[11px] font-black px-2 py-0.5 bg-[#FFD600] text-black border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
              {activePercent}%
            </span>
          </div>
        </div>

        {/* Legend List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
          {categories.map((item) => {
            const val = Number(budget[item.key] || 0);
            const frac = total > 0 ? Math.round((val / total) * 100) : 0;
            const label =
              content.utilities.budgetLabels?.[
                item.key as keyof typeof content.utilities.budgetLabels
              ] || item.key;
            const isSelected = selectedKey === item.key;

            return (
              <button
                key={item.key}
                onClick={() => setSelectedKey(item.key)}
                className={`p-2 border-2 border-black flex items-center justify-between text-left transition-all active:translate-x-[1px] active:translate-y-[1px] ${
                  isSelected
                    ? 'bg-black text-white dark:bg-yellow-400 dark:text-black font-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                    : 'bg-[#F7F7F2] dark:bg-slate-700 text-black dark:text-white font-bold hover:bg-yellow-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-3.5 h-3.5 border border-black shrink-0"
                    style={{ backgroundColor: item.color }}
                  ></span>
                  <span className="text-xs font-black uppercase">{label}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-extrabold block">{val} грн</span>
                  <span className="text-[10px] opacity-80">{frac}%</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
