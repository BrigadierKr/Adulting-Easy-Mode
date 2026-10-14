import React, { useState, useEffect } from 'react';
import { Gauge, Calculator, Bell, Copy, Check, Plus, Trash2, ShieldCheck, AlertCircle, Sparkles, Send, Flame, ChevronDown, ChevronUp, Video, AlertTriangle, Share2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { enableReminders, remindersEnabled, remindersSupported, maybeNotifyMeterReadings } from '../utils/reminders';
import { MeterChart } from './MeterChart';
import { BudgetDonut } from './BudgetDonut';

export const UtilitiesModule: React.FC = () => {
  const { content, language, meterEntries, addMeterEntry, deleteMeterEntry, budget, updateBudget, unlockAchievement, completedDropCards, toggleDropCardDone } = useApp();

  const [copied, setCopied] = useState(false);
  const [testSent, setTestSent] = useState(false);
  const [expandedHeatingCard, setExpandedHeatingCard] = useState<string | null>('h-01');
  const [copiedCardId, setCopiedCardId] = useState<string | null>(null);

  // Notification API support and permission state
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission | 'unsupported'>(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'unsupported';
    }
    return Notification.permission;
  });

  // Meter form state
  const [elec, setElec] = useState(1320);
  const [coldW, setColdW] = useState(95);
  const [hotW, setHotW] = useState(47);
  const [gasVal, setGasVal] = useState(118);
  const [noteVal, setNoteVal] = useState('');

  // Check monthly reminder schedule (1–5 of each month)
  const checkAndTriggerMonthlyReminder = (permissionStatus: string) => {
    if (permissionStatus !== 'granted') return;

    const now = new Date();
    const dayOfMonth = now.getDate();
    const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const lastNotifiedMonth = localStorage.getItem('last_meter_notification_month');

    // Trigger notification if today is between day 1 and 5 of the month and hasn't been triggered yet
    if (dayOfMonth >= 1 && dayOfMonth <= 5 && lastNotifiedMonth !== currentMonthKey) {
      try {
        new Notification('📊 Час передати показники лічильників!', {
          body: 'Настало 1–5 число місяця! Будь ласка, зніміть та передайте показники світла, води та газу.',
          tag: 'meter-monthly-reminder',
        });
        localStorage.setItem('last_meter_notification_month', currentMonthKey);
      } catch (err) {
        console.error('Failed to trigger notification:', err);
      }
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const currentPerm = Notification.permission;
      setNotificationPermission(currentPerm);
      if (currentPerm === 'granted') {
        checkAndTriggerMonthlyReminder(currentPerm);
      }
    } else {
      setNotificationPermission('unsupported');
    }
  }, []);

  const requestNotificationPermission = async () => {
    if (!remindersSupported()) {
      alert('Ваш браузер не підтримує Web Notification API.');
      setNotificationPermission('unsupported');
      return;
    }

    const enabled = await enableReminders();
    if (enabled) {
      setNotificationPermission('granted');
      unlockAchievement('ach-05');
      unlockAchievement('ach-5');

      try {
        new Notification('🔔 Нагадування про лічильники увімкнено!', {
          body: 'З 1 по 5 число кожного місяця ми нагадуватимемо про показники лічильників.',
          tag: 'meter-welcome',
        });
      } catch (e) {
        console.error(e);
      }

      maybeNotifyMeterReadings(content.utilities.reminderText);
    } else {
      if (Notification.permission === 'denied') {
        setNotificationPermission('denied');
        alert('Сповіщення заблоковано в налаштуваннях браузера. Щоб увімкнути, дозвольте сповіщення в налаштуваннях сайту.');
      } else {
        setNotificationPermission(Notification.permission);
      }
    }
  };

  const sendTestNotification = () => {
    if (notificationPermission !== 'granted') return;
    try {
      new Notification('⚡ Тестове сповіщення: Сам собі мама', {
        body: '1–5 число: час передати показники світла, води та газу! Все працює ідеально.',
        tag: 'meter-test',
      });
      setTestSent(true);
      setTimeout(() => setTestSent(false), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddMeter = (e: React.FormEvent) => {
    e.preventDefault();
    addMeterEntry({
      date: new Date().toISOString().split('T')[0],
      electricity: Number(elec),
      coldWater: Number(coldW),
      hotWater: Number(hotW),
      gas: Number(gasVal),
      note: noteVal || 'Щомісячний запис',
    });
    setNoteVal('');
  };

  const latestEntry = meterEntries[0];
  const previousEntry = meterEntries[1];

  const copyReadingsFormatted = () => {
    if (!latestEntry) return;
    const text = `📊 Показники лічильників (${latestEntry.date}):\n⚡ Світло: ${latestEntry.electricity} кВт·год\n💧 Холодна вода: ${latestEntry.coldWater} м³\n🔥 Гаряча вода: ${latestEntry.hotWater} м³\n⛽ Газ: ${latestEntry.gas} м³`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Budget calculations 60/25/15 rule
  const totalNeeds = Number(budget.housing) + Number(budget.utilities) + Number(budget.food) + Number(budget.transport) + Number(budget.phone);
  const totalWants = Number(budget.joy);
  const totalSavings = Number(budget.reserve);
  const totalExpenses = totalNeeds + totalWants + totalSavings;

  const targetNeeds = Math.round(budget.income * 0.6);
  const targetWants = Math.round(budget.income * 0.25);
  const targetSavings = Math.round(budget.income * 0.15);

  const needsPercent = Math.min(100, Math.round((totalNeeds / budget.income) * 100)) || 0;
  const wantsPercent = Math.min(100, Math.round((totalWants / budget.income) * 100)) || 0;
  const savingsPercent = Math.min(100, Math.round((totalSavings / budget.income) * 100)) || 0;

  return (
    <div className="space-y-6 text-black">
      {/* Heating Season Accordion [🍂 ОСІННІЙ ДРОП] */}
      <section className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-orange-500 text-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <Flame className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black uppercase tracking-tight text-black">
                  {content.heating.title}
                </h2>
              </div>
              <p className="text-xs font-bold italic text-black/80">
                {content.heating.subtitle}
              </p>
            </div>
          </div>
          <span className="px-3 py-1 bg-black text-[#FFD600] border-2 border-black text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            🍂 ОСІННІЙ ДРОП
          </span>
        </div>

        <div className="space-y-3">
          {content.heating.cards.map((card) => {
            const isOpen = expandedHeatingCard === card.id;
            const isDone = completedDropCards.includes(card.id.toLowerCase());
            return (
              <div
                key={card.id}
                className={`border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all ${
                  isDone ? 'bg-emerald-50/70 border-emerald-950' : 'bg-white'
                }`}
              >
                <button
                  onClick={() => setExpandedHeatingCard((prev) => (prev === card.id ? null : card.id))}
                  className="w-full p-4 flex items-center justify-between text-left gap-3 focus:outline-hidden hover:bg-orange-50/50 transition-colors"
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-orange-500 text-white border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                      {card.badge || card.id.toUpperCase()}
                    </span>
                    <h3 className="text-base font-black text-black uppercase">
                      {card.title}
                    </h3>
                    {isDone && (
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-[#B2FF59] text-black border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1">
                        <Check className="w-3 h-3 stroke-[3]" />
                        {language === 'ua' ? 'Зроблено' : language === 'en' ? 'Done' : 'Сделано'}
                      </span>
                    )}
                  </div>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-black stroke-[3]" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-black stroke-[3]" />
                  )}
                </button>

                {isOpen && (
                  <div className="p-4 pt-1 border-t-3 border-black bg-white space-y-3">
                    {/* Video Rule (Rule 4) */}
                    {card.videoSafe !== false ? (
                      <a
                        href={`https://www.youtube.com/results?search_query=${encodeURIComponent(card.query || card.title)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 px-4 bg-black text-[#FFD600] font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-[#FFD600] hover:text-black transition-all active:translate-x-[1px] active:translate-y-[1px] flex items-center justify-center gap-2 min-h-[44px] mt-2 mb-1"
                      >
                        <Video className="w-4 h-4 stroke-[2.5]" />
                        <span>{content.kitchen.watchVideo}</span>
                      </a>
                    ) : (
                      <div className="w-full py-2.5 px-3 bg-[#FF5252] text-white font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2 min-h-[44px] mt-2 mb-1">
                        <AlertTriangle className="w-4 h-4 stroke-[2.5] shrink-0" />
                        <span>
                          {language === 'ua'
                            ? '⚠️ Не знімати на відео — небезпечно'
                            : language === 'en'
                            ? '⚠️ Do not film on video — dangerous'
                            : '⚠️ Не снимать на видео — опасно'}
                        </span>
                      </div>
                    )}

                    <ol className="space-y-2 text-xs font-bold text-black">
                      {card.steps.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 p-2 bg-[#F7F7F2] border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                          <span className="w-5 h-5 bg-black text-white text-[10px] font-black flex items-center justify-center shrink-0 border border-black">
                            {idx + 1}
                          </span>
                          <span className="font-extrabold">{step}</span>
                        </li>
                      ))}
                    </ol>

                    {card.humor && (
                      <p className="text-xs font-bold italic text-black bg-[#FFE082] p-2.5 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        💬 «{card.humor}»
                      </p>
                    )}

                    {/* Action buttons: "✓ Зроблено" and Share */}
                    <div className="pt-2 flex items-center justify-between flex-wrap gap-2">
                      <button
                        onClick={() => toggleDropCardDone(card.id)}
                        className={`px-3.5 py-2 border-2 border-black text-xs font-black uppercase flex items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-x-[1px] active:translate-y-[1px] ${
                          isDone
                            ? 'bg-[#B2FF59] text-black hover:bg-lime-400'
                            : 'bg-white text-black hover:bg-yellow-200'
                        }`}
                      >
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>
                          {isDone
                            ? (language === 'ua' ? '✓ Зроблено' : language === 'en' ? '✓ Done' : '✓ Сделано')
                            : (language === 'ua' ? 'Позначити: Зроблено' : language === 'en' ? 'Mark as done' : 'Отметить: Сделано')}
                        </span>
                      </button>

                      <button
                        onClick={() => {
                          const title = card.title;
                          if (navigator.share) {
                            navigator.share({
                              title: title,
                              text: `Інструкція "Сам собі мама": ${title}`,
                              url: window.location.href,
                            }).catch(() => {});
                          } else {
                            navigator.clipboard.writeText(`${title} - ${window.location.href}`);
                            setCopiedCardId(card.id);
                            setTimeout(() => setCopiedCardId(null), 2000);
                          }
                        }}
                        className="px-3 py-1.5 bg-white border-2 border-black text-xs font-black text-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-300 transition-all flex items-center gap-1.5 active:translate-x-[1px] active:translate-y-[1px]"
                      >
                        {copiedCardId === card.id ? <Check className="w-4 h-4 stroke-[3]" /> : <Share2 className="w-4 h-4 stroke-[3]" />}
                        {copiedCardId === card.id ? content.sos.linkCopied : content.sos.shareCard}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Step-by-step Guide [U-01] */}
      <section className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-[#FFD600] text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <Gauge className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tight text-black">
              {content.utilities.guideTitle}
            </h2>
            <p className="text-xs font-bold italic text-black/80">
              Проста інструкція без заплутаних формул
            </p>
          </div>
        </div>

        <ol className="space-y-3 text-sm text-black">
          {content.utilities.guideSteps.map((step, idx) => (
            <li key={idx} className="flex items-start gap-3 p-3 bg-[#F7F7F2] border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <span className="w-6 h-6 bg-black text-white text-xs font-black flex items-center justify-center shrink-0 border border-black">
                {idx + 1}
              </span>
              <span className="font-extrabold">{step}</span>
            </li>
          ))}
        </ol>

        <div className="mt-4 p-3.5 bg-[#FFD600] border-2 border-black text-xs font-black text-black flex items-center gap-2.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <Sparkles className="w-4 h-4 text-black shrink-0 stroke-[3]" />
          <span>💬 {content.utilities.guideNote}</span>
        </div>
      </section>

      {/* Reminder & Notification Banner */}
      <section className="bg-[#B2FF59] border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-black flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-black text-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] shrink-0">
            <Bell className="w-6 h-6 stroke-[2.5] animate-bounce" />
          </div>
          <div>
            <h3 className="text-lg font-black uppercase tracking-tight text-black">{content.utilities.reminderTitle}</h3>
            <p className="text-xs font-bold text-black/90 mt-0.5">{content.utilities.reminderText}</p>
            <p className="text-[11px] font-black italic text-black/80 mt-1">
              📅 Автоматичне сповіщення браузера 1–5 числа щомісяця
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full md:w-auto shrink-0">
          {notificationPermission === 'unsupported' ? (
            <div className="px-4 py-2 bg-[#FF5252] text-white border-2 border-black text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              ⚠️ Браузер не підтримує сповіщення
            </div>
          ) : notificationPermission === 'denied' ? (
            <div className="px-4 py-2 bg-[#FF5252] text-white border-2 border-black text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              🚫 Сповіщення заблоковано браузером
            </div>
          ) : notificationPermission === 'granted' ? (
            <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
              <div className="px-4 py-2.5 bg-black text-white border-2 border-black text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] w-full sm:w-auto">
                <ShieldCheck className="w-4 h-4 text-[#B2FF59] stroke-[3]" /> {content.utilities.notificationsEnabled}
              </div>
              <button
                onClick={sendTestNotification}
                className="px-3.5 py-2.5 bg-white hover:bg-yellow-200 text-black border-2 border-black font-black text-xs uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] transition-all flex items-center justify-center gap-1.5 w-full sm:w-auto"
                title="Перевірити як виглядає сповіщення"
              >
                <Send className="w-3.5 h-3.5 stroke-[2.5]" />
                {testSent ? '✓ Відправлено!' : 'Тест'}
              </button>
            </div>
          ) : (
            <button
              onClick={requestNotificationPermission}
              className="w-full sm:w-auto px-5 py-3 bg-black text-white hover:bg-zinc-800 font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] transition-all shrink-0"
            >
              {content.utilities.enableNotifications}
            </button>
          )}
        </div>
      </section>

      {/* Meter Tracker Form & Log */}
      <section className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-black uppercase tracking-tight text-black">
            {content.utilities.trackerTitle}
          </h3>
          {latestEntry && (
            <button
              onClick={copyReadingsFormatted}
              className="px-3 py-2 bg-[#FFD600] border-2 border-black text-xs font-black text-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-300 transition-all flex items-center gap-1.5 active:translate-x-[1px] active:translate-y-[1px]"
            >
              {copied ? <Check className="w-4 h-4 text-black stroke-[3]" /> : <Copy className="w-4 h-4 text-black stroke-[3]" />}
              {copied ? content.utilities.copied : content.utilities.copyReadingsText}
            </button>
          )}
        </div>

        {/* Meter Readings SVG Chart */}
        <MeterChart entries={meterEntries} />

        {/* Form to log new meter readings */}
        <form onSubmit={handleAddMeter} className="p-4 bg-[#F7F7F2] border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mb-5 space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-black">
            Записати нові показники за цей місяць
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-xs font-black text-black block mb-1">
                {content.utilities.meters.electricity}
              </label>
              <input
                type="number"
                value={elec}
                onChange={(e) => setElec(Number(e.target.value))}
                className="w-full px-3 py-2 border-2 border-black bg-white text-sm font-extrabold text-black focus:outline-hidden focus:bg-yellow-50"
              />
            </div>
            <div>
              <label className="text-xs font-black text-black block mb-1">
                {content.utilities.meters.coldWater}
              </label>
              <input
                type="number"
                value={coldW}
                onChange={(e) => setColdW(Number(e.target.value))}
                className="w-full px-3 py-2 border-2 border-black bg-white text-sm font-extrabold text-black focus:outline-hidden focus:bg-yellow-50"
              />
            </div>
            <div>
              <label className="text-xs font-black text-black block mb-1">
                {content.utilities.meters.hotWater}
              </label>
              <input
                type="number"
                value={hotW}
                onChange={(e) => setHotW(Number(e.target.value))}
                className="w-full px-3 py-2 border-2 border-black bg-white text-sm font-extrabold text-black focus:outline-hidden focus:bg-yellow-50"
              />
            </div>
            <div>
              <label className="text-xs font-black text-black block mb-1">
                {content.utilities.meters.gas}
              </label>
              <input
                type="number"
                value={gasVal}
                onChange={(e) => setGasVal(Number(e.target.value))}
                className="w-full px-3 py-2 border-2 border-black bg-white text-sm font-extrabold text-black focus:outline-hidden focus:bg-yellow-50"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <input
              type="text"
              placeholder="Примітка (напр., серпень 2026)"
              value={noteVal}
              onChange={(e) => setNoteVal(e.target.value)}
              className="flex-1 px-3 py-2 border-2 border-black bg-white text-xs font-bold text-black focus:outline-hidden focus:bg-yellow-50"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-black hover:bg-zinc-800 text-white font-black text-xs uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 stroke-[3]" /> Зберегти
            </button>
          </div>
        </form>

        {/* History Table */}
        <div className="overflow-x-auto border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
          <table className="w-full text-left text-xs text-black">
            <thead className="bg-black text-white uppercase font-black text-[10px] tracking-wider border-b-2 border-black">
              <tr>
                <th className="p-3">Дата</th>
                <th className="p-3">Світло</th>
                <th className="p-3">Холодна вода</th>
                <th className="p-3">Гаряча вода</th>
                <th className="p-3">Газ</th>
                <th className="p-3 text-right">Дія</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-black bg-white font-bold">
              {meterEntries.map((entry, idx) => {
                const prev = meterEntries[idx + 1];
                const diffElec = prev ? entry.electricity - prev.electricity : 0;
                const diffCold = prev ? entry.coldWater - prev.coldWater : 0;
                const diffHot = prev ? entry.hotWater - prev.hotWater : 0;
                const diffGas = prev ? entry.gas - prev.gas : 0;

                return (
                  <tr key={entry.id} className="hover:bg-yellow-100 transition-colors">
                    <td className="p-3 font-black">
                      {entry.date}
                      {entry.note && <span className="block text-[10px] text-black/70 font-bold">{entry.note}</span>}
                    </td>
                    <td className="p-3">
                      <span className="font-extrabold">{entry.electricity}</span>
                      {diffElec > 0 && <span className="text-[10px] text-black font-black block">+{diffElec} кВт</span>}
                    </td>
                    <td className="p-3">
                      <span className="font-extrabold">{entry.coldWater}</span>
                      {diffCold > 0 && <span className="text-[10px] text-black font-black block">+{diffCold} м³</span>}
                    </td>
                    <td className="p-3">
                      <span className="font-extrabold">{entry.hotWater}</span>
                      {diffHot > 0 && <span className="text-[10px] text-[#FF5252] font-black block">+{diffHot} м³</span>}
                    </td>
                    <td className="p-3">
                      <span className="font-extrabold">{entry.gas}</span>
                      {diffGas > 0 && <span className="text-[10px] text-black font-black block">+{diffGas} м³</span>}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => deleteMeterEntry(entry.id)}
                        className="p-1.5 text-black hover:bg-[#FF5252] hover:text-white border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all"
                        title="Видалити"
                      >
                        <Trash2 className="w-3.5 h-3.5 stroke-[2.5]" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Budget Calculator [U-02] */}
      <section className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-[#B2FF59] text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <Calculator className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tight text-black">
              {content.utilities.budgetTitle}
            </h2>
            <p className="text-xs font-bold italic text-black/80">
              {content.utilities.budgetSubtitle}
            </p>
          </div>
        </div>

        {/* Budget Donut Chart */}
        <BudgetDonut budget={budget} />

        {/* Income & Expenses Input */}
        <div className="p-4 bg-[#B2FF59] border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mb-5 space-y-4">
          <div>
            <label className="text-xs font-black uppercase tracking-wider text-black block mb-1">
              {content.utilities.incomeLabel}
            </label>
            <input
              type="number"
              value={budget.income}
              onChange={(e) => updateBudget({ income: Number(e.target.value) })}
              className="w-full px-4 py-2.5 border-3 border-black bg-white text-xl font-black text-black focus:outline-hidden focus:bg-yellow-50"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
            <div>
              <label className="text-xs font-black text-black block mb-1">🏠 Житло/Оренда</label>
              <input
                type="number"
                value={budget.housing}
                onChange={(e) => updateBudget({ housing: Number(e.target.value) })}
                className="w-full px-3 py-2 border-2 border-black bg-white text-sm font-extrabold text-black"
              />
            </div>
            <div>
              <label className="text-xs font-black text-black block mb-1">⚡ Комуналка</label>
              <input
                type="number"
                value={budget.utilities}
                onChange={(e) => updateBudget({ utilities: Number(e.target.value) })}
                className="w-full px-3 py-2 border-2 border-black bg-white text-sm font-extrabold text-black"
              />
            </div>
            <div>
              <label className="text-xs font-black text-black block mb-1">🥗 Харчування</label>
              <input
                type="number"
                value={budget.food}
                onChange={(e) => updateBudget({ food: Number(e.target.value) })}
                className="w-full px-3 py-2 border-2 border-black bg-white text-sm font-extrabold text-black"
              />
            </div>
            <div>
              <label className="text-xs font-black text-black block mb-1">🚌 Транспорт</label>
              <input
                type="number"
                value={budget.transport}
                onChange={(e) => updateBudget({ transport: Number(e.target.value) })}
                className="w-full px-3 py-2 border-2 border-black bg-white text-sm font-extrabold text-black"
              />
            </div>
            <div>
              <label className="text-xs font-black text-black block mb-1">📱 Зв’язок</label>
              <input
                type="number"
                value={budget.phone}
                onChange={(e) => updateBudget({ phone: Number(e.target.value) })}
                className="w-full px-3 py-2 border-2 border-black bg-white text-sm font-extrabold text-black"
              />
            </div>
            <div>
              <label className="text-xs font-black text-black block mb-1">🎉 Радість!</label>
              <input
                type="number"
                value={budget.joy}
                onChange={(e) => updateBudget({ joy: Number(e.target.value) })}
                className="w-full px-3 py-2 border-2 border-black bg-[#FFD600] text-sm font-black text-black"
              />
            </div>
          </div>
        </div>

        {/* Breakdown Visualizer */}
        <div className="space-y-4">
          <h4 className="text-xs font-black uppercase tracking-wider text-black">
            Аналіз витрат за формулою 60% / 25% / 15%
          </h4>

          {/* Progress bar 1: Needs */}
          <div>
            <div className="flex justify-between text-xs font-black mb-1">
              <span className="text-black">Обов'язкові потреби (60%): {totalNeeds} грн</span>
              <span className={totalNeeds > targetNeeds ? 'text-[#FF5252]' : 'text-black'}>
                Рекомендовано: {targetNeeds} грн ({needsPercent}%)
              </span>
            </div>
            <div className="h-4 border-2 border-black bg-white overflow-hidden p-0.5">
              <div
                className={`h-full border border-black transition-all ${totalNeeds > targetNeeds ? 'bg-[#FF5252]' : 'bg-black'}`}
                style={{ width: `${needsPercent}%` }}
              ></div>
            </div>
          </div>

          {/* Progress bar 2: Joy */}
          <div>
            <div className="flex justify-between text-xs font-black mb-1">
              <span className="text-black">Бажання & Радість (25%): {totalWants} грн</span>
              <span className="text-black">
                Рекомендовано: {targetWants} грн ({wantsPercent}%)
              </span>
            </div>
            <div className="h-4 border-2 border-black bg-white overflow-hidden p-0.5">
              <div className="h-full bg-[#FFD600] border border-black transition-all" style={{ width: `${wantsPercent}%` }}></div>
            </div>
          </div>

          {/* Progress bar 3: Reserve */}
          <div>
            <div className="flex justify-between text-xs font-black mb-1">
              <span className="text-black">Заначка & Резерв (15%): {totalSavings} грн</span>
              <span className="text-black">
                Рекомендовано: {targetSavings} грн ({savingsPercent}%)
              </span>
            </div>
            <div className="h-4 border-2 border-black bg-white overflow-hidden p-0.5">
              <div className="h-full bg-[#B2FF59] border border-black transition-all" style={{ width: `${savingsPercent}%` }}></div>
            </div>
          </div>

          {totalExpenses > budget.income && (
            <div className="p-3 bg-[#FF5252] border-2 border-black text-white text-xs font-black flex items-center gap-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <AlertCircle className="w-5 h-5 shrink-0 stroke-[2.5]" />
              <span>Увага! Витрати перевищують ваш дохід на {totalExpenses - budget.income} грн!Скоригуйте категорію «Радість».</span>
            </div>
          )}

          <div className="p-3 bg-[#FFD600] border-2 border-black text-xs text-black space-y-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <p className="font-black">💬 {content.utilities.joyMandatory}</p>
            <p className="italic font-bold">{content.utilities.shoppingTip}</p>
          </div>
        </div>
      </section>
    </div>
  );
};
