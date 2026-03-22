'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const SURAHS = [
  { number: 1, name: 'আল-ফাতিহা', nameEn: 'Al-Fatihah', arabic: 'الفاتحة', verses: 7, type: 'মাক্কী' },
  { number: 2, name: 'আল-বাকারা', nameEn: 'Al-Baqarah', arabic: 'البقرة', verses: 286, type: 'মাদানী' },
  { number: 3, name: 'আল-ইমরান', nameEn: 'Al-Imran', arabic: 'آل عمران', verses: 200, type: 'মাদানী' },
  { number: 4, name: 'আন-নিসা', nameEn: 'An-Nisa', arabic: 'النساء', verses: 176, type: 'মাদানী' },
  { number: 5, name: 'আল-মায়েদা', nameEn: 'Al-Maidah', arabic: 'المائدة', verses: 120, type: 'মাদানী' },
  { number: 18, name: 'আল-কাহফ', nameEn: 'Al-Kahf', arabic: 'الكهف', verses: 110, type: 'মাক্কী' },
  { number: 36, name: 'ইয়া-সিন', nameEn: 'Ya-Sin', arabic: 'يس', verses: 83, type: 'মাক্কী' },
  { number: 55, name: 'আর-রাহমান', nameEn: 'Ar-Rahman', arabic: 'الرحمن', verses: 78, type: 'মাদানী' },
  { number: 56, name: 'আল-ওয়াকিয়া', nameEn: 'Al-Waqiah', arabic: 'الواقعة', verses: 96, type: 'মাক্কী' },
  { number: 67, name: 'আল-মুলক', nameEn: 'Al-Mulk', arabic: 'الملك', verses: 30, type: 'মাক্কী' },
  { number: 78, name: 'আন-নাবা', nameEn: 'An-Naba', arabic: 'النبأ', verses: 40, type: 'মাক্কী' },
  { number: 112, name: 'আল-ইখলাস', nameEn: 'Al-Ikhlas', arabic: 'الإخلاص', verses: 4, type: 'মাক্কী' },
  { number: 113, name: 'আল-ফালাক', nameEn: 'Al-Falaq', arabic: 'الفلق', verses: 5, type: 'মাক্কী' },
  { number: 114, name: 'আন-নাস', nameEn: 'An-Nas', arabic: 'الناس', verses: 6, type: 'মাক্কী' },
]

