'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const DUAS = [
  {
    category: 'সকাল-সন্ধ্যা', categoryEn: 'Morning & Evening', icon: '🌅',
    items: [
      {
        title: 'সকালের দোয়া', titleEn: 'Morning Dua',
        arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيكَ لَهُ',
        bangla: 'আমরা সকালে উপনীত হলাম এবং সকল রাজত্ব আল্লাহর। সমস্ত প্রশংসা আল্লাহর। আল্লাহ ছাড়া কোনো ইলাহ নেই, তিনি একা, তাঁর কোনো শরিক নেই।',
        english: 'We have reached the morning and at this very time all sovereignty belongs to Allah. All praise is for Allah. None has the right to be worshipped except Allah, alone, without partner.',
        reference: 'মুসলিম'
      },
      {
        title: 'সন্ধ্যার দোয়া', titleEn: 'Evening Dua',
        arabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيكَ لَهُ',
        bangla: 'আমরা সন্ধ্যায় উপনীত হলাম এবং সকল রাজত্ব আল্লাহর। সমস্ত প্রশংসা আল্লাহর। আল্লাহ ছাড়া কোনো ইলাহ নেই, তিনি একা, তাঁর কোনো শরিক নেই।',
        english: 'We have reached the evening and at this very time all sovereignty belongs to Allah. All praise is for Allah. None has the right to be worshipped except Allah, alone, without partner.',
        reference: 'মুসলিম'
      },
      {
        title: 'আয়াতুল কুরসি', titleEn: 'Ayatul Kursi',
        arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ',
        bangla: 'আল্লাহ — তিনি ছাড়া কোনো উপাস্য নেই। তিনি চিরঞ্জীব, সর্বসত্তার ধারক। তাঁকে তন্দ্রা ও নিদ্রা স্পর্শ করে না।',
        english: 'Allah — there is no deity except Him, the Ever-Living, the Sustainer of existence. Neither drowsiness overtakes Him nor sleep.',
        reference: 'সূরা বাকারা: ২৫৫'
      },
    ]
  },
  {
    category: 'নামাজ', categoryEn: 'Prayer', icon: '🕌',
    items: [
      {
        title: 'নামাজের নিয়ত', titleEn: 'Prayer Intention',
        arabic: 'نَوَيْتُ أَنْ أُصَلِّيَ لِلَّهِ تَعَالَى',
        bangla: 'আমি আল্লাহ তায়ালার উদ্দেশ্যে নামাজ আদায়ের নিয়ত করলাম।',
        english: 'I intend to pray for the sake of Allah the Almighty.',
        reference: 'ফিকহ'
      },
      {
        title: 'নামাজ শেষে দোয়া', titleEn: 'After Prayer',
        arabic: 'اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ',
        bangla: 'হে আল্লাহ! তুমি শান্তি এবং তোমার কাছ থেকেই শান্তি আসে। তুমি বরকতময়, হে মহিমাময় ও সম্মানিত।',
        english: 'O Allah, You are Peace and from You comes peace. Blessed are You, O Owner of majesty and honor.',
        reference: 'মুসলিম'
      },
      {
        title: 'রুকুর দোয়া', titleEn: 'Dua in Ruku',
        arabic: 'سُبْحَانَ رَبِّيَ الْعَظِيمِ وَبِحَمْدِهِ',
        bangla: 'আমার মহান রবের পবিত্রতা ঘোষণা করছি এবং তাঁর প্রশংসা করছি।',
        english: 'Glory be to my Lord, the Most Great, and praise be to Him.',
        reference: 'আবু দাউদ'
      },
      {
        title: 'সিজদার দোয়া', titleEn: 'Dua in Sujood',
        arabic: 'سُبْحَانَ رَبِّيَ الْأَعْلَى وَبِحَمْدِهِ',
        bangla: 'আমার সর্বোচ্চ রবের পবিত্রতা ঘোষণা করছি এবং তাঁর প্রশংসা করছি।',
        english: 'Glory be to my Lord, the Most High, and praise be to Him.',
        reference: 'আবু দাউদ'
      },
    ]
  },
  {
    category: 'খাওয়া-দাওয়া', categoryEn: 'Food & Drink', icon: '🍽️',
    items: [
      {
        title: 'খাওয়ার আগে', titleEn: 'Before Eating',
        arabic: 'بِسْمِ اللَّهِ وَعَلَى بَرَكَةِ اللَّهِ',
        bangla: 'আল্লাহর নামে এবং আল্লাহর বরকতের সাথে শুরু করছি।',
        english: 'In the name of Allah and with the blessings of Allah.',
        reference: 'আবু দাউদ'
      },
      {
        title: 'খাওয়ার পরে', titleEn: 'After Eating',
        arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ',
        bangla: 'সকল প্রশংসা আল্লাহর, যিনি আমাকে এটি খাইয়েছেন এবং আমার কোনো শক্তি ও ক্ষমতা ছাড়াই আমাকে রিযিক দিয়েছেন।',
        english: 'All praise is due to Allah who fed me this and provided it for me without any might or power on my part.',
        reference: 'তিরমিযি'
      },
    ]
  },
  {
    category: 'ঘুমানো', categoryEn: 'Sleep', icon: '🌙',
    items: [
      {
        title: 'ঘুমানোর আগে', titleEn: 'Before Sleep',
        arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
        bangla: 'হে আল্লাহ! তোমার নামেই মৃত্যুবরণ করি এবং জীবিত হই।',
        english: 'In Your name, O Allah, I die and I live.',
        reference: 'বুখারি'
      },
      {
        title: 'ঘুম থেকে উঠে', titleEn: 'Upon Waking',
        arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
        bangla: 'সকল প্রশংসা আল্লাহর, যিনি আমাদের মৃত্যুর পর জীবিত করেছেন এবং তাঁর কাছেই পুনরুত্থান।',
        english: 'All praise is due to Allah who gave us life after death and to Him is the resurrection.',
        reference: 'বুখারি'
      },
      {
        title: 'দুঃস্বপ্ন দেখলে', titleEn: 'After Nightmare',
        arabic: 'أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ',
        bangla: 'আমি বিতাড়িত শয়তান থেকে আল্লাহর আশ্রয় প্রার্থনা করছি।',
        english: 'I seek refuge in Allah from the accursed devil.',
        reference: 'মুসলিম'
      },
    ]
  },
  {
    category: 'সফর', categoryEn: 'Travel', icon: '✈️',
    items: [
      {
        title: 'যানবাহনে উঠার দোয়া', titleEn: 'Boarding Vehicle',
        arabic: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ',
        bangla: 'পবিত্র সেই সত্তা যিনি এটিকে আমাদের অধীন করে দিয়েছেন, অথচ আমরা এটি নিয়ন্ত্রণে সক্ষম ছিলাম না। আর নিশ্চয়ই আমরা আমাদের রবের কাছে ফিরে যাব।',
        english: 'Glory be to the One who has subjected this to us, for we were not capable of that. And indeed, to our Lord we will return.',
        reference: 'তিরমিযি'
      },
      {
        title: 'ঘর থেকে বের হওয়ার দোয়া', titleEn: 'Leaving Home',
        arabic: 'بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
        bangla: 'আল্লাহর নামে, আল্লাহর উপর ভরসা করলাম। আল্লাহর সাহায্য ছাড়া কোনো শক্তি ও ক্ষমতা নেই।',
        english: 'In the name of Allah, I place my trust in Allah, and there is no might nor power except with Allah.',
        reference: 'আবু দাউদ'
      },
    ]
  },
  {
    category: 'বিপদ-আপদ', categoryEn: 'Hardship', icon: '🤲',
    items: [
      {
        title: 'বিপদে পড়লে', titleEn: 'In Difficulty',
        arabic: 'إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ، اللَّهُمَّ أْجُرْنِي فِي مُصِيبَتِي وَأَخْلِفْ لِي خَيْرًا مِنْهَا',
        bangla: 'নিশ্চয়ই আমরা আল্লাহর জন্য এবং নিশ্চয়ই আমরা তাঁর কাছেই ফিরে যাব। হে আল্লাহ! আমার এই বিপদে আমাকে পুরস্কার দাও এবং এর চেয়ে উত্তম কিছু দিয়ে প্রতিস্থাপন করো।',
        english: 'Indeed, to Allah we belong and to Him we shall return. O Allah, reward me for my affliction and replace it with something better.',
        reference: 'মুসলিম'
      },
      {
        title: 'উদ্বেগ-দুশ্চিন্তায়', titleEn: 'In Anxiety',
        arabic: 'اللَّهُمَّ إِنِّي عَبْدُكَ ابْنُ عَبْدِكَ ابْنُ أَمَتِكَ نَاصِيَتِي بِيَدِكَ مَاضٍ فِيَّ حُكْمُكَ عَدْلٌ فِيَّ قَضَاؤُكَ',
        bangla: 'হে আল্লাহ! আমি তোমার বান্দা, তোমার বান্দার পুত্র, তোমার বাঁদির পুত্র। আমার ভাগ্য তোমার হাতে। তোমার নির্দেশ আমার উপর কার্যকর। তোমার ফয়সালা আমার ব্যাপারে ন্যায়সংগত।',
        english: 'O Allah, I am Your servant, son of Your servant, son of Your maidservant. My forelock is in Your hand. Your command over me is forever executed and Your decree over me is just.',
        reference: 'আহমাদ'
      },
    ]
  },
]

