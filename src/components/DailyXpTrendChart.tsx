import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { TrendingUp, Sparkles, Zap, BarChart2, Activity } from 'lucide-react';
import { getLocalDateString } from '../lib/gamification';

interface DailyXpTrendChartProps {
  dailyXpHistory?: Record<string, number>;
  totalXp: number;
}

export const DailyXpTrendChart: React.FC<DailyXpTrendChartProps> = React.memo(({
  dailyXpHistory = {},
  totalXp,
}) => {
  const [chartType, setChartType] = useState<'area' | 'bar'>('area');

  // Memoized 7-day calculations to avoid lag on re-render
  const { daysData, sum7Days, avgDailyXp, maxXpDay } = useMemo(() => {
    const today = new Date();
    const result = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = getLocalDateString(d);

      const dayNameOptions: Intl.DateTimeFormatOptions = { weekday: 'short' };
      const dateNumOptions: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };

      const dayName = d.toLocaleDateString('id-ID', dayNameOptions);
      const dateShort = d.toLocaleDateString('id-ID', dateNumOptions);
      const isToday = i === 0;

      let xpGained = dailyXpHistory[dateStr] || 0;

      if (Object.keys(dailyXpHistory).length === 0 && totalXp > 0) {
        if (i === 0) {
          xpGained = Math.min(totalXp, 120);
        } else if (i === 1 && totalXp >= 200) {
          xpGained = 100;
        } else if (i === 2 && totalXp >= 300) {
          xpGained = 80;
        }
      }

      result.push({
        dateStr,
        label: isToday ? 'Hari Ini' : dayName,
        fullLabel: `${dayName}, ${dateShort}`,
        xp: xpGained,
      });
    }

    const sum = result.reduce((acc, curr) => acc + curr.xp, 0);
    const avg = Math.round(sum / 7);
    const max = Math.max(...result.map((d) => d.xp), 0);

    return { daysData: result, sum7Days: sum, avgDailyXp: avg, maxXpDay: max };
  }, [dailyXpHistory, totalXp]);

  return (
    <div className="bg-white border-slate-200 text-slate-900 dark:bg-[#0d1322] dark:border-slate-800 dark:text-white border rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800/80 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 border border-indigo-500/30 text-indigo-600 dark:text-indigo-400">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              Tren Perolehan XP (7 Hari Terakhir)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Pantau konsistensi aktivitas dan lonjakan pengalaman belajar harian Anda.
            </p>
          </div>
        </div>

        {/* Toggle Area vs Bar Chart */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setChartType('area')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              chartType === 'area'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Kurva</span>
          </button>
          <button
            onClick={() => setChartType('bar')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              chartType === 'bar'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Batang</span>
          </button>
        </div>
      </div>

      {/* Quick Summary Chips */}
      <div className="grid grid-cols-3 gap-3 text-xs">
        <div className="p-3 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-0.5">
          <span className="text-slate-600 dark:text-slate-400 font-semibold text-[11px] flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-500" /> Total 7 Hari
          </span>
          <div className="text-base font-black text-amber-600 dark:text-amber-400">+{sum7Days} XP</div>
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-0.5">
          <span className="text-slate-600 dark:text-slate-400 font-semibold text-[11px] flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-indigo-500" /> Rata-Rata/Hari
          </span>
          <div className="text-base font-black text-indigo-600 dark:text-indigo-300">+{avgDailyXp} XP</div>
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-0.5">
          <span className="text-slate-600 dark:text-slate-400 font-semibold text-[11px] flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" /> Peak Harian
          </span>
          <div className="text-base font-black text-emerald-600 dark:text-emerald-400">+{maxXpDay} XP</div>
        </div>
      </div>

      {/* Recharts Chart Canvas */}
      <div className="w-full h-52 sm:h-60 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'area' ? (
            <AreaChart data={daysData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="xpGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
              <XAxis dataKey="label" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 p-3 rounded-xl shadow-xl text-xs space-y-1">
                        <div className="font-bold text-slate-600 dark:text-slate-300">{data.fullLabel}</div>
                        <div className="text-amber-400 font-extrabold flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5" /> +{data.xp} XP Diperoleh
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="xp"
                stroke="#818cf8"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#xpGradient)"
              />
            </AreaChart>
          ) : (
            <BarChart data={daysData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
              <XAxis dataKey="label" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 p-3 rounded-xl shadow-xl text-xs space-y-1">
                        <div className="font-bold text-slate-600 dark:text-slate-300">{data.fullLabel}</div>
                        <div className="text-amber-400 font-extrabold flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5" /> +{data.xp} XP Diperoleh
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="xp" fill="#6366f1" radius={[8, 8, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
});
