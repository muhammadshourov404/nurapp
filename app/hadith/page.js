'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import BottomNav from '../../components/BottomNav'
import {
  ChevronLeftIcon, SearchIcon, HeartIcon,
  ChevronDownIcon, ChevronUpIcon, CopyIcon,
  CheckIcon, ArrowRightIcon, FilterIcon, BookmarkIcon
} from '../../components/Icons'

const HADITH_BOOKS = [
  { id: 'bukhari', nameBn: 'সহিহ বুখারি', nameEn: 'Sahih Bukhari', author: 'ইমাম বুখারি (র)', total: 7563, color: '#10b981', api: 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ben-bukhari' },
  { id: 'muslim', nameBn: 'সহিহ মুসলিম', nameEn: 'Sahih Muslim', author: 'ইমাম মুসলিম (র)', total: 3033, color: '#8b5cf6', api: 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ben-muslim' },
  { id: 'abudawud', nameBn: 'সুনান আবু দাউদ', nameEn: 'Sunan Abu Dawud', author: 'ইমাম আবু দাউদ (র)', total: 5274, color: '#f59e0b', api: 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ben-abudawud' },
  { id: 'tirmidhi', nameBn: 'জামে তিরমিযি', nameEn: 'Jami at-Tirmidhi', author: 'ইমাম তিরমিযি (র)', total: 3956, color: '#3b82f6', api: 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ben-tirmidhi' },
  { id: 'nasai', nameBn: "সুনান নাসাই", nameEn: "Sunan an-Nasa'i", author: "ইমাম নাসাই (র)", total: 5758, color: '#ec4899', api: "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ben-nasai" },
  { id: 'ibnmajah', nameBn: 'সুনান ইবনে মাজাহ', nameEn: 'Sunan Ibn Majah', author: 'ইমাম ইবনে মাজাহ (র)', total: 4341, color: '#f97316', api: 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ben-ibnmajah' },
]

const HADITH_TOPICS = [
  { id: 'iman', bn: 'ঈমান', en: 'Faith' },
  { id: 'salah', bn: 'নামাজ', en: 'Prayer' },
  { id: 'zakat', bn: 'যাকাত', en: 'Zakat' },
  { id: 'sawm', bn: 'রোজা', en: 'Fasting' },
  { id: 'hajj', bn: 'হজ', en: 'Hajj' },
  { id: 'quran', bn: 'কোরআন', en: 'Quran' },
  { id: 'akhlaq', bn: 'আখলাক', en: 'Character' },
  { id: 'dua', bn: 'দোয়া', en: 'Supplication' },
]

// Curated important hadiths
const FEATURED_HADITHS = [
  {
    id: 1,
    arabic: 'إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى',
    bangla: 'নিশ্চয়ই কাজের ফলাফল নিয়তের উপর নির্ভরশীল এবং প্রত্যেক ব্যক্তি তাই পাবে যা সে নিয়ত করে।',
    english: 'Actions are judged by intentions, so each man will have what he intended.',
    source: 'সহিহ বুখারি ও মুসলিম',
    sourceEn: 'Sahih Bukhari & Muslim',
    narrator: 'উমর ইবনুল খাত্তাব (রা)',
    narratorEn: 'Umar ibn al-Khattab (RA)',
    topic: 'ঈমান',
    grade: 'সহিহ',
  },
  {
    id: 2,
    arabic: 'الدِّينُ النَّصِيحَةُ',
    bangla: 'দ্বীন হলো কল্যাণকামিতা।',
    english: 'The religion is sincere advice.',
    source: 'সহিহ মুসলিম',
    sourceEn: 'Sahih Muslim',
    narrator: 'তামিম আদ-দারি (রা)',
    narratorEn: 'Tamim ad-Dari (RA)',
    topic: 'ঈমান',
    grade: 'সহিহ',
  },
  {
    id: 3,
    arabic: 'الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ',
    bangla: 'মুসলিম সে, যার জিভ ও হাত থেকে অন্য মুসলিম নিরাপদ।',
    english: 'A Muslim is the one from whose tongue and hands other Muslims are safe.',
    source: 'সহিহ বুখারি',
    sourceEn: 'Sahih Bukhari',
    narrator: 'আবদুল্লাহ ইবনে আমর (রা)',
    narratorEn: "Abdullah ibn 'Amr (RA)",
    topic: 'আখলাক',
    grade: 'সহিহ',
  },
  {
    id: 4,
    arabic: 'لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ',
    bangla: 'তোমাদের কেউ পূর্ণ মুমিন হবে না যতক্ষণ না সে তার ভাইয়ের জন্য তাই পছন্দ করে যা সে নিজের জন্য পছন্দ করে।',
    english: 'None of you will believe until he loves for his brother what he loves for himself.',
    source: 'সহিহ বুখারি ও মুসলিম',
    sourceEn: 'Sahih Bukhari & Muslim',
    narrator: 'আনাস ইবনে মালিক (রা)',
    narratorEn: 'Anas ibn Malik (RA)',
    topic: 'ঈমান',
    grade: 'সহিহ',
  },
  {
    id: 5,
    arabic: 'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ',
    bangla: 'তোমাদের মধ্যে সর্বোত্তম সে, যে কোরআন শিক্ষা করে এবং অপরকে শিক্ষা দেয়।',
    english: 'The best of you are those who learn the Quran and teach it.',
    source: 'সহিহ বুখারি',
    sourceEn: 'Sahih Bukhari',
    narrator: 'উসমান ইবনে আফফান (রা)',
    narratorEn: 'Uthman ibn Affan (RA)',
    topic: 'কোরআন',
    grade: 'সহিহ',
  },
  {
    id: 6,
    arabic: 'طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ',
    bangla: 'প্রতিটি মুসলিমের জন্য জ্ঞান অর্জন করা ফরজ।',
    english: 'Seeking knowledge is an obligation upon every Muslim.',
    source: 'সুনান ইবনে মাজাহ',
    sourceEn: 'Sunan Ibn Majah',
    narrator: 'আনাস ইবনে মালিক (রা)',
    narratorEn: 'Anas ibn Malik (RA)',
    topic: 'ঈমান',
    grade: 'সহিহ',
  },
  {
    id: 7,
    arabic: 'الصَّلَاةُ عِمَادُ الدِّينِ فَمَنْ أَقَامَهَا فَقَدْ أَقَامَ الدِّينَ وَمَنْ تَرَكَهَا فَقَدْ هَدَمَ الدِّينَ',
    bangla: 'নামাজ দ্বীনের স্তম্ভ। যে নামাজ কায়েম করল সে দ্বীন কায়েম করল, আর যে নামাজ ছেড়ে দিল সে দ্বীন ভেঙে দিল।',
    english: 'Prayer is the pillar of religion. Whoever establishes it has established the religion, and whoever abandons it has demolished the religion.',
    source: 'বায়হাকি',
    sourceEn: 'Al-Bayhaqi',
    narrator: 'মুআয ইবনে জাবাল (রা)',
    narratorEn: "Mu'adh ibn Jabal (RA)",
    topic: 'নামাজ',
    grade: 'হাসান',
  },
  {
    id: 8,
    arabic: 'اتَّقِ اللَّهَ حَيْثُمَا كُنْتَ وَأَتْبِعِ السَّيِّئَةَ الْحَسَنَةَ تَمْحُهَا وَخَالِقِ النَّاسَ بِخُلُقٍ حَسَنٍ',
    bangla: 'যেখানেই থাকো আল্লাহকে ভয় করো। মন্দের পর ভালো করো, তা মন্দকে মুছে দেবে। আর মানুষের সাথে সুন্দর আচরণ করো।',
    english: 'Fear Allah wherever you are, and follow up a bad deed with a good one and it will wipe it out, and behave well towards people.',
    source: 'সুনান তিরমিযি',
    sourceEn: 'Sunan at-Tirmidhi',
    narrator: 'মুআয ইবনে জাবাল (রা)',
    narratorEn: "Mu'adh ibn Jabal (RA)",
    topic: 'আখলাক',
    grade: 'হাসান',
  },
  {
    id: 9,
    arabic: 'مَنْ صَامَ رَمَضَانَ إِيمَانًا وَاحْتِسَابًا غُفِرَ لَهُ مَا تَقَدَّمَ مِنْ ذَنْبِهِ',
    bangla: 'যে ব্যক্তি ঈমানের সাথে ও সওয়াবের আশায় রমজান মাসে রোজা রাখে, তার পূর্ববর্তী গুনাহ মাফ করা হয়।',
    english: 'Whoever fasts during Ramadan out of sincere faith and hoping to attain reward, then all his past sins will be forgiven.',
    source: 'সহিহ বুখারি ও মুসলিম',
    sourceEn: 'Sahih Bukhari & Muslim',
    narrator: 'আবু হুরায়রা (রা)',
    narratorEn: 'Abu Hurairah (RA)',
    topic: 'রোজা',
    grade: 'সহিহ',
  },
  {
    id: 10,
    arabic: 'مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ',
    bangla: 'যে আল্লাহ ও পরকালে বিশ্বাস রাখে, সে যেন ভালো কথা বলে, নইলে চুপ থাকে।',
    english: 'Whoever believes in Allah and the Last Day should say what is good or remain silent.',
    source: 'সহিহ বুখারি ও মুসলিম',
    sourceEn: 'Sahih Bukhari & Muslim',
    narrator: 'আবু হুরায়রা (রা)',
    narratorEn: 'Abu Hurairah (RA)',
    topic: 'আখলাক',
    grade: 'সহিহ',
  },
  {
    id: 11,
    arabic: 'إِنَّ اللَّهَ لَا يَنْظُرُ إِلَى صُوَرِكُمْ وَأَمْوَالِكُمْ وَلَكِنْ يَنْظُرُ إِلَى قُلُوبِكُمْ وَأَعْمَالِكُمْ',
    bangla: 'আল্লাহ তোমাদের চেহারা ও সম্পদের দিকে তাকান না, বরং তিনি তোমাদের অন্তর ও আমলের দিকে তাকান।',
    english: 'Allah does not look at your appearance or wealth, but He looks at your hearts and deeds.',
    source: 'সহিহ মুসলিম',
    sourceEn: 'Sahih Muslim',
    narrator: 'আবু হুরায়রা (রা)',
    narratorEn: 'Abu Hurairah (RA)',
    topic: 'ঈমান',
    grade: 'সহিহ',
  },
  {
    id: 12,
    arabic: 'الْمُؤْمِنُ لِلْمُؤْمِنِ كَالْبُنْيَانِ يَشُدُّ بَعْضُهُ بَعْضًا',
    bangla: 'একজন মুমিন অন্য মুমিনের জন্য একটি ইমারতের মতো, যার একাংশ অপর অংশকে শক্তিশালী করে।',
    english: 'A believer to another believer is like a building whose different parts enforce each other.',
    source: 'সহিহ বুখারি ও মুসলিম',
    sourceEn: 'Sahih Bukhari & Muslim',
    narrator: 'আবু মুসা আল-আশআরি (রা)',
    narratorEn: "Abu Musa al-Ash'ari (RA)",
    topic: 'আখলাক',
    grade: 'সহিহ',
  },
  {
    id: 13,
    arabic: 'مَنْ أَحَبَّ لِقَاءَ اللَّهِ أَحَبَّ اللَّهُ لِقَاءَهُ',
    bangla: 'যে আল্লাহর সাক্ষাৎ পছন্দ করে, আল্লাহও তার সাক্ষাৎ পছন্দ করেন।',
    english: 'Whoever loves to meet Allah, Allah loves to meet him.',
    source: 'সহিহ বুখারি ও মুসলিম',
    sourceEn: 'Sahih Bukhari & Muslim',
    narrator: 'আয়েশা (রা)',
    narratorEn: "Aisha (RA)",
    topic: 'ঈমান',
    grade: 'সহিহ',
  },
  {
    id: 14,
    arabic: 'أَفْضَلُ الصَّلَاةِ بَعْدَ الْفَرِيضَةِ صَلَاةُ اللَّيْلِ',
    bangla: 'ফরজ নামাজের পর সর্বোত্তম নামাজ হলো রাতের নামাজ (তাহাজ্জুদ)।',
    english: 'The best prayer after the obligatory prayers is the night prayer.',
    source: 'সহিহ মুসলিম',
    sourceEn: 'Sahih Muslim',
    narrator: 'আবু হুরায়রা (রা)',
    narratorEn: 'Abu Hurairah (RA)',
    topic: 'নামাজ',
    grade: 'সহিহ',
  },
  {
    id: 15,
    arabic: 'الْكَلِمَةُ الطَّيِّبَةُ صَدَقَةٌ',
    bangla: 'ভালো কথা বলাও একটি সদকা।',
    english: 'A good word is a form of charity.',
    source: 'সহিহ বুখারি ও মুসলিম',
    sourceEn: 'Sahih Bukhari & Muslim',
    narrator: 'আবু হুরায়রা (রা)',
    narratorEn: 'Abu Hurairah (RA)',
    topic: 'আখলাক',
    grade: 'সহিহ',
  },
]

export default function HadithPage() {
  const [lang, setLang] = useState('bn')
  const [search, setSearch] = useState('')
  const [selectedBook, setSelectedBook] = useState(null)
  const [selectedTopic, setSelectedTopic] = useState('all')
  const [expandedHadith, setExpandedHadith] = useState(null)
  const [favorites, setFavorites] = useState([])
  const [showFav, setShowFav] = useState(false)
  const [copied, setCopied] = useState(null)
  const [hadithNum, setHadithNum] = useState('')
  const [fetchedHadith, setFetchedHadith] = useState(null)
  const [fetchLoading, setFetchLoading] = useState(false)
  const [fetchError, setFetchError] = useState('')
  const [tab, setTab] = useState('featured')

  useEffect(() => {
    const savedLang = localStorage.getItem('nurapp_lang') || 'bn'
    setLang(savedLang)
    const savedFav = localStorage.getItem('hadith_favorites')
    if (savedFav) setFavorites(JSON.parse(savedFav))
  }, [])

  const toggleLang = () => {
    const nl = lang === 'bn' ? 'en' : 'bn'
    setLang(nl)
    localStorage.setItem('nurapp_lang', nl)
  }

  const toggleFav = (id) => {
    const updated = favorites.includes(id)
      ? favorites.filter(f => f !== id)
      : [...favorites, id]
    setFavorites(updated)
    localStorage.setItem('hadith_favorites', JSON.stringify(updated))
  }

  const copyHadith = (text, id) => {
    navigator.clipboard?.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const fetchHadithByNumber = async () => {
    if (!selectedBook || !hadithNum) return
    setFetchLoading(true)
    setFetchError('')
    setFetchedHadith(null)
    try {
      const res = await fetch(`${selectedBook.api}/hadiths/${hadithNum}.json`)
      const data = await res.json()
      if (data.hadiths && data.hadiths[0]) {
        setFetchedHadith(data.hadiths[0])
      } else {
        setFetchError(lang === 'bn' ? 'হাদিসটি পাওয়া যায়নি' : 'Hadith not found')
      }
    } catch {
      setFetchError(lang === 'bn' ? 'লোড করতে সমস্যা হয়েছে' : 'Failed to load')
    }
    setFetchLoading(false)
  }

  const filteredHadiths = FEATURED_HADITHS.filter(h => {
    const matchTopic = selectedTopic === 'all' || h.topic === HADITH_TOPICS.find(t => t.id === selectedTopic)?.bn
    const matchSearch = search === '' ||
      h.bangla.includes(search) ||
      h.english.toLowerCase().includes(search.toLowerCase()) ||
      h.arabic.includes(search)
    const matchFav = !showFav || favorites.includes(h.id)
    return matchTopic && matchSearch && matchFav
  })

  const gradeColor = { 'সহিহ': '#10b981', 'হাসান': '#f59e0b', 'যঈফ': '#ef4444' }

  return (
    <main className="min-h-screen pb-28" style={{ background: 'var(--bg-primary)' }}>

      {/* Header */}
      <header className="sticky top-0 z-50 header-blur">
        <div className="px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="btn-icon">
              <ChevronLeftIcon size={18} color="var(--text-secondary)" />
            </Link>
            <div>
              <h1 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                {lang === 'bn' ? 'হাদিস সংগ্রহ' : 'Hadith Collection'}
              </h1>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {lang === 'bn' ? 'বিশুদ্ধ হাদিসের ভান্ডার' : 'Authentic Hadith Library'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowFav(!showFav)} className="btn-icon"
              style={{ background: showFav ? 'rgba(239,68,68,0.15)' : undefined }}>
              <HeartIcon size={16} color={showFav ? '#ef4444' : 'var(--text-secondary)'} filled={showFav} />
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

        {/* Tabs */}
        <div className="flex gap-2 mb-5 overflow-x-auto scrollbar-hide">
          {[
            { id: 'featured', bn: 'বিশেষ হাদিস', en: 'Featured' },
            { id: 'books', bn: 'হাদিস গ্রন্থ', en: 'Books' },
            { id: 'search', bn: 'নম্বর অনুযায়ী', en: 'By Number' },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className="flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all border"
              style={{
                background: tab === t.id ? 'rgba(16,185,129,0.15)' : 'transparent',
                color: tab === t.id ? '#10b981' : 'var(--text-muted)',
                borderColor: tab === t.id ? 'rgba(16,185,129,0.3)' : 'var(--border)'
              }}>
              {lang === 'bn' ? t.bn : t.en}
            </button>
          ))}
        </div>

        {/* Featured Hadiths Tab */}
        {tab === 'featured' && (
          <>
            {/* Search */}
            <div className="relative mb-4">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <SearchIcon size={16} color="var(--text-muted)" />
              </div>
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder={lang === 'bn' ? 'হাদিস খুঁজুন...' : 'Search hadiths...'}
                className="input-field" style={{ paddingLeft: '44px' }} />
            </div>

            {/* Topic Filter */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 mb-4">
              <button onClick={() => setSelectedTopic('all')}
                className="flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border"
                style={{
                  background: selectedTopic === 'all' ? 'rgba(16,185,129,0.15)' : 'transparent',
                  color: selectedTopic === 'all' ? '#10b981' : 'var(--text-muted)',
                  borderColor: selectedTopic === 'all' ? 'rgba(16,185,129,0.3)' : 'var(--border)'
                }}>
                {lang === 'bn' ? 'সব' : 'All'}
              </button>
              {HADITH_TOPICS.map(t => (
                <button key={t.id} onClick={() => setSelectedTopic(t.id)}
                  className="flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border"
                  style={{
                    background: selectedTopic === t.id ? 'rgba(16,185,129,0.15)' : 'transparent',
                    color: selectedTopic === t.id ? '#10b981' : 'var(--text-muted)',
                    borderColor: selectedTopic === t.id ? 'rgba(16,185,129,0.3)' : 'var(--border)'
                  }}>
                  {lang === 'bn' ? t.bn : t.en}
                </button>
              ))}
            </div>

            {/* Count */}
            <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
              {filteredHadiths.length} {lang === 'bn' ? 'টি হাদিস' : 'hadiths'}
              {showFav ? (lang === 'bn' ? ' (পছন্দের)' : ' (favorites)') : ''}
            </p>

            {/* Hadiths */}
            {filteredHadiths.length === 0 ? (
              <div className="text-center py-16 rounded-3xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <HeartIcon size={40} color="var(--text-muted)" />
                <p className="mt-4 font-semibold" style={{ color: 'var(--text-secondary)' }}>
                  {lang === 'bn' ? 'কোনো হাদিস পাওয়া যায়নি' : 'No hadiths found'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredHadiths.map((hadith, i) => {
                  const isExpanded = expandedHadith === hadith.id
                  const isFav = favorites.includes(hadith.id)
                  return (
                    <div key={hadith.id}
                      className="overflow-hidden animate-fadeInUp"
                      style={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border)',
                        borderRadius: '20px',
                        animationDelay: `${Math.min(i, 8) * 0.04}s`,
                        animationFillMode: 'forwards',
                        opacity: 0
                      }}>
                      <button onClick={() => setExpandedHadith(isExpanded ? null : hadith.id)}
                        className="w-full p-4 text-left">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="badge" style={{ background: `${gradeColor[hadith.grade]}15`, color: gradeColor[hadith.grade], border: `1px solid ${gradeColor[hadith.grade]}25`, fontSize: '10px' }}>
                              {hadith.grade}
                            </span>
                            <span className="badge badge-emerald" style={{ fontSize: '10px' }}>
                              {lang === 'bn' ? hadith.topic : hadith.topic}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <button onClick={e => { e.stopPropagation(); toggleFav(hadith.id) }}
                              className="btn-icon" style={{ width: '30px', height: '30px' }}>
                              <HeartIcon size={13} color={isFav ? '#ef4444' : 'var(--text-muted)'} filled={isFav} />
                            </button>
                            <button onClick={e => { e.stopPropagation(); copyHadith(hadith.arabic, hadith.id) }}
                              className="btn-icon" style={{ width: '30px', height: '30px' }}>
                              {copied === hadith.id
                                ? <CheckIcon size={13} color="#10b981" />
                                : <CopyIcon size={13} color="var(--text-muted)" />}
                            </button>
                          </div>
                        </div>

                        {/* Arabic Preview */}
                        <p className="font-arabic text-xl text-right leading-loose mb-3"
                          style={{ color: '#f1e8c8', direction: 'rtl' }}>
                          {hadith.arabic}
                        </p>

                        {/* Bangla/English Preview */}
                        <p className="text-sm leading-relaxed line-clamp-2"
                          style={{ color: 'var(--text-secondary)' }}>
                          {lang === 'bn' ? hadith.bangla : hadith.english}
                        </p>

                        <div className="flex items-center justify-between mt-3">
                          <div>
                            <p className="text-xs font-semibold" style={{ color: '#10b981' }}>
                              {lang === 'bn' ? hadith.source : hadith.sourceEn}
                            </p>
                            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                              {lang === 'bn' ? `বর্ণনাকারী: ${hadith.narrator}` : `Narrator: ${hadith.narratorEn}`}
                            </p>
                          </div>
                          <div style={{ color: 'var(--text-muted)' }}>
                            {isExpanded
                              ? <ChevronUpIcon size={16} color="var(--text-muted)" />
                              : <ChevronDownIcon size={16} color="var(--text-muted)" />}
                          </div>
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="px-4 pb-4 space-y-3" style={{ borderTop: '1px solid var(--border)' }}>
                          <div className="pt-3">
                            <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#10b981' }}>
                              {lang === 'bn' ? 'বাংলা অর্থ' : 'Bengali Meaning'}
                            </p>
                            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                              {hadith.bangla}
                            </p>
                          </div>
                          <div className="pt-2" style={{ borderTop: '1px solid var(--border)' }}>
                            <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#60a5fa' }}>
                              English
                            </p>
                            <p className="text-sm leading-relaxed italic" style={{ color: 'var(--text-muted)' }}>
                              {hadith.english}
                            </p>
                          </div>
                          <div className="rounded-xl p-3 pt-3" style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid var(--border)' }}>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <p className="text-xs font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>
                                  {lang === 'bn' ? 'সূত্র' : 'Source'}
                                </p>
                                <p className="text-xs font-bold" style={{ color: '#10b981' }}>
                                  {lang === 'bn' ? hadith.source : hadith.sourceEn}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>
                                  {lang === 'bn' ? 'মান' : 'Grade'}
                                </p>
                                <p className="text-xs font-bold" style={{ color: gradeColor[hadith.grade] }}>
                                  {hadith.grade}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}

        {/* Books Tab */}
        {tab === 'books' && (
          <div className="space-y-3">
            <div className="arabic-card text-center mb-4">
              <p className="font-arabic text-2xl mb-1" style={{ color: '#fde68a' }}>كُتُبُ الْحَدِيثِ</p>
              <p className="text-sm" style={{ color: '#10b981' }}>
                {lang === 'bn' ? 'প্রধান হাদিস গ্রন্থসমূহ' : 'Major Hadith Collections'}
              </p>
            </div>
            {HADITH_BOOKS.map((book, i) => (
              <div key={book.id}
                className="rounded-2xl p-5 animate-fadeInUp"
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  animationDelay: `${i * 0.06}s`,
                  animationFillMode: 'forwards',
                  opacity: 0
                }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${book.color}15`, border: `1px solid ${book.color}25` }}>
                      <span className="text-lg font-bold" style={{ color: book.color, fontFamily: 'Inter' }}>
                        {i + 1}
                      </span>
                    </div>
                    <div>
                      <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                        {lang === 'bn' ? book.nameBn : book.nameEn}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {book.author}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold" style={{ color: book.color, fontFamily: 'Inter' }}>
                      {book.total.toLocaleString()}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {lang === 'bn' ? 'হাদিস' : 'hadiths'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => { setSelectedBook(book); setTab('search') }}
                  className="w-full rounded-xl py-2.5 text-xs font-bold transition-all flex items-center justify-center gap-2"
                  style={{ background: `${book.color}15`, color: book.color, border: `1px solid ${book.color}25` }}>
                  {lang === 'bn' ? 'নম্বর দিয়ে হাদিস খুঁজুন' : 'Search by number'}
                  <ArrowRightIcon size={13} color={book.color} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Search by Number Tab */}
        {tab === 'search' && (
          <div>
            {/* Book Selector */}
            <p className="section-title">{lang === 'bn' ? 'গ্রন্থ নির্বাচন করুন' : 'Select Book'}</p>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 mb-5">
              {HADITH_BOOKS.map(book => (
                <button key={book.id} onClick={() => { setSelectedBook(book); setFetchedHadith(null) }}
                  className="flex-shrink-0 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border"
                  style={{
                    background: selectedBook?.id === book.id ? `${book.color}20` : 'transparent',
                    color: selectedBook?.id === book.id ? book.color : 'var(--text-muted)',
                    borderColor: selectedBook?.id === book.id ? `${book.color}40` : 'var(--border)'
                  }}>
                  {lang === 'bn' ? book.nameBn.split(' ')[1] || book.nameBn : book.nameEn.split(' ')[1] || book.nameEn}
                </button>
              ))}
            </div>

            {selectedBook && (
              <>
                <div className="rounded-2xl p-4 mb-4" style={{ background: `${selectedBook.color}10`, border: `1px solid ${selectedBook.color}25` }}>
                  <p className="font-bold text-sm" style={{ color: selectedBook.color }}>
                    {lang === 'bn' ? selectedBook.nameBn : selectedBook.nameEn}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    {lang === 'bn' ? `মোট হাদিস: ১ - ${selectedBook.total.toLocaleString()}` : `Total: 1 - ${selectedBook.total.toLocaleString()}`}
                  </p>
                </div>

                <div className="flex gap-3 mb-5">
                  <input type="number" value={hadithNum} onChange={e => setHadithNum(e.target.value)}
                    placeholder={lang === 'bn' ? 'হাদিস নম্বর লিখুন...' : 'Enter hadith number...'}
                    className="input-field flex-1"
                    min="1" max={selectedBook.total} />
                  <button onClick={fetchHadithByNumber}
                    disabled={fetchLoading || !hadithNum}
                    className="btn-primary px-5 rounded-xl"
                    style={{ opacity: !hadithNum ? 0.5 : 1 }}>
                    {fetchLoading ? '...' : (lang === 'bn' ? 'খুঁজুন' : 'Find')}
                  </button>
                </div>

                {fetchError && (
                  <div className="rounded-xl p-4 mb-4" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)' }}>
                    <p className="text-sm" style={{ color: '#ef4444' }}>{fetchError}</p>
                  </div>
                )}

                {fetchedHadith && (
                  <div className="rounded-2xl overflow-hidden animate-scaleIn"
                    style={{ background: 'var(--bg-card)', border: `1px solid ${selectedBook.color}30` }}>
                    <div className="p-4" style={{ borderBottom: '1px solid var(--border)', background: `${selectedBook.color}08` }}>
                      <div className="flex items-center justify-between">
                        <span className="badge" style={{ background: `${selectedBook.color}20`, color: selectedBook.color, border: `1px solid ${selectedBook.color}30` }}>
                          # {hadithNum}
                        </span>
                        <button onClick={() => copyHadith(fetchedHadith.text || fetchedHadith.body || '', 'fetched')}
                          className="btn-icon" style={{ width: '32px', height: '32px' }}>
                          {copied === 'fetched'
                            ? <CheckIcon size={13} color="#10b981" />
                            : <CopyIcon size={13} color="var(--text-muted)" />}
                        </button>
                      </div>
                    </div>
                    <div className="p-5">
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        {fetchedHadith.text || fetchedHadith.body || (lang === 'bn' ? 'হাদিসের টেক্সট পাওয়া যায়নি' : 'Hadith text not available')}
                      </p>
                      <p className="text-xs mt-3 font-semibold" style={{ color: selectedBook.color }}>
                        {lang === 'bn' ? selectedBook.nameBn : selectedBook.nameEn} — #{hadithNum}
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}

            {!selectedBook && (
              <div className="text-center py-16 rounded-3xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <p className="text-4xl mb-3">📚</p>
                <p className="font-semibold" style={{ color: 'var(--text-secondary)' }}>
                  {lang === 'bn' ? 'উপরে গ্রন্থ নির্বাচন করুন' : 'Select a book above'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Copyright */}
        <div className="mt-6 py-4 text-center" style={{ borderTop: '1px solid var(--border)' }}>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {lang === 'bn' ? 'তৈরি করেছেন' : 'Developed by'}{' '}
            <span className="font-bold" style={{ color: '#10b981' }}>Muhammad Shourov</span>
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)', opacity: 0.5 }}>
            {lang === 'bn' ? 'হাদিস সূত্র: HadithAPI' : 'Hadith source: HadithAPI'}
          </p>
        </div>

      </div>

      <BottomNav lang={lang} />
    </main>
  )
}
