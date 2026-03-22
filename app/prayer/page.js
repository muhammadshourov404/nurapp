'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import BottomNav from '../../components/BottomNav'
import {
  ChevronLeftIcon, MapPinIcon, RefreshIcon,
  ClockIcon, SunriseIcon, SunsetIcon, MoonIcon,
  ArrowRightIcon, InfoIcon
} from '../../components/Icons'

const PRAYERS = [
  { key: 'Fajr', nameBn: 'ফজর', nameEn: 'Fajr', rakahBn: 'সুন্নাত ২ + ফরজ ২', rakahEn: '2 Sunnah + 2 Fard', timeBn: 'সুবহে সাদেক থেকে সূর্যোদয়', timeEn: 'Dawn to Sunrise' },
  { key: 'Dhuhr', nameBn: 'যোহর', nameEn: 'Dhuhr', rakahBn: 'সুন্নাত ৪ + ফরজ ৪ + সুন্নাত ২', rakahEn: '4 Sunnah + 4 Fard + 2 Sunnah', timeBn: 'দুপুর থেকে আসর পর্যন্ত', timeEn: 'Midday to Asr' },
  { key: 'Asr', nameBn: 'আসর', nameEn: 'Asr', rakahBn: 'সুন্নাত ৪ + ফরজ ৪', rakahEn: '4 Sunnah + 4 Fard', timeBn: 'বিকাল থেকে সূর্যাস্ত', timeEn: 'Afternoon to Sunset' },
  { key: 'Maghrib', nameBn: 'মাগরিব', nameEn: 'Maghrib', rakahBn: 'ফরজ ৩ + সুন্নাত ২', rakahEn: '3 Fard + 2 Sunnah', timeBn: 'সূর্যাস্তের পর', timeEn: 'After Sunset' },
  { key: 'Isha', nameBn: 'এশা', nameEn: 'Isha', rakahBn: 'সুন্নাত ৪ + ফরজ ৪ + বিতর ৩', rakahEn: '4 Sunnah + 4 Fard + 3 Witr', timeBn: 'রাত থেকে মধ্যরাত', timeEn: 'Night to Midnight' },
]

const EXTRA_TIMES = [
  { key: 'Sunrise', nameBn: 'সূর্যোদয়', nameEn: 'Sunrise', Icon: SunriseIcon, color: '#f59e0b' },
  { key: 'Sunset', nameBn: 'সূর্যাস্ত', nameEn: 'Sunset', Icon: SunsetIcon, color: '#f97316' },
  { key: 'Midnight', nameBn: 'মধ্যরাত', nameEn: 'Midnight', Icon: MoonIcon, color: '#8b5cf6' },
  { key: 'Tahajjud', nameBn: 'তাহাজ্জুদ', nameEn: 'Tahajjud', Icon: ClockIcon, color: '#06b6d4' },
]

