'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Home() {
  const [currentTime, setCurrentTime] = useState('')
  const [currentDate, setCurrentDate] = useState('')
  const [hijriDate, setHijriDate] = useState('')
  const [lang, setLang] = useState('bn')
  const [darkMode, setDarkMode] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString('bn-BD', {
        hour: '2-digit', minute: '2-digit', second: '2-digit'
      }))
      setCurrentDate(now.toLocaleDateString('bn-BD', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      }))
    }, 1000)

    fetch('https://api.aladhan.com/v1/gToH?date=' + new Date().toLocaleDateString('en-GB').split('/').join('-'))
      .then(r => r.json())
      .then(d => {
        const h = d.data.hijri
        setHijriDate(`${h.day} ${h.month.en} ${h.year} AH`)
      }).catch(() => setHijriDate(''))

    return () => clearInterval(timer)
  }, [])

  const text = {
    bn: {
      title: 'নূর অ্যাপ',
      subtitle: 'আলোর পথে',
      tagline: 'আপনার ইসলামিক জীবনের সঙ্গী',
      prayer: 'নামাজের সময়',
      quran: 'কোরআন পাঠ',
      dua: 'দোয়া সমূহ',
      tasbih: 'তাসবিহ',
      qibla: 'কিবলা',
      calendar: 'ইসলামিক ক্যালেন্ডার',
      prayerDesc: 'আপনার এলাকার নামাজের সময়সূচি',
      quranDesc: 'আরবি, বাংলা ও ইংরেজি অনুবাদসহ',
      duaDesc: 'দৈনন্দিন জীবনের গুরুত্বপূর্ণ দোয়া',
      tasbihDesc: 'ডিজিটাল তাসবিহ কাউন্টার',
      qiblaDesc: 'কিবলার দিকনির্দেশনা',
      calendarDesc: 'হিজরি ও ইসলামিক তারিখ',
      explore: 'দেখুন →',
      bismillah: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ',
      bismillahMeaning: 'পরম করুণাময় ও দয়ালু আল্লাহর নামে শুরু করছি',
    },
    en: {
      title: 'NurApp',
      subtitle: 'On the Path of Light',
      tagline: 'Your Islamic Life Companion',
      prayer: 'Prayer Times',
      quran: 'Quran Reader',
      dua: 'Duas',
      tasbih: 'Tasbih',
      qibla: 'Qibla',
      calendar: 'Islamic Calendar',
      prayerDesc: 'Prayer schedule for your location',
      quranDesc: 'Arabic with Bengali & English translation',
      duaDesc: 'Essential duas for daily life',
      tasbihDesc: 'Digital tasbih counter',
      qiblaDesc: 'Find the direction of Qibla',
      calendarDesc: 'Hijri & Islamic dates',
      explore: 'Explore →',
      bismillah: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ',
      bismillahMeaning: 'In the name of Allah, the Most Gracious, the Most Merciful',
    }
  }

  const t = text[lang]

  const features = [
    { icon: '🕐', title: t.prayer, desc: t.prayerDesc, href: '/nurapp/prayer', color: 'from-emerald-600 to-green-700' },
    { icon: '📖', title: t.quran, desc: t.quranDesc, href: '/nurapp/quran', color: 'from-teal-600 to-emerald-700' },
    { icon: '🤲', title: t.dua, desc: t.duaDesc, href: '/nurapp/dua', color: 'from-green-600 to-teal-700' },
    { icon: '📿', title: t.tasbih, desc: t.tasbihDesc, href: '/nurapp/tasbih', color: 'from-amber-600 to-yellow-700' },
    { icon: '🧭', title: t.qibla, desc: t.qiblaDesc, href: '/nurapp/qibla', color: 'from-blue-600 to-indigo-700' },
    { icon: '🗓️', title: t.calendar, desc: t.calendarDesc, href: '/nurapp/calendar', color: 'from-purple-600 to-violet-700' },
  ]

  return (
    <main className="min-h-screen bg-gray-950">

      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-xl shadow-lg">
              🕌
            </div>
            <div>
              <h1 className="text-lg font-bold text-gradient">{t.title}</h1>
              <p className="text-xs text-gray-400">{t.subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-sm font-medium transition-all"
            >
              {lang === 'bn' ? 'EN' : 'বাং'}
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-green opacity-90"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMwLTkuOTQtOC4wNi0xOC0xOC0xOFYwaDQydjQySDE4QzI3Ljk0IDQyIDM2IDMzLjk0IDM2IDI0VjE4eiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIvPjwvZz48L3N2Zz4=')] opacity-20"></div>
        <div className="relative max-w-6xl mx-auto px-4 py-16 text-center">
          {/* Bismillah */}
          <div className="mb-8 animate-fadeInUp">
            <p className="font-arabic text-3xl md:text-4xl text-amber-300 leading-loose mb-2">
              {t.bismillah}
            </p>
            <p className="text-sm text-emerald-200">{t.bismillahMeaning}</p>
          </div>

          {/* Time */}
          <div className="mb-6 animate-fadeInUp">
            <div className="inline-block glass rounded-2xl px-8 py-4">
              <p className="text-4xl md:text-5xl font-bold text-white tracking-wider mb-1">
                {currentTime}
              </p>
              <p className="text-emerald-200 text-sm">{currentDate}</p>
              {hijriDate && (
                <p className="text-amber-300 text-xs mt-1">🌙 {hijriDate}</p>
              )}
            </div>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{t.tagline}</h2>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <Link key={i} href={f.href}>
              <div className={`card-hover rounded-2xl p-5 bg-gradient-to-br ${f.color} cursor-pointer shadow-lg`}>
                <div className="text-4xl mb-3">{f.icon}</div>
                <h3 className="text-white font-bold text-base mb-1">{f.title}</h3>
                <p className="text-white/70 text-xs leading-relaxed">{f.desc}</p>
                <p className="text-white/90 text-xs mt-3 font-medium">{t.explore}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 text-center">
        <p className="text-gray-500 text-sm">
          🕌 NurApp — আলোর পথে | Made with ❤️ for Muslims
        </p>
        <p className="text-gray-600 text-xs mt-1">
          সম্পূর্ণ বিনামূল্যে • GitHub Pages দ্বারা হোস্টেড
        </p>
      </footer>

    </main>
  )
}
