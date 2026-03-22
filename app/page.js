'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Home() {
  const [currentTime, setCurrentTime] = useState('')
  const [currentDate, setCurrentDate] = useState('')
  const [hijriDate, setHijriDate] = useState('')
  const [lang, setLang] = useState('bn')
  const [nextPrayer, setNextPrayer] = useState(null)
  const [countdown, setCountdown] = useState('')

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString('en-US', {
        hour: '2-digit', minute: '2-digit', second: '2-digit'
      }))
      setCurrentDate(now.toLocaleDateString('bn-BD', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      }))
    }, 1000)

    fetch(`https://api.aladhan.com/v1/gToH?date=${new Date().toLocaleDateString('en-GB').split('/').join('-')}`)
      .then(r => r.json())
      .then(d => {
        const h = d.data.hijri
        setHijriDate(`${h.day} ${h.month.en} ${h.year} AH`)
      }).catch(() => {})

    fetchNextPrayer()
    return () => clearInterval(timer)
  }, [])

  const fetchNextPrayer = async () => {
    try {
      const pos = await new Promise((res, rej) =>
        navigator.geolocation?.getCurrentPosition(res, rej) || rej()
      ).catch(() => ({ coords: { latitude: 23.8103, longitude: 90.4125 } }))

      const { latitude: lat, longitude: lon } = pos.coords
      const today = new Date()
      const dateStr = `${today.getDate()}-${today.getMonth()+1}-${today.getFullYear()}`
      const res = await fetch(`https://api.aladhan.com/v1/timings/${dateStr}?latitude=${lat}&longitude=${lon}&method=1`)
      const data = await res.json()
      const times = data.data.timings
      const prayers = ['Fajr','Dhuhr','Asr','Maghrib','Isha']
      const prayersBn = ['ফজর','যোহর','আসর','মাগরিব','এশা']
      const now = new Date()
      const nowMin = now.getHours()*60+now.getMinutes()

      let next = null
      for (let i = 0; i < prayers.length; i++) {
        const [h, m] = times[prayers[i]].split(':').map(Number)
        const pMin = h*60+m
        if (pMin > nowMin) {
          const diff = pMin - nowMin
          next = {
            name: prayersBn[i],
            nameEn: prayers[i],
            time: times[prayers[i]],
            diff
          }
          break
        }
      }
      if (!next) {
        const [h, m] = times['Fajr'].split(':').map(Number)
        next = { name: 'ফজর', nameEn: 'Fajr', time: times['Fajr'], diff: (24*60 - nowMin) + h*60+m }
      }
      setNextPrayer(next)

      const countdownTimer = setInterval(() => {
        const n = new Date()
        const nm = n.getHours()*60+n.getMinutes()
        const [h2, m2] = next.time.split(':').map(Number)
        let diff = h2*60+m2 - nm
        if (diff < 0) diff += 24*60
        const hrs = Math.floor(diff/60)
        const mins = diff % 60
        setCountdown(`${hrs}ঘ ${mins}মি`)
      }, 60000)
      setCountdown(`${Math.floor(next.diff/60)}ঘ ${next.diff%60}মি`)
      return () => clearInterval(countdownTimer)
    } catch {}
  }

  const t = {
    bn: {
      title: 'নূর অ্যাপ', subtitle: 'আলোর পথে',
      tagline: 'আপনার ইসলামিক জীবনের সঙ্গী',
      nextPrayer: 'পরবর্তী নামাজ',
      bismillah: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ',
      bismillahMeaning: 'পরম করুণাময় ও দয়ালু আল্লাহর নামে শুরু করছি',
      features: [
        { icon: '🕐', title: 'নামাজের সময়', desc: 'আপনার এলাকার সময়সূচি', href: '/prayer', color: 'from-emerald-500 to-green-600' },
        { icon: '📖', title: 'কোরআন পাঠ', desc: 'আরবি + বাংলা অনুবাদ', href: '/quran', color: 'from-teal-500 to-emerald-600' },
        { icon: '🤲', title: 'দোয়া সমূহ', desc: 'দৈনন্দিন গুরুত্বপূর্ণ দোয়া', href: '/dua', color: 'from-green-500 to-teal-600' },
        { icon: '📿', title: 'তাসবিহ', desc: 'ডিজিটাল তাসবিহ কাউন্টার', href: '/tasbih', color: 'from-amber-500 to-orange-600' },
        { icon: '🧭', title: 'কিবলা', desc: 'কিবলার দিকনির্দেশনা', href: '/qibla', color: 'from-blue-500 to-indigo-600' },
        { icon: '🗓️', title: 'ইসলামিক ক্যালেন্ডার', desc: 'হিজরি তারিখ ও ইভেন্ট', href: '/calendar', color: 'from-purple-500 to-violet-600' },
      ]
    },
    en: {
      title: 'NurApp', subtitle: 'On the Path of Light',
      tagline: 'Your Islamic Life Companion',
      nextPrayer: 'Next Prayer',
      bismillah: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ',
      bismillahMeaning: 'In the name of Allah, the Most Gracious, the Most Merciful',
      features: [
        { icon: '🕐', title: 'Prayer Times', desc: 'Schedule for your location', href: '/prayer', color: 'from-emerald-500 to-green-600' },
        { icon: '📖', title: 'Quran Reader', desc: 'Arabic + Bengali translation', href: '/quran', color: 'from-teal-500 to-emerald-600' },
        { icon: '🤲', title: 'Duas', desc: 'Essential daily supplications', href: '/dua', color: 'from-green-500 to-teal-600' },
        { icon: '📿', title: 'Tasbih', desc: 'Digital tasbih counter', href: '/tasbih', color: 'from-amber-500 to-orange-600' },
        { icon: '🧭', title: 'Qibla', desc: 'Find the Qibla direction', href: '/qibla', color: 'from-blue-500 to-indigo-600' },
        { icon: '🗓️', title: 'Islamic Calendar', desc: 'Hijri dates & events', href: '/calendar', color: 'from-purple-500 to-violet-600' },
      ]
    }
  }[lang]

  return (
    <main className="min-h-screen bg-gray-950 pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-950/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-xl shadow-lg shadow-emerald-500/30">
              🕌
            </div>
            <div>
              <h1 className="text-base font-bold text-gradient leading-tight">{t.title}</h1>
              <p className="text-xs text-gray-500">{t.subtitle}</p>
            </div>
          </div>
          <button onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold transition-all border border-white/10">
            {lang === 'bn' ? 'EN' : 'বাং'}
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-gray-950 to-gray-950">
        <div className="absolute inset-0 opacity-20"
          style={{backgroundImage: 'radial-gradient(circle at 50% 0%, #16a34a 0%, transparent 60%)'}}>
        </div>
        <div className="relative max-w-lg mx-auto px-4 pt-8 pb-6 text-center">
          <p className="font-arabic text-2xl text-amber-300 leading-loose mb-1">{t.bismillah}</p>
          <p className="text-xs text-emerald-400 mb-6">{t.bismillahMeaning}</p>

          <div className="inline-block rounded-2xl bg-white/5 border border-white/10 px-8 py-5 mb-4 w-full">
            <p className="text-4xl font-bold text-white tabular-nums tracking-wider">{currentTime}</p>
            <p className="text-emerald-300 text-sm mt-1">{currentDate}</p>
            {hijriDate && <p className="text-amber-400 text-xs mt-1">🌙 {hijriDate}</p>}
          </div>

          {nextPrayer && (
            <div className="rounded-xl bg-emerald-600/20 border border-emerald-500/30 px-4 py-3 flex items-center justify-between">
              <div className="text-left">
                <p className="text-xs text-emerald-400">{t.nextPrayer}</p>
                <p className="text-white font-bold">{lang === 'bn' ? nextPrayer.name : nextPrayer.nameEn}</p>
              </div>
              <div className="text-right">
                <p className="text-emerald-300 font-bold text-lg">{nextPrayer.time}</p>
                <p className="text-xs text-gray-400">{countdown} {lang === 'bn' ? 'বাকি' : 'left'}</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-lg mx-auto px-4 py-6">
        <div className="grid grid-cols-2 gap-3">
          {t.features.map((f, i) => (
            <Link key={i} href={f.href}>
              <div className={`card-hover rounded-2xl p-5 bg-gradient-to-br ${f.color} cursor-pointer shadow-lg`}>
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="text-white font-bold text-sm mb-1">{f.title}</h3>
                <p className="text-white/70 text-xs leading-relaxed">{f.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-4 border-t border-white/5">
        <p className="text-gray-600 text-xs">🕌 NurApp v1.0 — আলোর পথে</p>
      </footer>

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
              className="flex flex-col items-center gap-1 px-2 py-1 rounded-xl hover:bg-white/10 transition-all">
              <span className="text-xl">{item.icon}</span>
              <span className="text-gray-400 text-xs">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </main>
  )
}
