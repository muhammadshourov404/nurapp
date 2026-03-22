'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const TASBIH_LIST = [
  { id: 1, arabic: 'سُبْحَانَ اللَّهِ', bangla: 'সুবহানাল্লাহ', english: 'Glory be to Allah', target: 33, color: 'from-emerald-500 to-green-600', reward: 'প্রতিটিতে একটি গাছ জান্নাতে লাগানো হয়' },
  { id: 2, arabic: 'الْحَمْدُ لِلَّهِ', bangla: 'আলহামদুলিল্লাহ', english: 'All praise is due to Allah', target: 33, color: 'from-teal-500 to-emerald-600', reward: 'মিযান পরিপূর্ণ করে দেয়' },
  { id: 3, arabic: 'اللَّهُ أَكْبَرُ', bangla: 'আল্লাহু আকবার', english: 'Allah is the Greatest', target: 34, color: 'from-amber-500 to-orange-600', reward: 'আসমান ও যমিন পরিপূর্ণ করে' },
  { id: 4, arabic: 'لَا إِلَهَ إِلَّا اللَّهُ', bangla: 'লা ইলাহা ইল্লাল্লাহ', english: 'There is no god but Allah', target: 100, color: 'from-blue-500 to-indigo-600', reward: 'সর্বোত্তম যিকর' },
  { id: 5, arabic: 'أَسْتَغْفِرُ اللَّهَ', bangla: 'আস্তাগফিরুল্লাহ', english: 'I seek forgiveness from Allah', target: 100, color: 'from-purple-500 to-violet-600', reward: 'গুনাহ মাফের চাবিকাঠি' },
  { id: 6, arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ', bangla: 'সুবহানাল্লাহি ওয়াবিহামদিহি', english: 'Glory be to Allah and His praise', target: 100, color: 'from-rose-500 to-pink-600', reward: 'মিযানে ভারী দুটি কালিমা' },
]

