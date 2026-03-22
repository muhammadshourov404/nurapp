'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const PRAYER_NAMES = {
  bn: { Fajr: 'ফজর', Sunrise: 'সূর্যোদয়', Dhuhr: 'যোহর', Asr: 'আসর', Maghrib: 'মাগরিব', Isha: 'এশা', Tahajjud: 'তাহাজ্জুদ' },
  en: { Fajr: 'Fajr', Sunrise: 'Sunrise', Dhuhr: 'Dhuhr', Asr: 'Asr', Maghrib: 'Maghrib', Isha: 'Isha', Tahajjud: 'Tahajjud' }
}

const PRAYER_ICONS = { Fajr: '🌅', Sunrise: '☀️', Dhuhr: '🌤️', Asr: '⛅', Maghrib: '🌇', Isha: '🌙', Tahajjud: '⭐' }
const PRAYER_RAKAH = { Fajr: '২ রাকাত', Dhuhr: '৪ রাকাত', Asr: '৪ রাকাত', Maghrib: '৩ রাকাত', Isha: '৪ রাকাত', Tahajjud: '৮ রাকাত' }

export default function PrayerPage() {
  const [times, setTimes] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentPrayer, setCurrentPrayer] = useState('')
  const [nextPrayer, setNextPrayer] = useState(null)
  const [countdown, setCountdown] = useState('')
  const [lang, setLang] = useState('bn')
  const [cityName, setCityName] = useState('ঢাকা')
  const [currentTime, setCurrentTime] = useState('')
  const [method, setMethod] = useState(1)

  useEffect(() => {
    getLocation()
    const t = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }))
    }, 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    if (times) updateCurrentPrayer(times)
  }, [currentTime, times])

  const getLocation = () => {
    setLoading(true)
    navigator.geolocation?.getCurrentPosition(
      async pos => {
        const { latitude: lat, longitude: lon } = pos.coords
        try {
          const geo = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`)
          const geoData = await geo.json()
          setCityName(geoData.address?.city || geoData.address?.town || 'আপনার এলাকা')
        } catch {}
        fetchTimes(lat, lon)
      },
      () => fetchTimes(23.8103, 90.4125)
    )
  }

  const fetchTimes = async (lat, lon) => {
    try {
      const today = new Date()
      const dateStr = `${today.getDate()}-${today.getMonth()+1}-${today.getFullYear()}`
      const res = await fetch(`https://api.aladhan.com/v1/timings/${dateStr}?latitude=${lat}&longitude=${lon}&method=${method}`)
      const data = await res.json()
      const t = data.data.timings

      // Calculate Tahajjud (last third of night)
      const [ishH, ishM] = t.Isha.split(':').map(Number)
      const [fajH, fajM] = t.Fajr.split(':').map(Number)
      const nightMins = (fajH*60+fajM) + (24*60 - (ishH*60+ishM))
      const tahajjudMin = (ishH*60+ishM) + Math.floor(nightMins * 2/3)
      const tH = Math.floor(tahajjudMin/60) % 24
      const tM = tahajjudMin % 60
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
        const diff = h*60+m - nowMin
        next = { name: prayers[i], diff }
        setCountdown(`${Math.floor(diff/60)}ঘ ${diff%60}মি`)
        break
      }
    }
    if (!next) {
      const [h, m] = t['Fajr'].split(':').map(Number)
      const diff = (24*60 - nowMin) + h*60+m
      setCountdown(`${Math.floor(diff/60)}ঘ ${diff%60}মি`)
      next = { name: 'Fajr', diff }
    }
    setNextPrayer(next)
  }

  const formatTime = (time) => {
    if (!time) return '--:--'
    const [h, m] = time.split(':').map(Number)
    const ampm = h >= 12 ? 'PM' : 'AM'
    const hour = h % 12 || 12
    return `${hour}:${m.toString().padStart(2,'0')} ${ampm}`
  }

  const mainPrayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']
  const extraPrayers = ['Sunrise', 'Tahajjud']

  return (
    <main className="min-h-screen bg-gray-950 pb-24">
      <header className="sticky top-0 z-50 bg-gray-950/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all text-lg">←</Link>
            <h1 className="text-base font-bold text-white">🕐 {lang === 'bn' ? 'নামাজের সময়' : 'Prayer Times'}</h1>
          </div>
          <button onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
            className="px-3 py-1.5 rounded-lg bg-white/10 text-xs font-bold transition-all border border-white/10">
            {lang === 'bn' ? 'EN' : 'বাং'}
          </button>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-5">

        {/* Top Card */}
        <div className="rounded-2xl bg-gradient-to-br from-emerald-900 to-green-950 border border-emerald-700/30 p-5 mb-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-emerald-400 text-xs">📍 {cityName}</p>
              <p className="text-white font-bold text-lg">{currentTime}</p>
            </div>
            <button onClick={getLocation}
              className="w-9 h-9 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 flex items-center justify-center text-lg transition-all">
              🔄
            </button>
          </div>
          {nextPrayer && (
            <div className="rounded-xl bg-white/10 p-3 flex items-center justify-between">
              <div>
                <p className="text-xs text-emerald-300">{lang === 'bn' ? 'পরবর্তী নামাজ' : 'Next Prayer'}</p>
                <p className="text-white font-bold">{lang === 'bn' ? PRAYER_NAMES.bn[nextPrayer.name] : PRAYER_NAMES.en[nextPrayer.name]}</p>
              </div>
              <div className="text-right">
                <p className="text-amber-300 font-bold">{formatTime(times?.[nextPrayer.name])}</p>
                <p className="text-xs text-gray-400">⏱ {countdown} {lang === 'bn' ? 'বাকি' : 'left'}</p>
              </div>
            </div>
          )}
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-gray-400 text-sm">{lang === 'bn' ? 'লোড হচ্ছে...' : 'Loading...'}</p>
          </div>
        ) : (
          <>
            {/* Main Prayers */}
            <div className="space-y-2 mb-4">
              {mainPrayers.map(prayer => {
                const isActive = currentPrayer === prayer
                const isNext = nextPrayer?.name === prayer
                return (
                  <div key={prayer}
                    className={`rounded-2xl p-4 flex items-center justify-between transition-all ${
                      isActive ? 'bg-gradient-to-r from-emerald-600 to-green-600 shadow-lg shadow-emerald-500/20' :
                      isNext ? 'bg-white/10 border border-amber-500/40' :
                      'bg-white/5 border border-white/10'
                    }`}>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{PRAYER_ICONS[prayer]}</span>
                      <div>
                        <p className="text-white font-bold">
                          {lang === 'bn' ? PRAYER_NAMES.bn[prayer] : PRAYER_NAMES.en[prayer]}
                        </p>
                        <p className={`text-xs ${isActive ? 'text-emerald-100' : 'text-gray-500'}`}>
                          {PRAYER_RAKAH[prayer]}
                          {isActive && ` • ${lang === 'bn' ? 'এখনকার ওয়াক্ত' : 'Current'} ✅`}
                          {isNext && !isActive && ` • ${lang === 'bn' ? 'পরবর্তী' : 'Next'} ⏳`}
                        </p>
                      </div>
                    </div>
                    <p className={`font-bold text-lg tabular-nums ${isActive ? 'text-white' : 'text-emerald-300'}`}>
                      {formatTime(times?.[prayer])}
                    </p>
                  </div>
                )
              })}
            </div>

            {/* Extra Times */}
            <div className="grid grid-cols-2 gap-2">
              {extraPrayers.map(prayer => (
                <div key={prayer} className="rounded-xl bg-white/5 border border-white/10 p-3 text-center">
                  <span className="text-xl">{PRAYER_ICONS[prayer]}</span>
                  <p className="text-gray-400 text-xs mt-1">{lang === 'bn' ? PRAYER_NAMES.bn[prayer] : PRAYER_NAMES.en[prayer]}</p>
                  <p className="text-white font-bold text-sm">{formatTime(times?.[prayer])}</p>
                </div>
              ))}
            </div>

            {/* Method Info */}
            <div className="mt-4 rounded-xl bg-white/5 border border-white/10 p-3 text-center">
              <p className="text-gray-500 text-xs">
                {lang === 'bn' ? '📐 হিসাব পদ্ধতি: University of Islamic Sciences, Karachi' : '📐 Method: University of Islamic Sciences, Karachi'}
              </p>
            </div>
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
              className={`flex flex-col items-center gap-1 px-2 py-1 rounded-xl transition-all ${item.href === '/prayer' ? 'bg-emerald-600/20' : 'hover:bg-white/10'}`}>
              <span className="text-xl">{item.icon}</span>
              <span className={`text-xs ${item.href === '/prayer' ? 'text-emerald-400' : 'text-gray-400'}`}>{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </main>
  )
}
