'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import BottomNav from '../components/BottomNav'
import {
  ClockIcon, QuranIcon, HandsIcon, TasbihIcon,
  CompassIcon, CalendarIcon, HadithIcon, MapPinIcon,
  MoonIcon, ArrowRightIcon, SunriseIcon, RefreshIcon
} from '../components/Icons'

export default function Home() {
  const [currentTime, setCurrentTime] = useState('')
  const [currentDate, setCurrentDate] = useState('')
  const [hijriDate, setHijriDate] = useState('')
  const [lang, setLang] = useState('bn')
  const [nextPrayer, setNextPrayer] = useState(null)
  const [countdown, setCountdown] = useState('')
  const [prayerTimes, setPrayerTimes] = useState(null)
  const [cityName, setCityName] = useState('')
  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    const savedLang = localStorage.getItem('nurapp_lang') || 'bn'
    setLang(savedLang)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString('en-US', {
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
      }))
      setCurrentDate(now.toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      }))
      const h = now.getHours()
      if (h < 5) setGreeting(lang === 'bn' ? 'আস-সালামু আলাইকুম' : 'As-Salamu Alaykum')
      else if (h < 12) setGreeting(lang === 'bn' ? 'শুভ সকাল' : 'Good Morning')
      else if (h < 17) setGreeting(lang === 'bn' ? 'শুভ দুপুর' : 'Good Afternoon')
      else if (h < 20) setGreeting(lang === 'bn' ? 'শুভ বিকাল' : 'Good Evening')
      else setGreeting(lang === 'bn' ? 'শুভ রাত্রি' : 'Good Night')
    }, 1000)
    fetchHijri()
    fetchPrayerData()
    return () => clearInterval(timer)
  }, [lang])

  const fetchHijri = async () => {
    try {
      const today = new Date()
      const d = `${today.getDate()}-${today.getMonth()+1}-${today.getFullYear()}`
      const res = await fetch(`https://api.aladhan.com/v1/gToH?date=${d}`)
      const data = await res.json()
      const h = data.data.hijri
      setHijriDate(lang === 'bn'
        ? `${h.day} ${h.month.en} ${h.year} হিজরি`
        : `${h.day} ${h.month.en} ${h.year} AH`)
    } catch {}
  }

  const fetchPrayerData = async () => {
    try {
      const pos = await new Promise((res, rej) =>
        navigator.geolocation?.getCurrentPosition(res, rej) || rej()
      ).catch(() => ({ coords: { latitude: 23.8103, longitude: 90.4125 } }))
      const { latitude: lat, longitude: lon } = pos.coords
      try {
        const geo = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`)
        const gd = await geo.json()
        setCityName(gd.address?.city || gd.address?.town || (lang === 'bn' ? 'আপনার এলাকা' : 'Your Area'))
      } catch { setCityName(lang === 'bn' ? 'ঢাকা' : 'Dhaka') }

      const today = new Date()
      const dateStr = `${today.getDate()}-${today.getMonth()+1}-${today.getFullYear()}`
      const res = await fetch(`https://api.aladhan.com/v1/timings/${dateStr}?latitude=${lat}&longitude=${lon}&method=1`)
      const data = await res.json()
      const times = data.data.timings
      setPrayerTimes(times)
      updateNextPrayer(times)
    } catch {}
  }

  const updateNextPrayer = (times) => {
    const prayers = ['Fajr','Dhuhr','Asr','Maghrib','Isha']
    const prayersBn = { Fajr:'ফজর', Dhuhr:'যোহর', Asr:'আসর', Maghrib:'মাগরিব', Isha:'এশা' }
    const now = new Date()
    const nowMin = now.getHours()*60+now.getMinutes()
    let found = null
    for (let p of prayers) {
      const [h, m] = times[p].split(':').map(Number)
      if (h*60+m > nowMin) { found = { name: p, nameBn: prayersBn[p], time: times[p], diff: h*60+m-nowMin }; break }
    }
    if (!found) {
      const [h, m] = times['Fajr'].split(':').map(Number)
      found = { name: 'Fajr', nameBn: 'ফজর', time: times['Fajr'], diff: (24*60-nowMin)+h*60+m }
    }
    setNextPrayer(found)
    setCountdown(`${Math.floor(found.diff/60)}:${(found.diff%60).toString().padStart(2,'0')}`)
  }

  const toggleLang = () => {
    const newLang = lang === 'bn' ? 'en' : 'bn'
    setLang(newLang)
    localStorage.setItem('nurapp_lang', newLang)
  }

  const formatTime = (t) => {
    if (!t) return '--:--'
    const [h, m] = t.split(':').map(Number)
    const ap = h >= 12 ? 'PM' : 'AM'
    return `${h%12||12}:${m.toString().padStart(2,'0')} ${ap}`
  }

  const FEATURES = [
    { href: '/prayer', labelBn: 'নামাজের সময়', labelEn: 'Prayer Times', descBn: 'আপনার এলাকার সময়সূচি', descEn: 'Schedule for your area', Icon: ClockIcon, accent: '#10b981' },
    { href: '/quran', labelBn: 'কোরআন পাঠ', labelEn: 'Quran Reader', descBn: '১১৪ সূরা • বাংলা অনুবাদ', descEn: '114 Surahs • Translation', Icon: QuranIcon, accent: '#10b981' },
    { href: '/dua', labelBn: 'দোয়া ও দরুদ', labelEn: 'Dua & Salawat', descBn: '১০০+ দোয়া • আরবি ও অর্থ', descEn: '100+ Duas • Arabic & Meaning', Icon: HandsIcon, accent: '#f59e0b' },
    { href: '/hadith', labelBn: 'হাদিস সংগ্রহ', labelEn: 'Hadith Collection', descBn: 'বুখারি, মুসলিম, তিরমিযি', descEn: 'Bukhari, Muslim, Tirmidhi', Icon: HadithIcon, accent: '#8b5cf6' },
    { href: '/tasbih', labelBn: 'তাসবিহ', labelEn: 'Tasbih', descBn: 'ডিজিটাল তাসবিহ কাউন্টার', descEn: 'Digital tasbih counter', Icon: TasbihIcon, accent: '#f59e0b' },
    { href: '/qibla', labelBn: 'কিবলা', labelEn: 'Qibla', descBn: 'লাইভ কম্পাস দিকনির্দেশনা', descEn: 'Live compass direction', Icon: CompassIcon, accent: '#3b82f6' },
    { href: '/calendar', labelBn: 'ইসলামিক ক্যালেন্ডার', labelEn: 'Islamic Calendar', descBn: 'হিজরি তারিখ ও ইভেন্ট', descEn: 'Hijri dates & events', Icon: CalendarIcon, accent: '#ec4899' },
  ]

  const prayers = ['Fajr','Dhuhr','Asr','Maghrib','Isha']
  const prayersBn = { Fajr:'ফজর', Dhuhr:'যোহর', Asr:'আসর', Maghrib:'মাগরিব', Isha:'এশা' }

  return (
    <main className="min-h-screen pb-28" style={{ background: 'var(--bg-primary)' }}>

      {/* Header */}
      <header className="sticky top-0 z-50 header-blur">
        <div className="px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #10b981, #059669)', boxShadow: '0 4px 12px rgba(16,185,129,0.3)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 21h18M3 10h18M5 10V7a7 7 0 0 1 14 0v3M9 10v11M15 10v11M12 3V1"/>
                <circle cx="12" cy="7" r="1" fill="white"/>
              </svg>
            </div>
            <div>
              <h1 className="text-base font-bold leading-none" style={{ color: 'var(--text-primary)' }}>NurApp</h1>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                {lang === 'bn' ? 'আলোর পথে' : 'On the Path of Light'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {cityName && (
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <MapPinIcon size={12} color="#10b981" />
                <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{cityName}</span>
              </div>
            )}
            <button onClick={toggleLang} className="btn-icon">
              <span className="text-xs font-bold" style={{ color: 'var(--text-secondary)' }}>
                {lang === 'bn' ? 'EN' : 'বাং'}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-pattern px-5 pt-6 pb-5">
        <div className="relative overflow-hidden rounded-3xl p-6" style={{ background: 'linear-gradient(135deg, #064e3b 0%, #065f46 40%, #047857 100%)', boxShadow: '0 20px 60px rgba(16,185,129,0.2)' }}>

          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-48 h-48 opacity-10" style={{ background: 'radial-gradient(circle, white, transparent)', transform: 'translate(30%, -30%)' }}></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 opacity-5" style={{ background: 'radial-gradient(circle, white, transparent)', transform: 'translate(-30%, 30%)' }}></div>

          {/* Greeting */}
          {greeting && (
            <p className="text-sm font-medium mb-3 opacity-80" style={{ color: '#a7f3d0' }}>{greeting}</p>
          )}

          {/* Bismillah */}
          <div className="text-center mb-5">
            <p className="font-arabic leading-loose" style={{ fontSize: '22px', color: '#fde68a' }}>
              بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
            </p>
            <p className="text-xs mt-1 opacity-70" style={{ color: '#a7f3d0' }}>
              {lang === 'bn' ? 'পরম করুণাময় আল্লাহর নামে শুরু করছি' : 'In the name of Allah, the Most Gracious'}
            </p>
          </div>

          {/* Time */}
          <div className="text-center mb-4">
            <p className="font-bold tabular-nums" style={{ fontSize: '38px', color: 'white', letterSpacing: '-0.02em', fontFamily: 'Inter, sans-serif' }}>
              {currentTime}
            </p>
            <p className="text-sm mt-1 opacity-70" style={{ color: '#a7f3d0' }}>{currentDate}</p>
            {hijriDate && (
              <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full" style={{ background: 'rgba(0,0,0,0.2)' }}>
                <MoonIcon size={12} color="#fde68a" />
                <span className="text-xs" style={{ color: '#fde68a' }}>{hijriDate}</span>
              </div>
            )}
          </div>

          {/* Next Prayer */}
          {nextPrayer && (
            <div className="rounded-2xl p-4 flex items-center justify-between" style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div>
                <p className="text-xs font-medium mb-1" style={{ color: '#6ee7b7' }}>
                  {lang === 'bn' ? 'পরবর্তী নামাজ' : 'Next Prayer'}
                </p>
                <p className="text-lg font-bold" style={{ color: 'white' }}>
                  {lang === 'bn' ? nextPrayer.nameBn : nextPrayer.name}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold tabular-nums" style={{ color: '#fde68a', fontFamily: 'Inter, sans-serif' }}>
                  {formatTime(nextPrayer.time)}
                </p>
                <div className="flex items-center gap-1 justify-end mt-1">
                  <ClockIcon size={11} color="#6ee7b7" />
                  <p className="text-xs tabular-nums" style={{ color: '#6ee7b7' }}>
                    {countdown} {lang === 'bn' ? 'বাকি' : 'left'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Quick Prayer Times */}
      {prayerTimes && (
        <section className="px-5 mb-5">
          <div className="flex items-center justify-between mb-3">
            <p className="section-title">{lang === 'bn' ? 'আজকের নামাজ' : "Today's Prayers"}</p>
            <Link href="/prayer" className="flex items-center gap-1 text-xs font-semibold" style={{ color: '#10b981' }}>
              {lang === 'bn' ? 'সব দেখুন' : 'See all'}
              <ArrowRightIcon size={12} color="#10b981" />
            </Link>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {prayers.map(p => {
              const now = new Date()
              const nowMin = now.getHours()*60+now.getMinutes()
              const [h, m] = prayerTimes[p].split(':').map(Number)
              const isNext = nextPrayer?.name === p
              const isPast = h*60+m < nowMin
              return (
                <Link key={p} href="/prayer">
                  <div className={`rounded-2xl p-3 text-center transition-all ${isNext ? 'prayer-next' : isPast ? '' : ''}`}
                    style={{
                      background: isNext ? 'rgba(245,158,11,0.1)' : 'var(--bg-card)',
                      border: isNext ? '1px solid rgba(245,158,11,0.3)' : '1px solid var(--border)',
                      opacity: isPast && !isNext ? 0.5 : 1
                    }}>
                    <p className="text-xs font-semibold mb-1.5 truncate" style={{ color: isNext ? '#f59e0b' : 'var(--text-muted)' }}>
                      {lang === 'bn' ? prayersBn[p] : p}
                    </p>
                    <p className="text-xs font-bold tabular-nums" style={{ color: isNext ? '#fbbf24' : 'var(--text-primary)', fontFamily: 'Inter, sans-serif' }}>
                      {formatTime(prayerTimes[p])}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {/* Features Grid */}
      <section className="px-5 mb-5">
        <p className="section-title">{lang === 'bn' ? 'সকল ফিচার' : 'All Features'}</p>
        <div className="grid grid-cols-2 gap-3">
          {FEATURES.map((f, i) => (
            <Link key={i} href={f.href}>
              <div className="card-hover p-4 animate-fadeInUp" style={{ animationDelay: `${i * 0.05}s`, opacity: 0, animationFillMode: 'forwards' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                  style={{ background: `${f.accent}15`, border: `1px solid ${f.accent}25` }}>
                  <f.Icon size={20} color={f.accent} />
                </div>
                <p className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                  {lang === 'bn' ? f.labelBn : f.labelEn}
                </p>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  {lang === 'bn' ? f.descBn : f.descEn}
                </p>
                <div className="flex items-center gap-1 mt-3">
                  <span className="text-xs font-semibold" style={{ color: f.accent }}>
                    {lang === 'bn' ? 'খুলুন' : 'Open'}
                  </span>
                  <ArrowRightIcon size={11} color={f.accent} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Daily Ayah */}
      <section className="px-5 mb-5">
        <p className="section-title">{lang === 'bn' ? 'আয়াতুল কুরসি' : 'Ayatul Kursi'}</p>
        <div className="arabic-card">
          <p className="font-arabic mb-4" style={{ fontSize: '20px', color: '#fde68a', lineHeight: '2.2' }}>
            اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ
          </p>
          <div className="divider"></div>
          <p className="text-sm leading-relaxed text-center" style={{ color: 'var(--text-secondary)' }}>
            {lang === 'bn'
              ? 'আল্লাহ — তিনি ছাড়া কোনো উপাস্য নেই। তিনি চিরঞ্জীব, সর্বসত্তার ধারক। তাঁকে তন্দ্রা ও নিদ্রা স্পর্শ করে না।'
              : 'Allah — there is no deity except Him, the Ever-Living, the Sustainer of existence. Neither drowsiness overtakes Him nor sleep.'}
          </p>
          <p className="text-xs mt-3 font-semibold" style={{ color: '#10b981' }}>
            {lang === 'bn' ? 'সূরা বাকারা: ২৫৫' : 'Surah Al-Baqarah: 255'}
          </p>
        </div>
      </section>

      {/* Copyright */}
      <footer className="px-5 pb-4 text-center">
        <div className="divider"></div>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          {lang === 'bn' ? 'তৈরি করেছেন' : 'Developed by'}{' '}
          <span className="font-bold" style={{ color: '#10b981' }}>Muhammad Shourov</span>
        </p>
        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)', opacity: 0.5 }}>
          © 2026 NurApp • {lang === 'bn' ? 'সর্বস্বত্ব সংরক্ষিত' : 'All rights reserved'}
        </p>
      </footer>

      <BottomNav lang={lang} />
    </main>
  )
}
