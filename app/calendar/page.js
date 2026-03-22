'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const ISLAMIC_MONTHS = {
  bn: ['মুহাররম', 'সফর', 'রবিউল আউয়াল', 'রবিউল আখির', 'জুমাদাল উলা', 'জুমাদাল আখিরা', 'রজব', 'শাবান', 'রমজান', 'শাওয়াল', 'জিলকদ', 'জিলহজ'],
  en: ['Muharram', 'Safar', "Rabi' al-Awwal", "Rabi' al-Akhir", 'Jumada al-Ula', 'Jumada al-Akhirah', 'Rajab', "Sha'ban", 'Ramadan', 'Shawwal', "Dhu al-Qi'dah", 'Dhu al-Hijjah']
}

const ISLAMIC_EVENTS = {
  '1-1': { bn: 'ইসলামিক নববর্ষ', en: 'Islamic New Year' },
  '1-10': { bn: 'আশুরা', en: 'Ashura' },
  '3-12': { bn: 'ঈদে মিলাদুন্নবী ﷺ', en: "Mawlid al-Nabi ﷺ" },
  '7-27': { bn: 'শবে মেরাজ', en: 'Laylat al-Miraj' },
  '8-15': { bn: 'শবে বরাত', en: "Laylat al-Bara'at" },
  '9-1': { bn: 'রমজান শুরু', en: 'Ramadan Begins' },
  '9-27': { bn: 'শবে কদর', en: 'Laylat al-Qadr' },
  '10-1': { bn: 'ঈদুল ফিতর', en: 'Eid al-Fitr' },
  '12-9': { bn: 'আরাফার দিন', en: 'Day of Arafah' },
  '12-10': { bn: 'ঈদুল আযহা', en: 'Eid al-Adha' },
}

export default function CalendarPage() {
  const [hijriData, setHijriData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lang, setLang] = useState('bn')
  const [selectedMonth, setSelectedMonth] = useState(null)

  useEffect(() => {
    fetchHijriDate()
  }, [])

  const fetchHijriDate = async () => {
    try {
      const today = new Date()
      const dateStr = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`
      const res = await fetch(`https://api.aladhan.com/v1/gToH?date=${dateStr}`)
      const data = await res.json()
      setHijriData(data.data.hijri)
      setSelectedMonth(parseInt(data.data.hijri.month.number))
    } catch {
      setHijriData(null)
    }
    setLoading(false)
  }

  const getEventsForMonth = (monthNum) => {
    return Object.entries(ISLAMIC_EVENTS).filter(([key]) => {
      const [month] = key.split('-')
      return parseInt(month) === monthNum
    })
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
              {lang === 'bn' ? '🗓️ ইসলামিক ক্যালেন্ডার' : '🗓️ Islamic Calendar'}
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

        {/* Today's Hijri Date */}
        {loading ? (
          <div className="text-center py-10">
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-gray-400 text-sm">{lang === 'bn' ? 'লোড হচ্ছে...' : 'Loading...'}</p>
          </div>
        ) : hijriData && (
          <div className="rounded-2xl gradient-green p-6 text-center mb-6">
            <p className="text-emerald-200 text-sm mb-2">
              {lang === 'bn' ? '📅 আজকের হিজরি তারিখ' : "📅 Today's Hijri Date"}
            </p>
            <p className="font-arabic text-4xl text-amber-300 mb-2">
              {hijriData.day} {hijriData.month.ar} {hijriData.year}
            </p>
            <p className="text-white text-xl font-bold">
              {hijriData.day} {lang === 'bn' ? ISLAMIC_MONTHS.bn[parseInt(hijriData.month.number) - 1] : hijriData.month.en} {hijriData.year} AH
            </p>
            <p className="text-emerald-200 text-sm mt-2">
              {new Date().toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
              })}
            </p>
          </div>
        )}

        {/* Month Selector */}
        <div className="mb-6">
          <p className="text-gray-400 text-sm mb-3">
            {lang === 'bn' ? 'মাস নির্বাচন করুন:' : 'Select Month:'}
          </p>
          <div className="grid grid-cols-3 gap-2">
            {ISLAMIC_MONTHS[lang].map((month, i) => (
              <button
                key={i}
                onClick={() => setSelectedMonth(i + 1)}
                className={`rounded-xl p-3 text-sm font-medium transition-all text-center ${
                  selectedMonth === i + 1
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                <span className="block text-xs text-gray-400 mb-0.5">{i + 1}</span>
                {month}
              </button>
            ))}
          </div>
        </div>

        {/* Events for Selected Month */}
        {selectedMonth && (
          <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
            <div className="p-4 border-b border-white/10 bg-emerald-900/20">
              <p className="text-emerald-400 font-bold">
                🌙 {lang === 'bn' ? ISLAMIC_MONTHS.bn[selectedMonth - 1] : ISLAMIC_MONTHS.en[selectedMonth - 1]}
                {lang === 'bn' ? ' মাসের গুরুত্বপূর্ণ দিন' : ' — Important Days'}
              </p>
            </div>
            <div className="p-4">
              {getEventsForMonth(selectedMonth).length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">
                  {lang === 'bn' ? 'এই মাসে কোনো বিশেষ দিন নেই' : 'No special events this month'}
                </p>
              ) : (
                <div className="space-y-3">
                  {getEventsForMonth(selectedMonth).map(([key, event]) => {
                    const [, day] = key.split('-')
                    return (
                      <div key={key} className="flex items-center gap-4 rounded-xl bg-white/5 p-3">
                        <div className="w-12 h-12 rounded-xl bg-emerald-600/30 flex items-center justify-center text-emerald-400 font-bold">
                          {day}
                        </div>
                        <div>
                          <p className="text-white font-bold text-sm">
                            {lang === 'bn' ? event.bn : event.en}
                          </p>
                          <p className="text-gray-400 text-xs">
                            {lang === 'bn'
                              ? `${ISLAMIC_MONTHS.bn[selectedMonth - 1]} ${day}`
                              : `${ISLAMIC_MONTHS.en[selectedMonth - 1]} ${day}`}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* All Events */}
        <div className="mt-6 rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
          <div className="p-4 border-b border-white/10">
            <p className="text-amber-400 font-bold">
              ⭐ {lang === 'bn' ? 'সকল ইসলামিক দিবস' : 'All Islamic Events'}
            </p>
          </div>
          <div className="divide-y divide-white/5">
            {Object.entries(ISLAMIC_EVENTS).map(([key, event]) => {
              const [month, day] = key.split('-')
              return (
                <div key={key} className="flex items-center gap-4 p-4">
                  <div className="w-16 text-center">
                    <p className="text-emerald-400 font-bold text-sm">
                      {lang === 'bn' ? ISLAMIC_MONTHS.bn[parseInt(month) - 1].slice(0, 4) : ISLAMIC_MONTHS.en[parseInt(month) - 1].slice(0, 3)}
                    </p>
                    <p className="text-gray-400 text-xs">{day}</p>
                  </div>
                  <p className="text-white text-sm">
                    {lang === 'bn' ? event.bn : event.en}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </main>
  )
}
