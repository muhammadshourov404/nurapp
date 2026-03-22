'use client'

import { useState } from 'react'
import Link from 'next/link'

const DUAS = [
  {
    category: 'সকাল-সন্ধ্যা',
    categoryEn: 'Morning & Evening',
    icon: '🌅',
    items: [
      {
        title: 'সকালের দোয়া',
        titleEn: 'Morning Dua',
        arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ',
        bangla: 'আমরা সকালে উপনীত হলাম এবং সকল রাজত্ব আল্লাহর। সমস্ত প্রশংসা আল্লাহর।',
        english: 'We have reached the morning and at this very time all sovereignty belongs to Allah. All praise is due to Allah.',
        reference: 'মুসলিম'
      },
      {
        title: 'সন্ধ্যার দোয়া',
        titleEn: 'Evening Dua',
        arabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ',
        bangla: 'আমরা সন্ধ্যায় উপনীত হলাম এবং সকল রাজত্ব আল্লাহর। সমস্ত প্রশংসা আল্লাহর।',
        english: 'We have reached the evening and at this very time all sovereignty belongs to Allah.',
        reference: 'মুসলিম'
      },
    ]
  },
  {
    category: 'নামাজ',
    categoryEn: 'Prayer',
    icon: '🕌',
    items: [
      {
        title: 'নামাজ শুরুর দোয়া',
        titleEn: 'Opening Supplication',
        arabic: 'سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ وَتَبَارَكَ اسْمُكَ وَتَعَالَى جَدُّكَ وَلَا إِلَهَ غَيْرُكَ',
        bangla: 'হে আল্লাহ! তুমি পবিত্র, তোমার প্রশংসা করি। তোমার নাম বরকতময়, তোমার মর্যাদা সর্বোচ্চ এবং তুমি ছাড়া কোনো ইলাহ নেই।',
        english: 'Glory be to You, O Allah, and praise. Blessed is Your name and exalted is Your majesty. There is no god but You.',
        reference: 'আবু দাউদ'
      },
      {
        title: 'রুকুর তাসবিহ',
        titleEn: 'Tasbih of Ruku',
        arabic: 'سُبْحَانَ رَبِّيَ الْعَظِيمِ',
        bangla: 'আমার মহান রবের পবিত্রতা ঘোষণা করছি।',
        english: 'Glory be to my Lord, the Most Great.',
        reference: 'মুসলিম'
      },
      {
        title: 'সিজদার তাসবিহ',
        titleEn: 'Tasbih of Sujood',
        arabic: 'سُبْحَانَ رَبِّيَ الْأَعْلَى',
        bangla: 'আমার সর্বোচ্চ রবের পবিত্রতা ঘোষণা করছি।',
        english: 'Glory be to my Lord, the Most High.',
        reference: 'মুসলিম'
      },
    ]
  },
  {
    category: 'খাওয়া-দাওয়া',
    categoryEn: 'Food & Drink',
    icon: '🍽️',
    items: [
      {
        title: 'খাওয়ার আগের দোয়া',
        titleEn: 'Before Eating',
        arabic: 'بِسْمِ اللَّهِ وَعَلَى بَرَكَةِ اللَّهِ',
        bangla: 'আল্লাহর নামে এবং আল্লাহর বরকতের সাথে শুরু করছি।',
        english: 'In the name of Allah and with the blessings of Allah.',
        reference: 'আবু দাউদ'
      },
      {
        title: 'খাওয়ার পরের দোয়া',
        titleEn: 'After Eating',
        arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا وَرَزَقَنِيهِ',
        bangla: 'সকল প্রশংসা আল্লাহর, যিনি আমাকে এটি খাইয়েছেন এবং রিযিক দিয়েছেন।',
        english: 'All praise is due to Allah who fed me this and provided it for me.',
        reference: 'তিরমিযি'
      },
    ]
  },
  {
    category: 'ঘুমানো',
    categoryEn: 'Sleep',
    icon: '🌙',
    items: [
      {
        title: 'ঘুমানোর আগের দোয়া',
        titleEn: 'Before Sleep',
        arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
        bangla: 'হে আল্লাহ! তোমার নামেই মৃত্যুবরণ করি (ঘুমাই) এবং জীবিত হই (জাগি)।',
        english: 'In Your name, O Allah, I die and I live.',
        reference: 'বুখারি'
      },
      {
        title: 'ঘুম থেকে উঠার দোয়া',
        titleEn: 'Upon Waking',
        arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
        bangla: 'সকল প্রশংসা আল্লাহর, যিনি আমাদের মৃত্যুর পর (ঘুমের পর) জীবিত করেছেন এবং তাঁর কাছেই পুনরুত্থান।',
        english: 'All praise is due to Allah who gave us life after death and to Him is the resurrection.',
        reference: 'বুখারি'
      },
    ]
  },
  {
    category: 'সফর',
    categoryEn: 'Travel',
    icon: '✈️',
    items: [
      {
        title: 'সফরের দোয়া',
        titleEn: 'Travel Dua',
        arabic: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ',
        bangla: 'পবিত্র সেই সত্তা যিনি এটিকে আমাদের অধীন করে দিয়েছেন, অথচ আমরা এটি নিয়ন্ত্রণে সক্ষম ছিলাম না।',
        english: 'Glory be to the One who has subjected this to us, for we were not capable of that.',
        reference: 'তিরমিযি'
      },
    ]
  },
]

