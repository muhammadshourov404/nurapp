'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import BottomNav from '../../components/BottomNav'
import {
  ChevronLeftIcon, SearchIcon, BookmarkIcon,
  ChevronDownIcon, ChevronUpIcon, CopyIcon,
  CheckIcon, GridIcon, ListIcon, ArrowRightIcon,
  PlusIcon, MinusIcon, RefreshIcon
} from '../../components/Icons'

export default function QuranPage() {
  const [surahs, setSurahs] = useState([])
  const [selectedSurah, setSelectedSurah] = useState(null)
  const [verses, setVerses] = useState([])
  const [loading, setLoading] = useState(true)
  const [versesLoading, setVersesLoading] = useState(false)
  const [lang, setLang] = useState('bn')
  const [fontSize, setFontSize] = useState(1)
  const [search, setSearch] = useState('')
  const [bookmarks, setBookmarks] = useState([])
  const [copied, setCopied] = useState(null)
  const [viewMode, setViewMode] = useState('list')
  const [showBookmarks, setShowBookmarks] = useState(false)
  const [filter, setFilter] = useState('all')
  const [juzFilter, setJuzFilter] = useState(null)
  const topRef = useRef(null)

  useEffect(() => {
    const savedLang = localStorage.getItem('nurapp_lang') || 'bn'
    setLang(savedLang)
    const savedBm = localStorage.getItem('quran_bookmarks')
    if (savedBm) setBookmarks(JSON.parse(savedBm))
    fetchAllSurahs()
  }, [])

  const fetchAllSurahs = async () => {
    setLoading(true)
    try {
      const res = await fetch('https://api.alquran.cloud/v1/surah')
      const data = await res.json()
      setSurahs(data.data)
    } catch {}
    setLoading(false)
  }

  const loadSurah = async (surah) => {
    setSelectedSurah(surah)
    setVersesLoading(true)
    setVerses([])
    topRef.current?.scrollIntoView({ behavior: 'smooth' })
    try {
      const [arRes, enRes, bnRes] = await Promise.all([
        fetch(`https://api.alquran.cloud/v1/surah/${surah.number}`),
        fetch(`https://api.alquran.cloud/v1/surah/${surah.number}/en.asad`),
        fetch(`https://api.alquran.cloud/v1/surah/${surah.number}/bn.bengali`)
      ])
      const [arData, enData, bnData] = await Promise.all([
        arRes.json(), enRes.json(), bnRes.json()
      ])
      const combined = arData.data.ayahs.map((ayah, i) => ({
        number: ayah.numberInSurah,
        numberInQuran: ayah.number,
        arabic: ayah.text,
        english: enData.data.ayahs[i]?.text || '',
        bangla: bnData.data.ayahs[i]?.text || '',
      }))
      setVerses(combined)
    } catch {}
    setVersesLoading(false)
  }

  const toggleBookmark = (surahNum, verseNum) => {
    const key = `${surahNum}:${verseNum}`
    const updated = bookmarks.includes(key)
      ? bookmarks.filter(b => b !== key)
      : [...bookmarks, key]
    setBookmarks(updated)
    localStorage.setItem('quran_bookmarks', JSON.stringify(updated))
  }

  const copyVerse = (text, key) => {
    navigator.clipboard?.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  const toggleLang = () => {
    const nl = lang === 'bn' ? 'en' : 'bn'
    setLang(nl)
    localStorage.setItem('nurapp_lang', nl)
  }

  const arabicSizes = ['text-xl', 'text-2xl', 'text-3xl', 'text-4xl']
  const translationSizes = ['text-xs', 'text-sm', 'text-base', 'text-lg']

  const filteredSurahs = surahs.filter(s => {
    const matchSearch = s.englishName.toLowerCase().includes(search.toLowerCase()) ||
      s.englishNameTranslation.toLowerCase().includes(search.toLowerCase()) ||
      s.number.toString().includes(search)
    const matchFilter = filter === 'all' || s.revelationType.toLowerCase() === filter
    return matchSearch && matchFilter
  })

  const REVELATION_TYPES = [
    { id: 'all', labelBn: 'সব', labelEn: 'All' },
    { id: 'meccan', labelBn: 'মাক্কী', labelEn: 'Meccan' },
    { id: 'medinan', labelBn: 'মাদানী', labelEn: 'Medinan' },
  ]

  const POPULAR_SURAHS = [1, 2, 18, 36, 55, 56, 67, 112, 113, 114]

  return (
    <main className="min-h-screen pb-28" style={{ background: 'var(--bg-primary)' }}>
      <div ref={topRef}></div>

      {/* Header */}
      <header className="sticky top-0 z-50 header-blur">
        <div className="px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {selectedSurah ? (
              <button onClick={() => { setSelectedSurah(null); setVerses([]) }} className="btn-icon">
                <ChevronLeftIcon size={18} color="var(--text-secondary)" />
              </button>
            ) : (
              <Link href="/" className="btn-icon">
                <ChevronLeftIcon size={18} color="var(--text-secondary)" />
              </Link>
            )}
            <div>
              <h1 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                {selectedSurah
                  ? `${selectedSurah.number}. ${selectedSurah.englishName}`
                  : (lang === 'bn' ? 'কোরআনুল করীম' : 'The Holy Quran')}
              </h1>
              {selectedSurah && (
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {selectedSurah.name} • {selectedSurah.numberOfAyahs} {lang === 'bn' ? 'আয়াত' : 'verses'}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {selectedSurah && (
              <>
                <button onClick={() => setFontSize(Math.max(0, fontSize-1))} className="btn-icon">
                  <MinusIcon size={14} color="var(--text-secondary)" />
                </button>
                <button onClick={() => setFontSize(Math.min(3, fontSize+1))} className="btn-icon">
                  <PlusIcon size={14} color="var(--text-secondary)" />
                </button>
              </>
            )}
            {!selectedSurah && (
              <>
                <button onClick={() => setShowBookmarks(!showBookmarks)} className="btn-icon"
                  style={{ background: showBookmarks ? 'rgba(245,158,11,0.15)' : undefined }}>
                  <BookmarkIcon size={16} color={showBookmarks ? '#f59e0b' : 'var(--text-secondary)'} />
                </button>
                <button onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')} className="btn-icon">
                  {viewMode === 'list'
                    ? <GridIcon size={16} color="var(--text-secondary)" />
                    : <ListIcon size={16} color="var(--text-secondary)" />}
                </button>
              </>
            )}
            <button onClick={toggleLang} className="btn-icon">
              <span className="text-xs font-bold" style={{ color: 'var(--text-secondary)' }}>
                {lang === 'bn' ? 'EN' : 'বাং'}
              </span>
            </button>
          </div>
        </div>
      </header>

      <div className="px-5 pt-5">

        {/* Surah List View */}
        {!selectedSurah && !showBookmarks && (
          <>
            {/* Banner */}
            <div className="arabic-card mb-5 text-center">
              <p className="font-arabic mb-2" style={{ fontSize: '28px', color: '#fde68a' }}>القرآن الكريم</p>
              <p className="text-sm font-semibold" style={{ color: '#10b981' }}>
                {lang === 'bn' ? 'পবিত্র কোরআনুল করীম' : 'The Holy Quran'}
              </p>
              <div className="flex justify-center gap-6 mt-4">
                {[
                  { num: '١١٤', label: lang === 'bn' ? 'সূরা' : 'Surahs' },
                  { num: '٦٢٣٦', label: lang === 'bn' ? 'আয়াত' : 'Verses' },
                  { num: '٣٠', label: lang === 'bn' ? 'পারা' : 'Juz' },
                ].map((s, i) => (
                  <div key={i} className="text-center">
                    <p className="font-arabic text-xl" style={{ color: '#fde68a' }}>{s.num}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Popular Surahs */}
            <div className="mb-5">
              <p className="section-title">{lang === 'bn' ? 'জনপ্রিয় সূরা' : 'Popular Surahs'}</p>
              <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                {surahs.filter(s => POPULAR_SURAHS.includes(s.number)).map(s => (
                  <button key={s.number} onClick={() => loadSurah(s)}
                    className="flex-shrink-0 rounded-xl px-4 py-2.5 text-center transition-all"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', minWidth: '80px' }}>
                    <p className="font-arabic text-sm" style={{ color: '#fde68a' }}>{s.name}</p>
                    <p className="text-xs mt-0.5 font-medium" style={{ color: 'var(--text-muted)' }}>
                      {s.number}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Search */}
            <div className="relative mb-4">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <SearchIcon size={16} color="var(--text-muted)" />
              </div>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={lang === 'bn' ? 'সূরার নাম বা নম্বর লিখুন...' : 'Search by name or number...'}
                className="input-field"
                style={{ paddingLeft: '44px' }}
              />
            </div>

            {/* Filter */}
            <div className="flex gap-2 mb-4">
              {REVELATION_TYPES.map(t => (
                <button key={t.id} onClick={() => setFilter(t.id)}
                  className="px-4 py-2 rounded-xl text-xs font-bold transition-all border"
                  style={{
                    background: filter === t.id ? 'rgba(16,185,129,0.15)' : 'transparent',
                    color: filter === t.id ? '#10b981' : 'var(--text-muted)',
                    borderColor: filter === t.id ? 'rgba(16,185,129,0.3)' : 'var(--border)'
                  }}>
                  {lang === 'bn' ? t.labelBn : t.labelEn}
                </button>
              ))}
              <p className="ml-auto self-center text-xs" style={{ color: 'var(--text-muted)' }}>
                {filteredSurahs.length} {lang === 'bn' ? 'সূরা' : 'surahs'}
              </p>
            </div>

            {/* Surah List */}
            {loading ? (
              <div className="space-y-2">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="shimmer h-16 rounded-2xl"></div>
                ))}
              </div>
            ) : viewMode === 'list' ? (
              <div className="space-y-2">
                {filteredSurahs.map((surah, i) => (
                  <button key={surah.number} onClick={() => loadSurah(surah)}
                    className="w-full rounded-2xl p-4 flex items-center justify-between transition-all animate-fadeInUp"
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border)',
                      animationDelay: `${Math.min(i, 10) * 0.03}s`,
                      animationFillMode: 'forwards',
                      opacity: 0
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-card-hover)'; e.currentTarget.style.borderColor = 'rgba(16,185,129,0.2)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.borderColor = 'var(--border)' }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.15)' }}>
                        <span className="text-xs font-bold" style={{ color: '#10b981', fontFamily: 'Inter' }}>
                          {surah.number}
                        </span>
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                          {surah.englishName}
                        </p>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                          {surah.englishNameTranslation} •{' '}
                          <span className={surah.revelationType === 'Meccan' ? 'text-amber-500' : 'text-blue-400'}>
                            {lang === 'bn'
                              ? surah.revelationType === 'Meccan' ? 'মাক্কী' : 'মাদানী'
                              : surah.revelationType}
                          </span>
                          {' '}• {surah.numberOfAyahs} {lang === 'bn' ? 'আয়াত' : 'verses'}
                        </p>
                      </div>
                    </div>
                    <p className="font-arabic text-xl" style={{ color: '#fde68a' }}>{surah.name}</p>
                  </button>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {filteredSurahs.map((surah, i) => (
                  <button key={surah.number} onClick={() => loadSurah(surah)}
                    className="rounded-2xl p-3 text-center transition-all animate-fadeInUp"
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border)',
                      animationDelay: `${Math.min(i, 10) * 0.03}s`,
                      animationFillMode: 'forwards',
                      opacity: 0
                    }}>
                    <p className="text-xs font-bold mb-1" style={{ color: 'var(--text-muted)', fontFamily: 'Inter' }}>
                      {surah.number}
                    </p>
                    <p className="font-arabic text-lg" style={{ color: '#fde68a' }}>{surah.name}</p>
                    <p className="text-xs mt-1 font-medium truncate" style={{ color: 'var(--text-secondary)' }}>
                      {surah.englishName}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {surah.numberOfAyahs}v
                    </p>
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        {/* Bookmarks View */}
        {showBookmarks && !selectedSurah && (
          <div>
            <p className="section-title">{lang === 'bn' ? 'বুকমার্ক করা আয়াত' : 'Bookmarked Verses'}</p>
            {bookmarks.length === 0 ? (
              <div className="text-center py-16 rounded-3xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <BookmarkIcon size={40} color="var(--text-muted)" />
                <p className="mt-4 font-semibold" style={{ color: 'var(--text-secondary)' }}>
                  {lang === 'bn' ? 'কোনো বুকমার্ক নেই' : 'No bookmarks yet'}
                </p>
                <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                  {lang === 'bn' ? 'আয়াতের পাশে বুকমার্ক আইকনে চাপুন' : 'Tap bookmark icon on any verse'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {bookmarks.map((bm, i) => {
                  const [sNum, vNum] = bm.split(':')
                  return (
                    <div key={i} className="card p-4">
                      <p className="text-sm font-semibold" style={{ color: '#10b981' }}>
                        {lang === 'bn' ? `সূরা ${sNum} • আয়াত ${vNum}` : `Surah ${sNum} • Verse ${vNum}`}
                      </p>
                      <button
                        onClick={() => {
                          const s = surahs.find(s => s.number === parseInt(sNum))
                          if (s) { setShowBookmarks(false); loadSurah(s) }
                        }}
                        className="mt-2 text-xs font-semibold flex items-center gap-1"
                        style={{ color: 'var(--text-muted)' }}>
                        {lang === 'bn' ? 'সূরায় যান' : 'Go to Surah'}
                        <ArrowRightIcon size={11} color="var(--text-muted)" />
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Surah Reading View */}
        {selectedSurah && (
          <>
            {versesLoading ? (
              <div className="space-y-4">
                <div className="shimmer h-24 rounded-2xl"></div>
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="shimmer h-40 rounded-2xl"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {/* Surah Header */}
                <div className="arabic-card text-center">
                  <p className="font-arabic text-3xl mb-2" style={{ color: '#fde68a' }}>{selectedSurah.name}</p>
                  <p className="font-bold" style={{ color: 'var(--text-primary)' }}>{selectedSurah.englishName}</p>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{selectedSurah.englishNameTranslation}</p>
                  <div className="flex justify-center gap-3 mt-3">
                    <span className="badge badge-emerald">{selectedSurah.numberOfAyahs} {lang === 'bn' ? 'আয়াত' : 'Verses'}</span>
                    <span className={`badge ${selectedSurah.revelationType === 'Meccan' ? 'badge-gold' : 'badge-blue'}`}>
                      {lang === 'bn'
                        ? selectedSurah.revelationType === 'Meccan' ? 'মাক্কী' : 'মাদানী'
                        : selectedSurah.revelationType}
                    </span>
                  </div>
                </div>

                {/* Bismillah */}
                {selectedSurah.number !== 9 && selectedSurah.number !== 1 && (
                  <div className="text-center rounded-2xl p-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                    <p className="font-arabic text-2xl" style={{ color: '#fde68a' }}>
                      بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
                    </p>
                  </div>
                )}

                {/* Verses */}
                {verses.map((verse, i) => {
                  const bmKey = `${selectedSurah.number}:${verse.number}`
                  const isBookmarked = bookmarks.includes(bmKey)
                  return (
                    <div key={verse.number}
                      className="overflow-hidden animate-fadeInUp"
                      style={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border)',
                        borderRadius: '20px',
                        animationDelay: `${Math.min(i, 5) * 0.05}s`,
                        animationFillMode: 'forwards',
                        opacity: 0
                      }}>
                      {/* Verse Header */}
                      <div className="flex items-center justify-between px-4 py-3"
                        style={{ borderBottom: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)' }}>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center"
                          style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
                          <span className="text-xs font-bold" style={{ color: '#10b981', fontFamily: 'Inter' }}>
                            {verse.number}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => copyVerse(verse.arabic, bmKey)} className="btn-icon" style={{ width: '32px', height: '32px' }}>
                            {copied === bmKey
                              ? <CheckIcon size={13} color="#10b981" />
                              : <CopyIcon size={13} color="var(--text-muted)" />}
                          </button>
                          <button onClick={() => toggleBookmark(selectedSurah.number, verse.number)}
                            className="btn-icon" style={{ width: '32px', height: '32px' }}>
                            <BookmarkIcon size={13} color={isBookmarked ? '#f59e0b' : 'var(--text-muted)'} filled={isBookmarked} />
                          </button>
                        </div>
                      </div>

                      <div className="p-5">
                        {/* Arabic */}
                        <p className={`font-arabic ${arabicSizes[fontSize]} leading-loose text-right mb-5`}
                          style={{ color: '#f1e8c8' }} dir="rtl">
                          {verse.arabic}
                        </p>

                        {/* Bangla */}
                        {verse.bangla && (
                          <div className="mb-4 pb-4" style={{ borderBottom: '1px solid var(--border)' }}>
                            <p className="text-xs font-bold mb-2 uppercase tracking-wider" style={{ color: '#10b981' }}>
                              {lang === 'bn' ? 'বাংলা অনুবাদ' : 'Bengali Translation'}
                            </p>
                            <p className={`${translationSizes[fontSize]} leading-relaxed`}
                              style={{ color: 'var(--text-secondary)' }}>
                              {verse.bangla}
                            </p>
                          </div>
                        )}

                        {/* English */}
                        <div>
                          <p className="text-xs font-bold mb-2 uppercase tracking-wider" style={{ color: '#60a5fa' }}>
                            English
                          </p>
                          <p className={`${translationSizes[fontSize]} leading-relaxed italic`}
                            style={{ color: 'var(--text-muted)' }}>
                            {verse.english}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}

                {/* Footer Credit */}
                <div className="text-center py-4">
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {lang === 'bn' ? 'অনুবাদ সূত্র: alquran.cloud API' : 'Translation source: alquran.cloud API'}
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <BottomNav lang={lang} />
    </main>
  )
}