export default function QuranPage() {
  const [selectedSurah, setSelectedSurah] = useState(null)
  const [verses, setVerses] = useState([])
  const [loading, setLoading] = useState(false)
  const [lang, setLang] = useState('bn')
  const [fontSize, setFontSize] = useState(1)
  const [search, setSearch] = useState('')
  const [bookmarks, setBookmarks] = useState([])
  const [showBookmarks, setShowBookmarks] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('quran_bookmarks')
    if (saved) setBookmarks(JSON.parse(saved))
  }, [])

  const loadSurah = async (surah) => {
    setSelectedSurah(surah)
    setLoading(true)
    setVerses([])
    try {
      const [arRes, enRes, bnRes] = await Promise.all([
        fetch(`https://api.alquran.cloud/v1/surah/${surah.number}`),
        fetch(`https://api.alquran.cloud/v1/surah/${surah.number}/en.asad`),
        fetch(`https://api.alquran.cloud/v1/surah/${surah.number}/bn.bengali`)
      ])
      const [arData, enData, bnData] = await Promise.all([arRes.json(), enRes.json(), bnRes.json()])
      const combined = arData.data.ayahs.map((ayah, i) => ({
        number: ayah.numberInSurah,
        arabic: ayah.text,
        english: enData.data.ayahs[i]?.text || '',
        bangla: bnData.data.ayahs[i]?.text || '',
      }))
      setVerses(combined)
    } catch { setVerses([]) }
    setLoading(false)
  }

  const toggleBookmark = (surahNum, verseNum) => {
    const key = `${surahNum}:${verseNum}`
    const updated = bookmarks.includes(key)
      ? bookmarks.filter(b => b !== key)
      : [...bookmarks, key]
    setBookmarks(updated)
    localStorage.setItem('quran_bookmarks', JSON.stringify(updated))
  }

  const filteredSurahs = SURAHS.filter(s =>
    s.name.includes(search) || s.nameEn.toLowerCase().includes(search.toLowerCase()) || s.arabic.includes(search)
  )

  const arabicSize = ['text-2xl', 'text-3xl', 'text-4xl'][fontSize]
  const translationSize = ['text-xs', 'text-sm', 'text-base'][fontSize]

  return (
    <main className="min-h-screen bg-gray-950 pb-24">
      <header className="sticky top-0 z-50 bg-gray-950/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {selectedSurah ? (
              <button onClick={() => { setSelectedSurah(null); setVerses([]) }}
                className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all text-lg">←</button>
            ) : (
              <Link href="/" className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all text-lg">←</Link>
            )}
            <h1 className="text-base font-bold text-white truncate">
              {selectedSurah
                ? `${selectedSurah.arabic} — ${lang === 'bn' ? selectedSurah.name : selectedSurah.nameEn}`
                : (lang === 'bn' ? '📖 কোরআন পাঠ' : '📖 Quran Reader')}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {selectedSurah && (
              <div className="flex items-center gap-1 bg-white/10 rounded-lg p-1">
                <button onClick={() => setFontSize(Math.max(0, fontSize-1))}
                  className="w-7 h-7 rounded-md bg-white/10 text-white text-xs font-bold">A-</button>
                <button onClick={() => setFontSize(Math.min(2, fontSize+1))}
                  className="w-7 h-7 rounded-md bg-white/10 text-white text-sm font-bold">A+</button>
              </div>
            )}
            <button onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
              className="px-3 py-1.5 rounded-lg bg-white/10 text-xs font-bold border border-white/10">
              {lang === 'bn' ? 'EN' : 'বাং'}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-5">
        {!selectedSurah ? (
          <>
            {/* Banner */}
            <div className="rounded-2xl bg-gradient-to-br from-emerald-900 to-teal-950 border border-emerald-700/30 p-5 text-center mb-5">
              <p className="font-arabic text-3xl text-amber-300 mb-1">القرآن الكريم</p>
              <p className="text-emerald-300 text-sm">{lang === 'bn' ? 'পবিত্র কোরআনুল করীম' : 'The Holy Quran'}</p>
              <div className="flex justify-center gap-4 mt-3">
                <div className="text-center">
                  <p className="text-white font-bold">১১৪</p>
                  <p className="text-gray-400 text-xs">{lang === 'bn' ? 'সূরা' : 'Surahs'}</p>
                </div>
                <div className="w-px bg-white/20"></div>
                <div className="text-center">
                  <p className="text-white font-bold">৬২৩৬</p>
                  <p className="text-gray-400 text-xs">{lang === 'bn' ? 'আয়াত' : 'Verses'}</p>
                </div>
                <div className="w-px bg-white/20"></div>
                <div className="text-center">
                  <p className="text-white font-bold">৩০</p>
                  <p className="text-gray-400 text-xs">{lang === 'bn' ? 'পারা' : 'Juz'}</p>
                </div>
              </div>
            </div>

            {/* Search */}
            <div className="relative mb-4">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={lang === 'bn' ? '🔍 সূরা খুঁজুন...' : '🔍 Search surah...'}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Surah List */}
            <div className="space-y-2">
              {filteredSurahs.map(surah => (
                <button key={surah.number} onClick={() => loadSurah(surah)}
                  className="w-full rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 p-4 flex items-center justify-between transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-600/30 flex items-center justify-center text-emerald-400 font-bold text-sm">
                      {surah.number}
                    </div>
                    <div className="text-left">
                      <p className="text-white font-bold text-sm">{lang === 'bn' ? surah.name : surah.nameEn}</p>
                      <p className="text-gray-500 text-xs">
                        {surah.type} • {surah.verses}{lang === 'bn' ? ' আয়াত' : ' verses'}
                      </p>
                    </div>
                  </div>
                  <p className="font-arabic text-xl text-amber-300">{surah.arabic}</p>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            {loading ? (
              <div className="text-center py-20">
                <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-gray-400 text-sm">{lang === 'bn' ? 'লোড হচ্ছে...' : 'Loading...'}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Surah Info */}
                <div className="rounded-2xl bg-gradient-to-br from-emerald-900 to-teal-950 border border-emerald-700/30 p-4 text-center">
                  <p className="font-arabic text-2xl text-amber-300">{selectedSurah.arabic}</p>
                  <p className="text-white font-bold mt-1">{lang === 'bn' ? selectedSurah.name : selectedSurah.nameEn}</p>
                  <p className="text-emerald-300 text-xs mt-1">{selectedSurah.type} • {selectedSurah.verses}{lang === 'bn' ? ' আয়াত' : ' verses'}</p>
                </div>

                {/* Bismillah */}
                {selectedSurah.number !== 9 && (
                  <div className="rounded-xl bg-white/5 border border-white/10 p-4 text-center">
                    <p className="font-arabic text-2xl text-amber-200">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</p>
                  </div>
                )}

                {verses.map(verse => {
                  const isBookmarked = bookmarks.includes(`${selectedSurah.number}:${verse.number}`)
                  return (
                    <div key={verse.number} className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
                      {/* Verse Header */}
                      <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-white/5">
                        <div className="w-7 h-7 rounded-full bg-emerald-600/30 flex items-center justify-center text-emerald-400 text-xs font-bold">
                          {verse.number}
                        </div>
                        <button onClick={() => toggleBookmark(selectedSurah.number, verse.number)}
                          className={`text-lg transition-all ${isBookmarked ? 'text-amber-400' : 'text-gray-600 hover:text-gray-400'}`}>
                          {isBookmarked ? '🔖' : '🏷️'}
                        </button>
                      </div>

                      {/* Arabic */}
                      <div className="p-4">
                        <p className={`font-arabic ${arabicSize} text-amber-100 text-right leading-loose mb-4`} dir="rtl">
                          {verse.arabic}
                        </p>

                        {/* Bangla */}
                        {lang === 'bn' && verse.bangla && (
                          <div className="border-t border-white/10 pt-3 mb-2">
                            <p className="text-xs text-emerald-400 font-bold mb-1">বাংলা অনুবাদ</p>
                            <p className={`text-gray-200 ${translationSize} leading-relaxed`}>{verse.bangla}</p>
                          </div>
                        )}

                        {/* English */}
                        <div className="border-t border-white/10 pt-3">
                          <p className="text-xs text-blue-400 font-bold mb-1">English</p>
                          <p className={`text-gray-300 ${translationSize} leading-relaxed italic`}>{verse.english}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
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
              className={`flex flex-col items-center gap-1 px-2 py-1 rounded-xl transition-all ${item.href === '/quran' ? 'bg-emerald-600/20' : 'hover:bg-white/10'}`}>
              <span className="text-xl">{item.icon}</span>
              <span className={`text-xs ${item.href === '/quran' ? 'text-emerald-400' : 'text-gray-400'}`}>{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </main>
  )
}
