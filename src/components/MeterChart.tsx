import React from 'react';
import { MeterEntry } from '../types';
import { useApp } from '../context/AppContext';
import { BarChart3, Info } from 'lucide-react';

interface MeterChartProps {
  entries: MeterEntry[];
}

export const MeterChart: React.FC<MeterChartProps> = ({ entries }) => {
  const { content, language } = useApp();

  // Sort entries ascending by date
  const sorted = [...entries].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Compute differences between consecutive entries
  const diffs = [];
  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1];
    const curr = sorted[i];
    const diffElec = Math.max(0, curr.electricity - prev.electricity);
    const diffWater = Math.max(0, curr.coldWater - prev.coldWater);
    const month = curr.date.slice(5, 7);
    const year = curr.date.slice(2, 4);
    diffs.push({
      dateLabel: `${month}/${year}`,
      note: curr.note,
      diffElec,
      diffWater,
    });
  }

  const emptyText =
    language === 'ua'
      ? 'Додай ще місяць — і побачиш свої витрати як на долоні.'
      : language === 'en'
      ? 'Add another month to see your consumption trends clearly.'
      : 'Добавь ещё месяц — и увидишь свои расходы как на ладони.';

  if (diffs.length === 0) {
    return (
      <div className="p-5 bg-white dark:bg-slate-800 border-3 border-black dark:border-slate-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-6">
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 className="w-5 h-5 text-black dark:text-white stroke-[2.5]" />
          <h3 className="text-base font-black uppercase text-black dark:text-white">
            {content.utilities.chartTitle}
          </h3>
        </div>
        <div className="p-4 bg-[#FFD600] border-2 border-black text-black text-xs font-bold flex items-center gap-2.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <Info className="w-5 h-5 shrink-0 stroke-[3]" />
          <span>{emptyText}</span>
        </div>
      </div>
    );
  }

  const maxElec = Math.max(...diffs.map((d) => d.diffElec), 1);
  const maxWater = Math.max(...diffs.map((d) => d.diffWater), 1);

  const svgWidth = 500;
  const svgHeight = 220;
  const chartHeight = 120;
  const startX = 40;
  const startY = 170;
  const groupWidth = (svgWidth - startX - 20) / diffs.length;
  const barWidth = Math.min(28, (groupWidth - 16) / 2);

  return (
    <div className="p-5 bg-white dark:bg-slate-800 border-3 border-black dark:border-slate-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-6 text-black dark:text-white">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 stroke-[2.5]" />
          <h3 className="text-base font-black uppercase">
            {content.utilities.chartTitle}
          </h3>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-black uppercase">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 bg-[#FFD600] border border-black inline-block"></span>
            <span className="text-[11px]">{content.utilities.chartElectricity}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 bg-[#00E5FF] border border-black inline-block"></span>
            <span className="text-[11px]">{content.utilities.chartWater}</span>
          </div>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto min-w-[320px]">
          {/* Baseline */}
          <line
            x1={startX - 10}
            y1={startY}
            x2={svgWidth - 10}
            y2={startY}
            stroke="currentColor"
            strokeWidth="3"
          />

          {diffs.map((d, idx) => {
            const groupX = startX + idx * groupWidth + groupWidth / 2;

            const elecH = Math.max(8, (d.diffElec / maxElec) * chartHeight);
            const elecY = startY - elecH;

            const waterH = Math.max(8, (d.diffWater / maxWater) * chartHeight);
            const waterY = startY - waterH;

            const elecX = groupX - barWidth - 2;
            const waterX = groupX + 2;

            return (
              <g key={idx}>
                {/* Electricity Bar */}
                <rect
                  x={elecX}
                  y={elecY}
                  width={barWidth}
                  height={elecH}
                  fill="#FFD600"
                  stroke="#000000"
                  strokeWidth="2"
                  rx="1"
                />
                <text
                  x={elecX + barWidth / 2}
                  y={elecY - 5}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="900"
                  fill="currentColor"
                >
                  {d.diffElec}
                </text>

                {/* Cold Water Bar */}
                <rect
                  x={waterX}
                  y={waterY}
                  width={barWidth}
                  height={waterH}
                  fill="#00E5FF"
                  stroke="#000000"
                  strokeWidth="2"
                  rx="1"
                />
                <text
                  x={waterX + barWidth / 2}
                  y={waterY - 5}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="900"
                  fill="currentColor"
                >
                  {d.diffWater}
                </text>

                {/* Month Label */}
                <text
                  x={groupX}
                  y={startY + 20}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="900"
                  fill="currentColor"
                >
                  {d.dateLabel}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
