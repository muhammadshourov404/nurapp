'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const SURAHS = [
  { number: 1, name: 'আল-ফাতিহা', nameEn: 'Al-Fatihah', arabic: 'الفاتحة', verses: 7 },
  { number: 2, name: 'আল-বাকারা', nameEn: 'Al-Baqarah', arabic: 'البقرة', verses: 286 },
  { number: 3, name: 'আল-ইমরান', nameEn: 'Al-Imran', arabic: 'آل عمران', verses: 200 },
  { number: 4, name: 'আন-নিসা', nameEn: 'An-Nisa', arabic: 'النساء', verses: 176 },
  { number: 5, name: 'আল-মায়েদা', nameEn: 'Al-Maidah', arabic: 'المائدة', verses: 120 },
  { number: 36, name: 'ইয়া-সিন', nameEn: 'Ya-Sin', arabic: 'يس', verses: 83 },
  { number: 55, name: 'আর-রাহমান', nameEn: 'Ar-Rahman', arabic: 'الرحمن', verses: 78 },
  { number: 56, name: 'আল-ওয়াকিয়া', nameEn: 'Al-Waqiah', arabic: 'الواقعة', verses: 96 },
  { number: 67, name: 'আল-মুলক', nameEn: 'Al-Mulk', arabic: 'الملك', verses: 30 },
  { number: 78, name: 'আন-নাবা', nameEn: 'An-Naba', arabic: 'النبأ', verses: 40 },
  { number: 112, name: 'আল-ইখলাস', nameEn: 'Al-Ikhlas', arabic: 'الإخلاص', verses: 4 },
  { number: 113, name: 'আল-ফালাক', nameEn: 'Al-Falaq', arabic: 'الفلق', verses: 5 },
  { number: 114, name: 'আন-নাস', nameEn: 'An-Nas', arabic: 'الناس', verses: 6 },
]

export default function QuranPage() {
  const [selectedSurah, setSelectedSurah] = useState(null)
  const [verses, setVerses] = useState([])
  const [loading, setLoading] = useState(false)
  const [lang, setLang] = useState('bn')
  const [fontSize, setFontSize] = useState('lg')

  const loadSurah = async (surah) => {
    setSelectedSurah(surah)
    setLoading(true)
    setVerses([])
    try {
      const [arRes, enRes] = await Promise.all([
        fetch(`https://api.alquran.cloud/v1/surah/${surah.number}`),
        fetch(`https://api.alquran.cloud/v1/surah/${surah.number}/en.asad`)
      ])
      const arData = await arRes.json()
      const enData = await enRes.json()

      const combined = arData.data.ayahs.map((ayah, i) => ({
        number: ayah.numberInSurah,
        arabic: ayah.text,
        english: enData.data.ayahs[i]?.text || '',
      }))
      setVerses(combined)
    } catch {
      setVerses([])
    }
    setLoading(false)
  }

  const arabicFontSize = {
    sm: 'text-2xl', lg: 'text-3xl', xl: 'text-4xl'
  }

  return (
    <main className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {selectedSurah ? (
              <button
                onClick={() => setSelectedSurah(null)}
                className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
              >
                ←
              </button>
            ) : (
              <Link href="/nurapp" className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all">
                ←
              </Link>
            )}
            <h1 className="text-lg font-bold text-white">
              {selectedSurah
                ? `${selectedSurah.arabic} — ${lang === 'bn' ? selectedSurah.name : selectedSurah.nameEn}`
                : (lang === 'bn' ? '📖 কোরআন পাঠ' : '📖 Quran Reader')}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {selectedSurah && (
              <div className="flex gap-1">
                {['sm', 'lg', 'xl'].map(s => (
                  <button
                    key={s}
                    onClick={() => setFontSize(s)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${fontSize === s ? 'bg-emerald-600 text-white' : 'bg-white/10 text-gray-400'}`}
                  >
                    {s === 'sm' ? 'A' : s === 'lg' ? 'A' : 'A'}
                  </button>
                ))}
              </div>
            )}
            <button
              onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-sm font-medium transition-all"
            >
              {lang === 'bn' ? 'EN' : 'বাং'}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-6">

        {!selectedSurah ? (
          <>
            {/* Surah List */}
            <div className="mb-6 rounded-2xl gradient-green p-5 text-center">
              <p className="font-arabic text-3xl text-amber-300 mb-2">القرآن الكريم</p>
              <p className="text-emerald-200 text-sm">
                {lang === 'bn' ? 'সূরা নির্বাচন করুন' : 'Select a Surah to read'}
              </p>
            </div>

            <div className="space-y-2">
              {SURAHS.map((surah) => (
                <button
                  key={surah.number}
                  onClick={() => loadSurah(surah)}
                  className="w-full rounded-xl bg-white/5 hover:bg-white/10 p-4 flex items-center justify-between transition-all card-hover"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-emerald-600/30 flex items-center justify-center text-emerald-400 font-bold text-sm">
                      {surah.number}
                    </div>
                    <div className="text-left">
                      <p className="text-white font-bold">
                        {lang === 'bn' ? surah.name : surah.nameEn}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {lang === 'bn' ? `${surah.verses} আয়াত` : `${surah.verses} verses`}
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
                <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-400">{lang === 'bn' ? 'লোড হচ্ছে...' : 'Loading...'}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Bismillah */}
                {selectedSurah.number !== 9 && (
                  <div className="rounded-2xl gradient-green p-5 text-center mb-6">
                    <p className="font-arabic text-3xl text-amber-300">
                      بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
                    </p>
                  </div>
                )}

                {verses.map((verse) => (
                  <div key={verse.number} className="rounded-2xl bg-white/5 p-5 border border-white/10">
                    {/* Verse Number */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-full bg-emerald-600/40 flex items-center justify-center text-emerald-400 text-xs font-bold">
                        {verse.number}
                      </div>
                      <div className="h-px flex-1 bg-white/10"></div>
                    </div>

                    {/* Arabic */}
                    <p className={`font-arabic ${arabicFontSize[fontSize]} text-amber-100 text-right leading-loose mb-4`} dir="rtl">
                      {verse.arabic}
                    </p>

                    {/* Translation */}
                    <p className="text-gray-300 text-sm leading-relaxed border-t border-white/10 pt-3">
                      {verse.english}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}