export default function TasbihPage() {
  const [selected, setSelected] = useState(TASBIH_LIST[0])
  const [count, setCount] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [rounds, setRounds] = useState(0)
  const [lang, setLang] = useState('bn')
  const [flash, setFlash] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [history, setHistory] = useState([])
  const [showHistory, setShowHistory] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('tasbih_history')
    if (saved) setHistory(JSON.parse(saved))
  }, [])

  useEffect(() => {
    if (count > 0 && count % selected.target === 0) {
      setCompleted(true)
      setRounds(prev => prev + 1)
      if (navigator.vibrate) navigator.vibrate([200, 100, 200])
      setTimeout(() => setCompleted(false), 2500)
    }
  }, [count])

  const handleCount = () => {
    setFlash(true)
    setTimeout(() => setFlash(false), 150)
    if (navigator.vibrate) navigator.vibrate(15)
    setCount(prev => prev + 1)
    setTotalCount(prev => prev + 1)
  }

  const handleReset = () => {
    if (count > 0) {
      const newEntry = {
        name: lang === 'bn' ? selected.bangla : selected.english,
        arabic: selected.arabic,
        count,
        rounds,
        date: new Date().toLocaleDateString('bn-BD'),
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      }
      const updated = [newEntry, ...history].slice(0, 20)
      setHistory(updated)
      localStorage.setItem('tasbih_history', JSON.stringify(updated))
    }
    setCount(0)
    setRoundsше(0)
    setCompleted(false)
  }

  const handleSelect = (t) => {
    handleReset()
    setSelected(t)
    setCount(0)
    setRounds(0)
  }

  const progress = ((count % selected.target) / selected.target) * 100
  const currentRoundCount = count % selected.target === 0 && count > 0 ? selected.target : count % selected.target

  return (
    <main className="min-h-screen bg-gray-950 pb-24">
      <header className="sticky top-0 z-50 bg-gray-950/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all text-lg">←</Link>
            <h1 className="text-base font-bold text-white">📿 {lang === 'bn' ? 'তাসবিহ কাউন্টার' : 'Tasbih Counter'}</h1>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowHistory(!showHistory)}
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all text-lg ${showHistory ? 'bg-amber-500/20' : 'bg-white/10'}`}>
              📊
            </button>
            <button onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
              className="px-3 py-1.5 rounded-lg bg-white/10 text-xs font-bold border border-white/10">
              {lang === 'bn' ? 'EN' : 'বাং'}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-5">

        {showHistory ? (
          <div>
            <h2 className="text-white font-bold mb-4">📊 {lang === 'bn' ? 'তাসবিহ ইতিহাস' : 'Tasbih History'}</h2>
            {history.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-4xl mb-3">📿</p>
                <p className="text-gray-400">{lang === 'bn' ? 'এখনো কোনো রেকর্ড নেই' : 'No history yet'}</p>
              </div>
            ) : (
              <div className="space-y-2">
                {history.map((h, i) => (
                  <div key={i} className="rounded-xl bg-white/5 border border-white/10 p-4 flex items-center justify-between">
                    <div>
                      <p className="font-arabic text-lg text-amber-300">{h.arabic}</p>
                      <p className="text-gray-400 text-xs">{h.date} • {h.time}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold">{h.count}</p>
                      <p className="text-emerald-400 text-xs">{h.rounds} {lang === 'bn' ? 'রাউন্ড' : 'rounds'}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Selector */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-5 scrollbar-hide">
              {TASBIH_LIST.map(t => (
                <button key={t.id} onClick={() => handleSelect(t)}
                  className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                    selected.id === t.id ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'
                  }`}>
                  {lang === 'bn' ? t.bangla : t.english.split(' ').slice(0,2).join(' ')}
                </button>
              ))}
            </div>

            {/* Main Card */}
            <div className={`rounded-3xl bg-gradient-to-br ${selected.color} p-6 mb-4 text-center shadow-2xl transition-all ${flash ? 'scale-95' : 'scale-100'}`}>
              <p className="font-arabic text-3xl text-white leading-loose mb-1">{selected.arabic}</p>
              <p className="text-white/80 text-sm mb-5">{lang === 'bn' ? selected.bangla : selected.english}</p>

              {/* Circular Progress */}
              <div className="relative w-40 h-40 mx-auto mb-4">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="8"/>
                  <circle cx="50" cy="50" r="45" fill="none" stroke="white" strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 45}`}
                    strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress/100)}`}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 0.3s ease' }}/>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-5xl font-bold text-white">{currentRoundCount}</p>
                  <p className="text-white/60 text-xs">/ {selected.target}</p>
                </div>
              </div>

              {rounds > 0 && (
                <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5 mb-2">
                  <span className="text-white text-sm font-bold">✅ {rounds} {lang === 'bn' ? 'বার সম্পন্ন' : 'rounds done'}</span>
                </div>
              )}
            </div>

            {/* Completed */}
            {completed && (
              <div className="rounded-2xl bg-emerald-600 p-4 text-center mb-4 animate-fadeInUp">
                <p className="text-white font-bold text-lg">مَاشَاءَ اللَّهُ ✨</p>
                <p className="text-emerald-100 text-sm">{lang === 'bn' ? 'আলহামদুলিল্লাহ! সম্পন্ন!' : 'Alhamdulillah! Completed!'}</p>
              </div>
            )}

            {/* Count Button */}
            <button onClick={handleCount}
              className={`w-full rounded-2xl bg-gradient-to-br ${selected.color} py-6 text-white font-bold text-xl shadow-lg active:scale-95 transition-transform mb-3`}>
              👆 {lang === 'bn' ? 'ট্যাপ করুন' : 'Tap to Count'}
            </button>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="rounded-xl bg-white/5 border border-white/10 p-3 text-center">
                <p className="text-gray-400 text-xs mb-1">{lang === 'bn' ? 'এই সেশন' : 'Session'}</p>
                <p className="text-white font-bold text-lg">{count}</p>
              </div>
              <div className="rounded-xl bg-white/5 border border-white/10 p-3 text-center">
                <p className="text-gray-400 text-xs mb-1">{lang === 'bn' ? 'রাউন্ড' : 'Rounds'}</p>
                <p className="text-emerald-400 font-bold text-lg">{rounds}</p>
              </div>
              <div className="rounded-xl bg-white/5 border border-white/10 p-3 text-center">
                <p className="text-gray-400 text-xs mb-1">{lang === 'bn' ? 'মোট' : 'Total'}</p>
                <p className="text-amber-400 font-bold text-lg">{totalCount}</p>
              </div>
            </div>

            {/* Reset */}
            <button onClick={handleReset}
              className="w-full rounded-xl bg-white/5 border border-white/10 p-3 text-gray-400 hover:bg-white/10 transition-all text-sm font-medium mb-4">
              🔄 {lang === 'bn' ? 'রিসেট ও সেভ করুন' : 'Reset & Save'}
            </button>

            {/* Reward */}
            <div className="rounded-xl bg-amber-950/30 border border-amber-600/20 p-4">
              <p className="text-amber-400 text-xs font-bold mb-1">✨ {lang === 'bn' ? 'ফযিলত' : 'Reward'}</p>
              <p className="text-gray-300 text-sm">{selected.reward}</p>
            </div>
          </>
        )}
      </div>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-xl border-t border-white/10 z-50">
        <div className="max-w-lg mx-auto flex items-center justify-around py-2">
          {[
            { href: '/', icon: '🏠', label: lang === 'bn' ? 'হোম' : 'Home' },
            { href: '/prayer', icon: '🕐', label: lang === 'bn' ? 'নামাজ' : 'Prayer' },
            { href: '/quran', icon: '📖', label: lang === 'bn' ? 'কোরআন' : 'Quran' },
            { href: '/dua', icon: '🤲', label: lang === 'bn' ? 'দোয়া' : 'Dua' },
            { href: '/tasbih', icon: '📿', label: lang === 'bn' ? 'তাসবিহ' : 'Tasbih' },
          ].map((item, i) => (
            <Link key={i} href={item.href}
              className={`flex flex-col items-center gap-1 px-2 py-1 rounded-xl transition-all ${item.href === '/tasbih' ? 'bg-emerald-600/20' : 'hover:bg-white/10'}`}>
              <span className="text-xl">{item.icon}</span>
              <span className={`text-xs ${item.href === '/tasbih' ? 'text-emerald-400' : 'text-gray-400'}`}>{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </main>
  )
}
