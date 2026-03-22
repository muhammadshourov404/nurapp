'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import BottomNav from '../../components/BottomNav'
import {
  ChevronLeftIcon, RefreshIcon, HistoryIcon,
  PlusIcon, MinusIcon, CheckIcon
} from '../../components/Icons'

const TASBIH_LIST = [
  { id: 1, arabic: 'سُبْحَانَ اللَّهِ', bangla: 'সুবহানাল্লাহ', english: 'Glory be to Allah', target: 33, color: '#10b981', rewardBn: 'প্রতিটিতে জান্নাতে একটি গাছ লাগানো হয়', rewardEn: 'A tree is planted in Paradise for each recitation' },
  { id: 2, arabic: 'الْحَمْدُ لِلَّهِ', bangla: 'আলহামদুলিল্লাহ', english: 'All praise is due to Allah', target: 33, color: '#f59e0b', rewardBn: 'মিযান পরিপূর্ণ করে দেয়', rewardEn: 'Fills the scale of good deeds' },
  { id: 3, arabic: 'اللَّهُ أَكْبَرُ', bangla: 'আল্লাহু আকবার', english: 'Allah is the Greatest', target: 34, color: '#ef4444', rewardBn: 'আসমান ও যমিন পরিপূর্ণ করে দেয়', rewardEn: 'Fills the heavens and earth' },
  { id: 4, arabic: 'لَا إِلَهَ إِلَّا اللَّهُ', bangla: 'লা ইলাহা ইল্লাল্লাহ', english: 'There is no god but Allah', target: 100, color: '#8b5cf6', rewardBn: 'সর্বোত্তম যিকর — গুনাহ মুছে দেয়', rewardEn: 'Best remembrance — erases sins' },
  { id: 5, arabic: 'أَسْتَغْفِرُ اللَّهَ', bangla: 'আস্তাগফিরুল্লাহ', english: 'I seek forgiveness from Allah', target: 100, color: '#3b82f6', rewardBn: 'গুনাহ মাফের চাবিকাঠি', rewardEn: 'Key to forgiveness of sins' },
  { id: 6, arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ', bangla: 'সুবহানাল্লাহি ওয়াবিহামদিহি', english: 'Glory and praise be to Allah', target: 100, color: '#ec4899', rewardBn: 'মিযানে ভারী দুটি কালিমা', rewardEn: 'Two words heavy in the scale' },
  { id: 7, arabic: 'سُبْحَانَ اللَّهِ الْعَظِيمِ', bangla: 'সুবহানাল্লাহিল আযিম', english: 'Glory be to Allah the Magnificent', target: 100, color: '#06b6d4', rewardBn: 'জান্নাতে খেজুর গাছ লাগানো হয়', rewardEn: 'A date palm planted in Paradise' },
  { id: 8, arabic: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ', bangla: 'লা হাওলা ওয়ালা কুওয়াতা ইল্লা বিল্লাহ', english: 'There is no power except with Allah', target: 100, color: '#f97316', rewardBn: 'জান্নাতের ভান্ডারসমূহের একটি', rewardEn: 'One of the treasures of Paradise' },
  { id: 9, arabic: 'صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ', bangla: 'দরুদ শরীফ', english: 'Salawat upon the Prophet', target: 100, color: '#fbbf24', rewardBn: 'প্রতিটি দরুদে ১০টি রহমত নাযিল হয়', rewardEn: '10 blessings descend for each recitation' },
  { id: 10, arabic: 'اللَّهُ اللَّهُ اللَّهُ', bangla: 'আল্লাহ আল্লাহ আল্লাহ', english: 'Allah Allah Allah', target: 300, color: '#10b981', rewardBn: 'আল্লাহর যিকর সর্বোত্তম আমল', rewardEn: 'Remembrance of Allah is the best deed' },
  { id: 11, arabic: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ', bangla: 'বিসমিল্লাহির রাহমানির রাহিম', english: 'In the name of Allah, the Most Gracious', target: 100, color: '#8b5cf6', rewardBn: 'প্রতিটি কাজের শুরুতে বরকত আসে', rewardEn: 'Brings blessings to every task' },
  { id: 12, arabic: 'يَا اللَّهُ', bangla: 'ইয়া আল্লাহ', english: 'O Allah', target: 1000, color: '#06b6d4', rewardBn: 'আল্লাহর নাম স্মরণে অন্তর প্রশান্ত হয়', rewardEn: 'Hearts find peace in remembrance of Allah' },
]

export default function TasbihPage() {
  const [selected, setSelected] = useState(TASBIH_LIST[0])
  const [count, setCount] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [rounds, setRounds] = useState(0)
  const [lang, setLang] = useState('bn')
  const [bump, setBump] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [history, setHistory] = useState([])
  const [showHistory, setShowHistory] = useState(false)
  const [customTarget, setCustomTarget] = useState(false)
  const [targetInput, setTargetInput] = useState('')
  const [target, setTarget] = useState(TASBIH_LIST[0].target)

  useEffect(() => {
    const savedLang = localStorage.getItem('nurapp_lang') || 'bn'
    setLang(savedLang)
    const savedHistory = localStorage.getItem('tasbih_history')
    if (savedHistory) setHistory(JSON.parse(savedHistory))
  }, [])

  useEffect(() => {
    if (count > 0 && count % target === 0) {
      setCompleted(true)
      setRounds(prev => prev + 1)
      if (navigator.vibrate) navigator.vibrate([200, 100, 200])
      setTimeout(() => setCompleted(false), 2500)
    }
  }, [count, target])

  const handleCount = () => {
    setBump(true)
    setTimeout(() => setBump(false), 150)
    if (navigator.vibrate) navigator.vibrate(15)
    setCount(prev => prev + 1)
    setTotalCount(prev => prev + 1)
  }

  const saveAndReset = () => {
    if (count > 0) {
      const entry = {
        arabic: selected.arabic,
        nameBn: selected.bangla,
        nameEn: selected.english,
        count, rounds, target,
        date: new Date().toLocaleDateString('bn-BD'),
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      }
      const updated = [entry, ...history].slice(0, 30)
      setHistory(updated)
      localStorage.setItem('tasbih_history', JSON.stringify(updated))
    }
    setCount(0)
    setRounds(0)
    setCompleted(false)
  }

  const selectTasbih = (t) => {
    saveAndReset()
    setSelected(t)
    setTarget(t.target)
    setCount(0)
    setRounds(0)
    setCustomTarget(false)
    setTargetInput('')
  }

  const applyCustomTarget = () => {
    const t = parseInt(targetInput)
    if (t > 0) { setTarget(t); setCustomTarget(false) }
  }

  const toggleLang = () => {
    const nl = lang === 'bn' ? 'en' : 'bn'
    setLang(nl)
    localStorage.setItem('nurapp_lang', nl)
  }

  const currentInRound = count % target === 0 && count > 0 ? target : count % target
  const progress = (currentInRound / target) * 100

  const circumference = 2 * Math.PI * 54
  const strokeDashoffset = circumference * (1 - progress / 100)

  return (
    <main className="min-h-screen pb-28" style={{ background: 'var(--bg-primary)' }}>

      <header className="sticky top-0 z-50 header-blur">
        <div className="px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="btn-icon">
              <ChevronLeftIcon size={18} color="var(--text-secondary)" />
            </Link>
            <div>
              <h1 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                {lang === 'bn' ? 'তাসবিহ কাউন্টার' : 'Tasbih Counter'}
              </h1>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {lang === 'bn' ? 'আল্লাহর যিকর' : "Dhikr of Allah"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowHistory(!showHistory)} className="btn-icon"
              style={{ background: showHistory ? 'rgba(245,158,11,0.15)' : undefined }}>
              <HistoryIcon size={16} color={showHistory ? '#f59e0b' : 'var(--text-secondary)'} />
            </button>
            <button onClick={toggleLang} className="btn-icon">
              <span className="text-xs font-bold" style={{ color: 'var(--text-secondary)' }}>
                {lang === 'bn' ? 'EN' : 'বাং'}
              </span>
            </button>
          </div>
        </div>
      </header>

      <div className="px-5 pt-5">

        {showHistory ? (
          <div>
            <p className="section-title">{lang === 'bn' ? 'তাসবিহ ইতিহাস' : 'Tasbih History'}</p>
            {history.length === 0 ? (
              <div className="text-center py-16 rounded-3xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <HistoryIcon size={40} color="var(--text-muted)" />
                <p className="mt-4 font-semibold" style={{ color: 'var(--text-secondary)' }}>
                  {lang === 'bn' ? 'কোনো ইতিহাস নেই' : 'No history yet'}
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {[
                    { label: lang === 'bn' ? 'মোট সেশন' : 'Total Sessions', value: history.length },
                    { label: lang === 'bn' ? 'মোট গণনা' : 'Total Count', value: history.reduce((s, h) => s + h.count, 0) },
                    { label: lang === 'bn' ? 'মোট রাউন্ড' : 'Total Rounds', value: history.reduce((s, h) => s + h.rounds, 0) },
                  ].map((stat, i) => (
                    <div key={i} className="card p-3 text-center">
                      <p className="text-xl font-bold" style={{ color: '#10b981', fontFamily: 'Inter' }}>{stat.value}</p>
                      <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{stat.label}</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  {history.map((h, i) => (
                    <div key={i} className="card p-4 flex items-center justify-between">
                      <div>
                        <p className="font-arabic text-lg" style={{ color: '#fde68a' }}>{h.arabic}</p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                          {h.date} • {h.time}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'Inter' }}>
                          {h.count}
                        </p>
                        <p className="text-xs" style={{ color: '#10b981' }}>
                          {h.rounds} {lang === 'bn' ? 'রাউন্ড' : 'rounds'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={() => { setHistory([]); localStorage.removeItem('tasbih_history') }}
                  className="w-full mt-4 btn-secondary rounded-xl py-3 text-sm">
                  {lang === 'bn' ? 'ইতিহাস মুছুন' : 'Clear History'}
                </button>
              </>
            )}
          </div>
        ) : (
          <>
            {/* Tasbih Selector */}
            <div className="mb-5">
              <p className="section-title">{lang === 'bn' ? 'তাসবিহ নির্বাচন করুন' : 'Select Tasbih'}</p>
              <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                {TASBIH_LIST.map(t => (
                  <button key={t.id} onClick={() => selectTasbih(t)}
                    className="flex-shrink-0 px-3 py-2 rounded-xl text-xs font-bold transition-all border"
                    style={{
                      background: selected.id === t.id ? `${t.color}20` : 'transparent',
                      color: selected.id === t.id ? t.color : 'var(--text-muted)',
                      borderColor: selected.id === t.id ? `${t.color}40` : 'var(--border)'
                    }}>
                    {lang === 'bn' ? t.bangla : t.english.split(' ').slice(0, 2).join(' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Counter Card */}
            <div className="rounded-3xl p-6 mb-4 text-center transition-all"
              style={{
                background: `linear-gradient(135deg, ${selected.color}18, ${selected.color}08)`,
                border: `1px solid ${selected.color}30`,
                transform: bump ? 'scale(0.97)' : 'scale(1)',
                transition: 'transform 0.15s ease'
              }}>

              {/* Arabic */}
              <p className="font-arabic mb-1" style={{ fontSize: '26px', color: '#f1e8c8', lineHeight: '2' }}>
                {selected.arabic}
              </p>
              <p className="text-sm mb-5" style={{ color: 'var(--text-secondary)' }}>
                {lang === 'bn' ? selected.bangla : selected.english}
              </p>

              {/* Circular Progress */}
              <div className="relative w-40 h-40 mx-auto mb-4">
                <svg className="circular-progress w-full h-full" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="54" fill="none"
                    stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
                  <circle cx="60" cy="60" r="54" fill="none"
                    stroke={selected.color} strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 0.3s ease' }} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="font-bold tabular-nums" style={{ fontSize: '46px', color: 'white', fontFamily: 'Inter', lineHeight: 1 }}>
                    {currentInRound}
                  </p>
                  <p className="text-sm mt-1" style={{ color: 'var(--text-muted)', fontFamily: 'Inter' }}>
                    / {target}
                  </p>
                </div>
              </div>

              {/* Rounds */}
              {rounds > 0 && (
                <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-2"
                  style={{ background: `${selected.color}25`, border: `1px solid ${selected.color}35` }}>
                  <CheckIcon size={13} color={selected.color} />
                  <span className="text-sm font-bold" style={{ color: selected.color }}>
                    {rounds} {lang === 'bn' ? 'বার সম্পন্ন' : 'rounds done'}
                  </span>
                </div>
              )}
            </div>

            {/* Completion Message */}
            {completed && (
              <div className="rounded-2xl p-4 text-center mb-4 animate-scaleIn"
                style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)' }}>
                <p className="font-arabic text-xl" style={{ color: '#fde68a' }}>مَاشَاءَ اللَّهُ</p>
                <p className="font-bold mt-1" style={{ color: '#10b981' }}>
                  {lang === 'bn' ? 'আলহামদুলিল্লাহ! সম্পন্ন!' : 'Alhamdulillah! Round Complete!'}
                </p>
              </div>
            )}

            {/* Count Button */}
            <button onClick={handleCount}
              className="w-full rounded-2xl py-6 font-bold text-lg text-white mb-3 transition-all active:scale-95"
              style={{
                background: `linear-gradient(135deg, ${selected.color}, ${selected.color}cc)`,
                boxShadow: `0 8px 30px ${selected.color}40`
              }}>
              {lang === 'bn' ? 'ট্যাপ করুন' : 'Tap to Count'}
            </button>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              {[
                { label: lang === 'bn' ? 'এই সেশন' : 'Session', value: count, color: selected.color },
                { label: lang === 'bn' ? 'রাউন্ড' : 'Rounds', value: rounds, color: '#f59e0b' },
                { label: lang === 'bn' ? 'মোট' : 'Total', value: totalCount, color: '#8b5cf6' },
              ].map((s, i) => (
                <div key={i} className="card p-3 text-center">
                  <p className="text-xl font-bold tabular-nums" style={{ color: s.color, fontFamily: 'Inter' }}>{s.value}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
                </div>
              ))}
            </div>

            {/* Custom Target */}
            {customTarget ? (
              <div className="flex gap-2 mb-3">
                <input type="number" value={targetInput} onChange={e => setTargetInput(e.target.value)}
                  placeholder={lang === 'bn' ? 'লক্ষ্য সংখ্যা লিখুন' : 'Enter target number'}
                  className="input-field flex-1" min="1" />
                <button onClick={applyCustomTarget} className="btn-primary px-4 rounded-xl text-sm">
                  {lang === 'bn' ? 'সেট' : 'Set'}
                </button>
                <button onClick={() => setCustomTarget(false)} className="btn-secondary px-3 rounded-xl text-sm">
                  {lang === 'bn' ? 'বাতিল' : 'Cancel'}
                </button>
              </div>
            ) : (
              <div className="flex gap-2 mb-3">
                <button onClick={saveAndReset} className="flex-1 btn-secondary rounded-xl py-3 text-sm flex items-center justify-center gap-2">
                  <RefreshIcon size={15} color="var(--text-secondary)" />
                  {lang === 'bn' ? 'রিসেট ও সেভ' : 'Reset & Save'}
                </button>
                <button onClick={() => setCustomTarget(true)} className="flex-1 btn-secondary rounded-xl py-3 text-sm">
                  {lang === 'bn' ? `লক্ষ্য: ${target}` : `Target: ${target}`}
                </button>
              </div>
            )}

            {/* Reward */}
            <div className="rounded-2xl p-4"
              style={{ background: `${selected.color}08`, border: `1px solid ${selected.color}15` }}>
              <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: selected.color }}>
                {lang === 'bn' ? 'ফযিলত' : 'Reward'}
              </p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {lang === 'bn' ? selected.rewardBn : selected.rewardEn}
              </p>
            </div>

            {/* Copyright */}
            <div className="mt-6 py-4 text-center" style={{ borderTop: '1px solid var(--border)' }}>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {lang === 'bn' ? 'তৈরি করেছেন' : 'Developed by'}{' '}
                <span className="font-bold" style={{ color: '#10b981' }}>Muhammad Shourov</span>
              </p>
            </div>
          </>
        )}
      </div>

      <BottomNav lang={lang} />
    </main>
  )
}
