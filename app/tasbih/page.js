'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const TASBIH_LIST = [
  { id: 1, arabic: 'سُبْحَانَ اللَّهِ', bangla: 'সুবহানাল্লাহ', english: 'Glory be to Allah', target: 33, color: 'from-emerald-600 to-green-700' },
  { id: 2, arabic: 'الْحَمْدُ لِلَّهِ', bangla: 'আলহামদুলিল্লাহ', english: 'All praise is due to Allah', target: 33, color: 'from-teal-600 to-emerald-700' },
  { id: 3, arabic: 'اللَّهُ أَكْبَرُ', bangla: 'আল্লাহু আকবার', english: 'Allah is the Greatest', target: 34, color: 'from-amber-600 to-yellow-700' },
  { id: 4, arabic: 'لَا إِلَهَ إِلَّا اللَّهُ', bangla: 'লা ইলাহা ইল্লাল্লাহ', english: 'There is no god but Allah', target: 100, color: 'from-blue-600 to-indigo-700' },
  { id: 5, arabic: 'أَسْتَغْفِرُ اللَّهَ', bangla: 'আস্তাগফিরুল্লাহ', english: 'I seek forgiveness from Allah', target: 100, color: 'from-purple-600 to-violet-700' },
  { id: 6, arabic: 'صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ', bangla: 'দরূদ শরীফ', english: 'Salawat upon the Prophet', target: 100, color: 'from-rose-600 to-pink-700' },
]

export default function TasbihPage() {
  const [selected, setSelected] = useState(TASBIH_LIST[0])
  const [count, setCount] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [lang, setLang] = useState('bn')
  const [vibrate, setVibrate] = useState(false)
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    if (count === selected.target) {
      setCompleted(true)
      if (navigator.vibrate) navigator.vibrate([200, 100, 200])
      setTimeout(() => setCompleted(false), 2000)
    }
  }, [count, selected.target])

  const handleCount = () => {
    setVibrate(true)
    setTimeout(() => setVibrate(false), 100)
    if (navigator.vibrate) navigator.vibrate(10)
    const newCount = count + 1
    setCount(newCount)
    setTotalCount(prev => prev + 1)
  }

  const handleReset = () => {
    setCount(0)
    setCompleted(false)
  }

  const handleSelect = (t) => {
    setSelected(t)
    setCount(0)
    setCompleted(false)
  }

  const progress = Math.min((count / selected.target) * 100, 100)
  const rounds = Math.floor(count / selected.target)

  return (
    <main className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/nurapp" className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all">
              ←
            </Link>
            <h1 className="text-lg font-bold text-white">
              {lang === 'bn' ? '📿 তাসবিহ কাউন্টার' : '📿 Tasbih Counter'}
            </h1>
          </div>
          <button
            onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-sm font-medium transition-all"
          >
            {lang === 'bn' ? 'EN' : 'বাং'}
          </button>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6">

        {/* Tasbih Selector */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {TASBIH_LIST.map((t) => (
            <button
              key={t.id}
              onClick={() => handleSelect(t)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                selected.id === t.id
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white/10 text-gray-400 hover:bg-white/20'
              }`}
            >
              {lang === 'bn' ? t.bangla : t.english.split(' ')[0]}
            </button>
          ))}
        </div>

        {/* Main Counter Card */}
        <div className={`rounded-3xl bg-gradient-to-br ${selected.color} p-8 mb-6 text-center shadow-2xl`}>
          {/* Arabic Text */}
          <p className="font-arabic text-3xl text-white mb-1 leading-loose">
            {selected.arabic}
          </p>
          <p className="text-white/80 text-sm mb-6">
            {lang === 'bn' ? selected.bangla : selected.english}
          </p>

          {/* Count Display */}
          <div className="relative mb-6">
            <div className={`text-8xl font-bold text-white transition-transform ${vibrate ? 'scale-110' : 'scale-100'}`}>
              {count}
            </div>
            <p className="text-white/60 text-sm mt-1">
              {lang === 'bn' ? `লক্ষ্য: ${selected.target}` : `Target: ${selected.target}`}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-white/20 rounded-full h-3 mb-4 overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          {rounds > 0 && (
            <p className="text-white/80 text-sm">
              {lang === 'bn' ? `${rounds} বার সম্পন্ন ✅` : `${rounds} rounds completed ✅`}
            </p>
          )}
        </div>

        {/* Completed Message */}
        {completed && (
          <div className="rounded-2xl bg-emerald-600 p-4 text-center mb-4 animate-fadeInUp">
            <p className="text-white font-bold text-lg">مَاشَاءَ اللَّهُ ✨</p>
            <p className="text-emerald-100 text-sm">
              {lang === 'bn' ? 'আলহামদুলিল্লাহ! সম্পন্ন হয়েছে!' : 'Alhamdulillah! Completed!'}
            </p>
          </div>
        )}

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Count Button */}
          <button
            onClick={handleCount}
            className={`col-span-2 rounded-2xl bg-gradient-to-br ${selected.color} p-6 text-white font-bold text-xl shadow-lg active:scale-95 transition-transform`}
          >
            {lang === 'bn' ? '👆 ট্যাপ করুন' : '👆 Tap to Count'}
          </button>

          {/* Reset */}
          <button
            onClick={handleReset}
            className="rounded-xl bg-white/10 hover:bg-white/20 p-4 text-gray-300 font-medium transition-all"
          >
            {lang === 'bn' ? '🔄 রিসেট' : '🔄 Reset'}
          </button>

          {/* Total */}
          <div className="rounded-xl bg-white/5 p-4 text-center">
            <p className="text-gray-400 text-xs">
              {lang === 'bn' ? 'মোট গণনা' : 'Total Count'}
            </p>
            <p className="text-white font-bold text-xl">{totalCount}</p>
          </div>
        </div>

        {/* Tips */}
        <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
          <p className="text-emerald-400 text-xs font-bold mb-2">
            {lang === 'bn' ? '💡 হাদিস' : '💡 Hadith'}
          </p>
          <p className="text-gray-300 text-sm leading-relaxed">
            {lang === 'bn'
              ? '"যে ব্যক্তি প্রতিদিন ১০০ বার সুবহানাল্লাহ বলে, তার ১০০০ নেকি লেখা হয়।" — মুসলিম'
              : '"Whoever says SubhanAllah 100 times a day, 1000 good deeds are recorded for him." — Muslim'}
          </p>
        </div>

      </div>
    </main>
  )
}