export default function DuaPage() {
  const [lang, setLang] = useState('bn')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [expandedDua, setExpandedDua] = useState(null)

  const currentData = selectedCategory !== null ? [DUAS[selectedCategory]] : null

  return (
    <main className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {selectedCategory !== null ? (
              <button
                onClick={() => setSelectedCategory(null)}
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
              {selectedCategory !== null
                ? (lang === 'bn' ? DUAS[selectedCategory].category : DUAS[selectedCategory].categoryEn)
                : (lang === 'bn' ? '🤲 দোয়া সমূহ' : '🤲 Duas')}
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

        {selectedCategory === null ? (
          <>
            {/* Top Banner */}
            <div className="rounded-2xl gradient-green p-5 text-center mb-6">
              <p className="font-arabic text-2xl text-amber-300 mb-1">ادْعُونِي أَسْتَجِبْ لَكُمْ</p>
              <p className="text-emerald-200 text-sm">
                {lang === 'bn' ? '"তোমরা আমাকে ডাকো, আমি সাড়া দেব" — সূরা গাফির: ৬০' : '"Call upon Me; I will respond to you." — Surah Ghafir: 60'}
              </p>
            </div>

            {/* Categories */}
            <div className="grid grid-cols-2 gap-3">
              {DUAS.map((cat, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedCategory(i)}
                  className="rounded-2xl bg-white/5 hover:bg-white/10 p-5 text-left transition-all card-hover border border-white/10"
                >
                  <p className="text-3xl mb-2">{cat.icon}</p>
                  <p className="text-white font-bold">
                    {lang === 'bn' ? cat.category : cat.categoryEn}
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    {cat.items.length}{lang === 'bn' ? 'টি দোয়া' : ' duas'}
                  </p>
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="space-y-4">
            {DUAS[selectedCategory].items.map((dua, i) => (
              <div
                key={i}
                className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden"
              >
                <button
                  onClick={() => setExpandedDua(expandedDua === i ? null : i)}
                  className="w-full p-5 flex items-center justify-between text-left"
                >
                  <div>
                    <p className="text-white font-bold">
                      {lang === 'bn' ? dua.title : dua.titleEn}
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      {lang === 'bn' ? `সূত্র: ${dua.reference}` : `Source: ${dua.reference}`}
                    </p>
                  </div>
                  <span className="text-gray-400 text-xl">
                    {expandedDua === i ? '▲' : '▼'}
                  </span>
                </button>

                {expandedDua === i && (
                  <div className="px-5 pb-5 border-t border-white/10 pt-4 space-y-4">
                    {/* Arabic */}
                    <div className="bg-emerald-950/50 rounded-xl p-4">
                      <p className="font-arabic text-2xl text-amber-200 text-right leading-loose" dir="rtl">
                        {dua.arabic}
                      </p>
                    </div>

                    {/* Bangla */}
                    <div>
                      <p className="text-xs text-emerald-400 mb-1 font-bold">বাংলা অর্থ</p>
                      <p className="text-gray-200 text-sm leading-relaxed">{dua.bangla}</p>
                    </div>

                    {/* English */}
                    <div>
                      <p className="text-xs text-blue-400 mb-1 font-bold">English</p>
                      <p className="text-gray-300 text-sm leading-relaxed italic">{dua.english}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