export default function PrayerPage() {
  const [times, setTimes] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentPrayer, setCurrentPrayer] = useState('')
  const [nextPrayer, setNextPrayer] = useState(null)
  const [countdown, setCountdown] = useState('')
  const [lang, setLang] = useState('bn')
  const [cityName, setCityName] = useState('')
  const [currentTime, setCurrentTime] = useState('')
  const [hijriDate, setHijriDate] = useState('')
  const [expandedPrayer, setExpandedPrayer] = useState(null)
  const [coords, setCoords] = useState(null)

  useEffect(() => {
    const savedLang = localStorage.getItem('nurapp_lang') || 'bn'
    setLang(savedLang)
    getLocation()
    const t = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }))
    }, 1000)
    fetchHijri()
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    if (times) updateCurrentPrayer(times)
  }, [currentTime, times])

  const fetchHijri = async () => {
    try {
      const today = new Date()
      const d = `${today.getDate()}-${today.getMonth()+1}-${today.getFullYear()}`
      const res = await fetch(`https://api.aladhan.com/v1/gToH?date=${d}`)
      const data = await res.json()
      const h = data.data.hijri
      setHijriDate(`${h.day} ${h.month.en} ${h.year} AH`)
    } catch {}
  }

  const getLocation = () => {
    setLoading(true)
    navigator.geolocation?.getCurrentPosition(
      async pos => {
        const { latitude: lat, longitude: lon } = pos.coords
        setCoords({ lat, lon })
        try {
          const geo = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`)
          const gd = await geo.json()
          setCityName(gd.address?.city || gd.address?.town || gd.address?.county || 'Your Area')
        } catch { setCityName('Dhaka') }
        fetchTimes(lat, lon)
      },
      () => { setCityName('Dhaka'); fetchTimes(23.8103, 90.4125) }
    )
  }

  const fetchTimes = async (lat, lon) => {
    try {
      const today = new Date()
      const dateStr = `${today.getDate()}-${today.getMonth()+1}-${today.getFullYear()}`
      const res = await fetch(`https://api.aladhan.com/v1/timings/${dateStr}?latitude=${lat}&longitude=${lon}&method=1`)
      const data = await res.json()
      const t = data.data.timings

      // Tahajjud: last third of night
      const [ishH, ishM] = t.Isha.split(':').map(Number)
      const [fajH, fajM] = t.Fajr.split(':').map(Number)
      const nightMins = (fajH*60+fajM) + (24*60-(ishH*60+ishM))
      const tahMin = (ishH*60+ishM) + Math.floor(nightMins*2/3)
      const tH = Math.floor(tahMin/60)%24
      const tM = tahMin%60
      t.Tahajjud = `${tH.toString().padStart(2,'0')}:${tM.toString().padStart(2,'0')}`

      setTimes(t)
      updateCurrentPrayer(t)
    } catch {}
    setLoading(false)
  }

  const updateCurrentPrayer = (t) => {
    const prayers = ['Fajr','Dhuhr','Asr','Maghrib','Isha']
    const now = new Date()
    const nowMin = now.getHours()*60+now.getMinutes()
    let current = 'Isha', next = null

    for (let i = 0; i < prayers.length; i++) {
      const [h, m] = t[prayers[i]].split(':').map(Number)
      if (nowMin >= h*60+m) current = prayers[i]
    }
    setCurrentPrayer(current)

    for (let i = 0; i < prayers.length; i++) {
      const [h, m] = t[prayers[i]].split(':').map(Number)
      if (h*60+m > nowMin) {
        const diff = h*60+m-nowMin
        next = { name: prayers[i], diff }
        setCountdown(`${Math.floor(diff/60)}ঘ ${diff%60}মি`)
        break
      }
    }
    if (!next) {
      const [h, m] = t['Fajr'].split(':').map(Number)
      const diff = (24*60-nowMin)+h*60+m
      next = { name: 'Fajr', diff }
      setCountdown(`${Math.floor(diff/60)}ঘ ${diff%60}মি`)
    }
    setNextPrayer(next)
  }

  const fmt = (t) => {
    if (!t) return '--:--'
    const [h, m] = t.split(':').map(Number)
    return `${h%12||12}:${m.toString().padStart(2,'0')} ${h>=12?'PM':'AM'}`
  }

  const toggleLang = () => {
    const nl = lang === 'bn' ? 'en' : 'bn'
    setLang(nl)
    localStorage.setItem('nurapp_lang', nl)
  }

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
                {lang === 'bn' ? 'নামাজের সময়সূচি' : 'Prayer Times'}
              </h1>
              {cityName && (
                <div className="flex items-center gap-1 mt-0.5">
                  <MapPinIcon size={10} color="#10b981" />
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{cityName}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={getLocation} className="btn-icon">
              <RefreshIcon size={16} color="var(--text-secondary)" />
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

        {/* Top Info Card */}
        <div className="rounded-3xl p-5 mb-5" style={{ background: 'linear-gradient(135deg, #064e3b, #065f46)', border: '1px solid rgba(16,185,129,0.2)', boxShadow: '0 8px 32px rgba(16,185,129,0.15)' }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-2xl font-bold tabular-nums" style={{ color: 'white', fontFamily: 'Inter' }}>{currentTime}</p>
              <p className="text-xs mt-0.5" style={{ color: '#6ee7b7' }}>
                {new Date().toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 justify-end">
                <MoonIcon size={12} color="#fde68a" />
                <span className="text-xs" style={{ color: '#fde68a' }}>{hijriDate}</span>
              </div>
              {nextPrayer && (
                <p className="text-xs mt-1" style={{ color: '#6ee7b7' }}>
                  {lang === 'bn' ? 'পরবর্তী: ' : 'Next: '}
                  <span className="font-bold text-white">{lang === 'bn' ? PRAYERS.find(p=>p.key===nextPrayer.name)?.nameBn : nextPrayer.name}</span>
                  {' '}<span style={{ color: '#fde68a' }}>({countdown} {lang === 'bn' ? 'বাকি' : 'left'})</span>
                </p>
              )}
            </div>
          </div>

          {/* Prayer progress bar */}
          {times && (
            <div className="flex gap-1">
              {PRAYERS.map(p => {
                const now = new Date()
                const nowMin = now.getHours()*60+now.getMinutes()
                const [h, m] = times[p.key].split(':').map(Number)
                const isPast = h*60+m <= nowMin
                const isCurrent = currentPrayer === p.key
                return (
                  <div key={p.key} className="flex-1">
                    <div className="h-1.5 rounded-full transition-all" style={{
                      background: isCurrent ? '#fbbf24' : isPast ? 'rgba(16,185,129,0.6)' : 'rgba(255,255,255,0.15)'
                    }}></div>
                    <p className="text-center text-xs mt-1.5 font-medium truncate" style={{ color: isCurrent ? '#fbbf24' : 'rgba(255,255,255,0.5)', fontSize: '9px' }}>
                      {lang === 'bn' ? p.nameBn : p.nameEn}
                    </p>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="shimmer h-20 rounded-2xl"></div>
            ))}
          </div>
        ) : (
          <>
            {/* Main Prayers */}
            <div className="space-y-2.5 mb-5">
              {PRAYERS.map((prayer, i) => {
                const now = new Date()
                const nowMin = now.getHours()*60+now.getMinutes()
                const [h, m] = (times?.[prayer.key] || '00:00').split(':').map(Number)
                const pMin = h*60+m
                const isCurrent = currentPrayer === prayer.key
                const isNext = nextPrayer?.name === prayer.key
                const isPast = pMin < nowMin && !isCurrent
                const isExpanded = expandedPrayer === prayer.key

                return (
                  <div key={prayer.key} className={`overflow-hidden transition-all duration-300 animate-fadeInUp stagger-${i+1}`}
                    style={{
                      background: isCurrent ? 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(5,150,105,0.08))' : isNext ? 'rgba(245,158,11,0.06)' : 'var(--bg-card)',
                      border: isCurrent ? '1px solid rgba(16,185,129,0.35)' : isNext ? '1px solid rgba(245,158,11,0.25)' : '1px solid var(--border)',
                      borderRadius: '20px',
                      opacity: isPast ? 0.55 : 1,
                      animationFillMode: 'forwards'
                    }}>
                    <button
                      onClick={() => setExpandedPrayer(isExpanded ? null : prayer.key)}
                      className="w-full p-4 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ background: isCurrent ? 'rgba(16,185,129,0.2)' : isNext ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.05)' }}>
                          <ClockIcon size={20} color={isCurrent ? '#10b981' : isNext ? '#f59e0b' : 'var(--text-muted)'} />
                        </div>
                        <div className="text-left">
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-base" style={{ color: isCurrent ? '#10b981' : isNext ? '#f59e0b' : 'var(--text-primary)' }}>
                              {lang === 'bn' ? prayer.nameBn : prayer.nameEn}
                            </p>
                            {isCurrent && (
                              <span className="badge badge-emerald" style={{ fontSize: '9px', padding: '2px 7px' }}>
                                {lang === 'bn' ? 'এখন' : 'Now'}
                              </span>
                            )}
                            {isNext && !isCurrent && (
                              <span className="badge badge-gold" style={{ fontSize: '9px', padding: '2px 7px' }}>
                                {lang === 'bn' ? 'পরবর্তী' : 'Next'}
                              </span>
                            )}
                          </div>
                          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                            {lang === 'bn' ? prayer.rakahBn : prayer.rakahEn}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold tabular-nums" style={{ color: isCurrent ? '#34d399' : isNext ? '#fbbf24' : 'var(--text-primary)', fontFamily: 'Inter' }}>
                          {fmt(times?.[prayer.key])}
                        </p>
                        {isCurrent && (
                          <p className="text-xs" style={{ color: '#10b981' }}>
                            {countdown} {lang === 'bn' ? 'পরে শেষ' : 'remaining'}
                          </p>
                        )}
                      </div>
                    </button>

                    {/* Expanded Info */}
                    {isExpanded && (
                      <div className="px-4 pb-4 border-t" style={{ borderColor: 'var(--border)' }}>
                        <div className="pt-3 grid grid-cols-2 gap-3">
                          <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.03)' }}>
                            <p className="text-xs font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>
                              {lang === 'bn' ? 'ওয়াক্তের সময়' : 'Prayer Window'}
                            </p>
                            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                              {lang === 'bn' ? prayer.timeBn : prayer.timeEn}
                            </p>
                          </div>
                          <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.03)' }}>
                            <p className="text-xs font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>
                              {lang === 'bn' ? 'রাকাত' : 'Rakah'}
                            </p>
                            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                              {lang === 'bn' ? prayer.rakahBn : prayer.rakahEn}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Extra Times */}
            <p className="section-title">{lang === 'bn' ? 'অতিরিক্ত সময়' : 'Additional Times'}</p>
            <div className="grid grid-cols-2 gap-2.5 mb-5">
              {EXTRA_TIMES.map(({ key, nameBn, nameEn, Icon, color }) => (
                <div key={key} className="card p-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
                    <Icon size={18} color={color} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
                      {lang === 'bn' ? nameBn : nameEn}
                    </p>
                    <p className="text-sm font-bold tabular-nums" style={{ color: 'var(--text-primary)', fontFamily: 'Inter' }}>
                      {fmt(times?.[key])}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Method Info */}
            <div className="rounded-2xl p-4 flex items-start gap-3" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <InfoIcon size={16} color="var(--text-muted)" />
              <div>
                <p className="text-xs font-semibold mb-0.5" style={{ color: 'var(--text-secondary)' }}>
                  {lang === 'bn' ? 'হিসাব পদ্ধতি' : 'Calculation Method'}
                </p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  University of Islamic Sciences, Karachi
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      <BottomNav lang={lang} />
    </main>
  )
}
