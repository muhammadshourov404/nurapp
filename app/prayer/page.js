'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function PrayerPage() {
  const [prayerTimes, setPrayerTimes] = useState(null)
  const [location, setLocation] = useState({ city: 'ঢাকা', country: 'Bangladesh' })
  const [loading, setLoading] = useState(true)
  const [currentPrayer, setCurrentPrayer] = useState('')
  const [lang, setLang] = useState('bn')

  const prayerNames = {
    bn: { Fajr: 'ফজর', Dhuhr: 'যোহর', Asr: 'আসর', Maghrib: 'মাগরিব', Isha: 'এশা' },
    en: { Fajr: 'Fajr', Dhuhr: 'Dhuhr', Asr: 'Asr', Maghrib: 'Maghrib', Isha: 'Isha' }
  }

  const prayerIcons = {
    Fajr: '🌅', Dhuhr: '☀️', Asr: '🌤️', Maghrib: '🌇', Isha: '🌙'
  }

  useEffect(() => {
    fetchPrayerTimes(23.8103, 90.4125)
    navigator.geolocation?.getCurrentPosition(
      pos => fetchPrayerTimes(pos.coords.latitude, pos.coords.longitude),
      () => {}
    )
  }, [])

  const fetchPrayerTimes = async (lat, lon) => {
    try {
      setLoading(true)
      const today = new Date()
      const dateStr = `${today.getDate()}-${today.getMonth()+1}-${today.getFullYear()}`
      const res = await fetch(`https://api.aladhan.com/v1/timings/${dateStr}?latitude=${lat}&longitude=${lon}&method=1`)
      const data = await res.json()
      setPrayerTimes(data.data.timings)

      // Find current prayer
      const now = new Date()
      const currentMinutes = now.getHours() * 60 + now.getMinutes()
      const times = data.data.timings
      const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']
      let current = 'Isha'
      for (let p of prayers) {
        const [h, m] = times[p].split(':').map(Number)
        if (currentMinutes >= h * 60 + m) current = p
      }
      setCurrentPrayer(current)
      setLoading(false)
    } catch {
      setLoading(false)
    }
  }

  const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']

  const formatTime = (time) => {
    if (!time) return ''
    const [h, m] = time.split(':').map(Number)
    const ampm = h >= 12 ? 'PM' : 'AM'
    const hour = h % 12 || 12
    return `${hour}:${m.toString().padStart(2, '0')} ${ampm}`
  }

  return (
    <main className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/nurapp" className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all">
              ←
            </Link>
            <h1 className="text-lg font-bold text-white">
              {lang === 'bn' ? '🕐 নামাজের সময়' : '🕐 Prayer Times'}
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

      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* Location Card */}
        <div className="rounded-2xl gradient-green p-6 mb-6 text-center">
          <p className="text-emerald-200 text-sm mb-1">📍 {location.city}, {location.country}</p>
          <p className="text-white text-lg font-bold">
            {new Date().toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US', {
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
            })}
          </p>
        </div>

        {/* Prayer Times */}
        {loading ? (
          <div className="text-center py-16">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">{lang === 'bn' ? 'লোড হচ্ছে...' : 'Loading...'}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {prayers.map((prayer) => (
              <div
                key={prayer}
                className={`rounded-2xl p-5 flex items-center justify-between transition-all ${
                  currentPrayer === prayer ? 'active-prayer animate-pulse-green' : 'prayer-card'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl">{prayerIcons[prayer]}</span>
                  <div>
                    <p className="text-white font-bold text-lg">
                      {prayerNames[lang][prayer]}
                    </p>
                    {currentPrayer === prayer && (
                      <p className="text-emerald-300 text-xs">
                        {lang === 'bn' ? '✅ এখনকার ওয়াক্ত' : '✅ Current Prayer'}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold text-xl">
                    {formatTime(prayerTimes?.[prayer])}
  	            </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Extra Info */}
        {prayerTimes && (
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-white/5 p-4 text-center">
              <p className="text-amber-400 text-2xl mb-1">🌅</p>
              <p className="text-gray-400 text-xs">{lang === 'bn' ? 'সূর্যোদয়' : 'Sunrise'}</p>
              <p className="text-white font-bold">{formatTime(prayerTimes.Sunrise)}</p>
            </div>
            <div className="rounded-xl bg-white/5 p-4 text-center">
              <p className="text-amber-400 text-2xl mb-1">🌇</p>
              <p className="text-gray-400 text-xs">{lang === 'bn' ? 'সূর্যাস্ত' : 'Sunset'}</p>
              <p className="text-white font-bold">{formatTime(prayerTimes.Sunset)}</p>
            </div>
          </div>
        )}

      </div>
    </main>
  )
}