export default function DuaPage() {
  const [lang, setLang] = useState('bn')
  const [selectedCat, setSelectedCat] = useState(null)
  const [expandedDua, setExpandedDua] = useState(null)
  const [favorites, setFavorites] = useState([])
  const [showFav, setShowFav] = useState(false)
  const [copied, setCopied] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem('dua_favorites')
    if (saved) setFavorites(JSON.parse(saved))
  }, [])

  const toggleFav = (catI, duaI) => {
    const key = `${catI}-${duaI}`
    const updated = favorites.includes(key) ? favorites.filter(f => f !== key) : [...favorites, key]
    setFavorites(updated)
    localStorage.setItem('dua_favorites', JSON.stringify(updated))
  }

  const copyArabic = (text, key) => {
    navigator.clipboard?.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  const allFavDuas = favorites.map(key => {
    const [ci, di] = key.split('-').map(Number)
    return { ...DUAS[ci].items[di], catIcon: DUAS[ci].icon, key }
  })

  return (
    <main className="min-h-screen bg-gray-950 pb-24">
      <header className="sticky top-0 z-50 bg-gray-950/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {selectedCat !== null && !showFav ? (
              <button onClick={() => { setSelectedCat(null); setExpandedDua(null) }}
                className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all text-lg">←</button>
            ) : (
              <Link href="/" className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all text-lg">←</Link>
            )}
            <h1 className="text-base font-bold text-white">
              {showFav ? (lang === 'bn' ? '❤️ পছন্দের দোয়া' : '❤️ Favorites') :
               selectedCat !== null ? (lang === 'bn' ? DUAS[selectedCat].category : DUAS[selectedCat].categoryEn) :
               (lang === 'bn' ? '🤲 দোয়া সমূহ' : '🤲 Duas')}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => { setShowFav(!showFav); setSelectedCat(null) }}
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all text-lg ${showFav ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-gray-400'}`}>
              ❤️
            </button>
            <button onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
              className="px-3 py-1.5 rounded-lg bg-white/10 text-xs font-bold border border-white/10">
              {lang === 'bn' ? 'EN' : 'বাং'}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-5">

        {/* Favorites View */}
        {showFav && (
          <div className="space-y-3">
            {allFavDuas.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-4xl mb-3">🤲</p>
                <p className="text-gray-400">{lang === 'bn' ? 'কোনো পছন্দের দোয়া নেই' : 'No favorites yet'}</p>
                <p className="text-gray-600 text-sm mt-1">{lang === 'bn' ? 'দোয়ার পাশে ❤️ চাপুন' : 'Tap ❤️ on any dua'}</p>
              </div>
            ) : allFavDuas.map((dua, i) => (
              <DuaCard key={i} dua={dua} lang={lang} isFav={true}
                onFav={() => toggleFav(...dua.key.split('-').map(Number))}
                onCopy={() => copyArabic(dua.arabic, i)}
                copied={copied === i} />
            ))}
          </div>
        )}

        {/* Category List */}
        {!showFav && selectedCat === null && (
          <>
            <div className="rounded-2xl bg-gradient-to-br from-green-900 to-teal-950 border border-green-700/30 p-4 text-center mb-5">
              <p className="font-arabic text-xl text-amber-300 mb-1">ادْعُونِي أَسْتَجِبْ لَكُمْ</p>
              <p className="text-emerald-300 text-xs">
                {lang === 'bn' ? '"তোমরা আমাকে ডাকো, আমি সাড়া দেব" — সূরা গাফির: ৬০' : '"Call upon Me; I will respond to you." — Surah Ghafir: 60'}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {DUAS.map((cat, i) => (
                <button key={i} onClick={() => setSelectedCat(i)}
                  className="rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 p-5 text-left transition-all card-hover">
                  <p className="text-3xl mb-2">{cat.icon}</p>
                  <p className="text-white font-bold text-sm">{lang === 'bn' ? cat.category : cat.categoryEn}</p>
                  <p className="text-gray-500 text-xs mt-1">{cat.items.length}{lang === 'bn' ? 'টি দোয়া' : ' duas'}</p>
                </button>
              ))}
            </div>
          </>
        )}

        {/* Dua List */}
        {!showFav && selectedCat !== null && (
          <div className="space-y-3">
            {DUAS[selectedCat].items.map((dua, i) => {
              const key = `${selectedCat}-${i}`
              const isFav = favorites.includes(key)
              return (
                <DuaCard key={i} dua={dua} lang={lang} isFav={isFav}
                  isExpanded={expandedDua === i}
                  onToggle={() => setExpandedDua(expandedDua === i ? null : i)}
                  onFav={() => toggleFav(selectedCat, i)}
                  onCopy={() => copyArabic(dua.arabic, key)}
                  copied={copied === key} />
              )
            })}
          </div>
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
              className={`flex flex-col items-center gap-1 px-2 py-1 rounded-xl transition-all ${item.href === '/dua' ? 'bg-emerald-600/20' : 'hover:bg-white/10'}`}>
              <span className="text-xl">{item.icon}</span>
              <span className={`text-xs ${item.href === '/dua' ? 'text-emerald-400' : 'text-gray-400'}`}>{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </main>
  )
}

function DuaCard({ dua, lang, isFav, isExpanded, onToggle, onFav, onCopy, copied }) {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
      <button onClick={onToggle} className="w-full p-4 flex items-center justify-between text-left">
        <div className="flex-1">
          <p className="text-white font-bold text-sm">{lang === 'bn' ? dua.title : dua.titleEn}</p>
          <p className="text-gray-500 text-xs mt-0.5">📚 {dua.reference}</p>
        </div>
        <div className="flex items-center gap-2 ml-3">
          <button onClick={e => { e.stopPropagation(); onFav() }}
            className={`text-lg ${isFav ? 'text-red-400' : 'text-gray-600'}`}>❤️</button>
          <span className="text-gray-500 text-sm">{isExpanded ? '▲' : '▼'}</span>
        </div>
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 border-t border-white/10 pt-4 space-y-3">
          <div className="bg-emerald-950/40 rounded-xl p-4 relative">
            <p className="font-arabic text-2xl text-amber-200 text-right leading-loose" dir="rtl">{dua.arabic}</p>
            <button onClick={onCopy}
              className="absolute top-2 left-2 w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-sm transition-all">
              {copied ? '✅' : '📋'}
            </button>
          </div>
          {lang === 'bn' && (
            <div>
              <p className="text-xs text-emerald-400 font-bold mb-1">বাংলা অর্থ</p>
              <p className="text-gray-200 text-sm leading-relaxed">{dua.bangla}</p>
            </div>
          )}
          <div>
            <p className="text-xs text-blue-400 font-bold mb-1">English</p>
            <p className="text-gray-300 text-sm leading-relaxed italic">{dua.english}</p>
          </div>
        </div>
      )}
    </div>
  )
}
