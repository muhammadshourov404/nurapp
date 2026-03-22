'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const ISLAMIC_MONTHS_BN = ['মুহাররম','সফর','রবিউল আউয়াল','রবিউল আখির','জুমাদাল উলা','জুমাদাল আখিরা','রজব','শাবান','রমজান','শাওয়াল','জিলকদ','জিলহজ']
const ISLAMIC_MONTHS_EN = ['Muharram','Safar',"Rabi' al-Awwal","Rabi' al-Akhir",'Jumada al-Ula','Jumada al-Akhirah','Rajab',"Sha'ban",'Ramadan','Shawwal',"Dhu al-Qi'dah",'Dhu al-Hijjah']

const EVENTS = [
  { month: 1, day: 1, bn: 'ইসলামিক নববর্ষ', en: 'Islamic New Year', icon: '🌙', color: 'emerald' },
  { month: 1, day: 10, bn: 'আশুরা', en: 'Ashura', icon: '💧', color: 'blue' },
  { month: 3, day: 12, bn: 'ঈদে মিলাদুন্নবী ﷺ', en: "Mawlid al-Nabi ﷺ", icon: '🌟', color: 'amber' },
  { month: 7, day: 27, bn: 'শবে মেরাজ', en: 'Laylat al-Miraj', icon: '✨', color: 'purple' },
  { month: 8, day: 15, bn: 'শবে বরাত', en: "Laylat al-Bara'at", icon: '🌕', color: 'yellow' },
  { month: 9, day: 1, bn: 'রমজান শুরু', en: 'Ramadan Begins', icon: '🌙', color: 'emerald' },
  { month: 9, day: 21, bn: 'শবে কদর (সম্ভাব্য)', en: 'Laylat al-Qadr (probable)', icon: '⭐', color: 'amber' },
  { month: 9, day: 23, bn: 'শবে কদর (সম্ভাব্য)', en: 'Laylat al-Qadr (probable)', icon: '⭐', color: 'amber' },
  { month: 9, day: 25, bn: 'শবে কদর (সম্ভাব্য)', en: 'Laylat al-Qadr (probable)', icon: '⭐', color: 'amber' },
  { month: 9, day: 27, bn: 'শবে কদর (মূল)', en: 'Laylat al-Qadr (main)', icon: '🌟', color: 'gold' },
  { month: 10, day: 1, bn: 'ঈদুল ফিতর', en: 'Eid al-Fitr', icon: '🎉', color: 'green' },
  { month: 12, day: 8, bn: 'হজ শুরু', en: 'Hajj Begins', icon: '🕋', color: 'emerald' },
  { month: 12, day: 9, bn: 'আরাফার দিন', en: 'Day of Arafah', icon: '🏔️', color: 'orange' },
  { month: 12, day: 10, bn: 'ঈদুল আযহা', en: 'Eid al-Adha', icon: '🐑', color: 'green' },
]

export default function CalendarPage() {
  const [hijri, setHijri] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lang, setLang] = useState('bn')
  const [selectedMonth, setSelectedMonth] = useState(null)
  const [ramadanCountdown, setRamadanCountdown] = useState(null)
  const [tab, setTab] = useState('today')

  useEffect(() => {
    fetchHijri()
  }, [])

  const fetchHijri = async () => {
    try {
      const today = new Date()
      const d = `${today.getDate()}-${today.getMonth()+1}-${today.getFullYear()}`
      const res = await fetch(`https://api.aladhan.com/v1/gToH?date=${d}`)
      const data = await res.json()
      const h = data.data.hijri
      setHijri(h)
      setSelectedMonth(parseInt(h.month.number))

      // Ramadan countdown
      const ramadanMonth = 9
      const currentHijriMonth = parseInt(h.month.number)
      const currentHijriDay = parseInt(h.day)

      if (currentHijriMonth === ramadanMonth) {
        setRamadanCountdown({ type: 'ongoing', daysLeft: 30 - currentHijriDay })
      } else if (currentHijriMonth < ramadanMonth) {
        let days = 0
        for (let m = currentHijriMonth; m < ramadanMonth; m++) days += 30
        days -= currentHijriDay
        setRamadanCountdown({ type: 'countdown', days })
      } else {
        setRamadanCountdown({ type: 'next', days: 360 - currentHijriDay })
      }
    } catch {}
    setLoading(false)
  }

  const monthEvents = selectedMonth ? EVENTS.filter(e => e.month === selectedMonth) : []
  const upcomingEvents = EVENTS.filter(e => {
    if (!hijri) return false
    const currentMonth = parseInt(hijri.month.number)
    const currentDay = parseInt(hijri.day)
    return e.month > currentMonth || (e.month === currentMonth && e.day >= currentDay)
  }).slice(0, 5)

  const colorMap = {
    emerald: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    amber: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    yellow: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    orange: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    green: 'bg-green-500/20 text-green-400 border-green-500/30',
    gold: 'bg-amber-400/20 text-amber-300 border-amber-400/30',
  }

  return (
    <main className="min-h-screen bg-gray-950 pb-24">
      <header className="sticky top-0 z-50 bg-gray-950/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all text-lg">←</Link>
            <h1 className="text-base font-bold text-white">🗓️ {lang === 'bn' ? 'ইসলামিক ক্যালেন্ডার' : 'Islamic Calendar'}</h1>
          </div>
          <button onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
            className="px-3 py-1.5 rounded-lg bg-white/10 text-xs font-bold border border-white/10">
            {lang === 'bn' ? 'EN' : 'বাং'}
          </button>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-5">

        {loading ? (
          <div className="text-center py-16">
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-gray-400 text-sm">{lang === 'bn' ? 'লোড হচ্ছে...' : 'Loading...'}</p>
          </div>
        ) : (
          <>
            {/* Today's Date Card */}
            {hijri && (
              <div className="rounded-2xl bg-gradient-to-br from-emerald-900 to-teal-950 border border-emerald-700/30 p-5 text-center mb-5">
                <p className="text-emerald-300 text-xs mb-2">📅 {lang === 'bn' ? 'আজকের হিজরি তারিখ' : "Today's Hijri Date"}</p>
                <p className="font-arabic text-4xl text-amber-300 leading-loose mb-1">
                  {hijri.day} {hijri.month.ar} {hijri.year}
                </p>
                <p className="text-white text-xl font-bold">
                  {hijri.day} {lang === 'bn' ? ISLAMIC_MONTHS_BN[parseInt(hijri.month.number)-1] : hijri.month.en} {hijri.year} AH
                </p>
                <div className="w-full h-px bg-white/10 my-3"></div>
                <p className="text-emerald-200 text-sm">
                  {new Date().toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US', {
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                  })}
                </p>
              </div>
            )}

            {/* Ramadan Countdown */}
            {ramadanCountdown && (
              <div className={`rounded-2xl border p-4 mb-5 text-center ${
                ramadanCountdown.type === 'ongoing'
                  ? 'bg-emerald-600/20 border-emerald-500/30'
                  : 'bg-amber-500/10 border-amber-500/20'
              }`}>
                <p className="text-2xl mb-1">🌙</p>
                {ramadanCountdown.type === 'ongoing' ? (
                  <>
                    <p className="text-emerald-400 font-bold">{lang === 'bn' ? 'রমজান মাস চলছে!' : 'Ramadan is ongoing!'}</p>
                    <p className="text-gray-300 text-sm">{lang === 'bn' ? `আরো ${ramadanCountdown.daysLeft} দিন বাকি` : `${ramadanCountdown.daysLeft} days remaining`}</p>
                  </>
                ) : (
                  <>
                    <p className="text-amber-400 font-bold">{lang === 'bn' ? 'রমজান পর্যন্ত' : 'Until Ramadan'}</p>
                    <p className="text-white text-2xl font-bold">{lang === 'bn' ? `~${ramadanCountdown.days} দিন` : `~${ramadanCountdown.days} days`}</p>
                  </>
                )}
              </div>
            )}

            {/* Tabs */}
            <div className="flex gap-2 mb-5">
              {[
                { id: 'today', label: lang === 'bn' ? 'আজকের ইভেন্ট' : 'Today' },
                { id: 'upcoming', label: lang === 'bn' ? 'আসন্ন' : 'Upcoming' },
                { id: 'months', label: lang === 'bn' ? 'মাস' : 'Months' },
                { id: 'all', label: lang === 'bn' ? 'সব ইভেন্ট' : 'All Events' },
              ].map(t => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${tab === t.id ? 'bg-emerald-600 text-white' : 'bg-white/5 text-gray-400 border border-white/10'}`}>
                  {t.label}
                </button>
              ))}
            </div>

            {/* Tab: Today */}
            {tab === 'today' && hijri && (
              <div>
                {EVENTS.filter(e => e.month === parseInt(hijri.month.number) && e.day === parseInt(hijri.day)).length === 0 ? (
                  <div className="text-center py-10 rounded-2xl bg-white/5 border border-white/10">
                    <p className="text-3xl mb-2">📅</p>
                    <p className="text-gray-400 text-sm">{lang === 'bn' ? 'আজ কোনো বিশেষ দিন নেই' : 'No special events today'}</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {EVENTS.filter(e => e.month === parseInt(hijri.month.number) && e.day === parseInt(hijri.day)).map((e, i) => (
                      <EventCard key={i} event={e} lang={lang} colorMap={colorMap}
                        months={{ bn: ISLAMIC_MONTHS_BN, en: ISLAMIC_MONTHS_EN }} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab: Upcoming */}
            {tab === 'upcoming' && (
              <div className="space-y-3">
                {upcomingEvents.map((e, i) => (
                  <EventCard key={i} event={e} lang={lang} colorMap={colorMap}
                    months={{ bn: ISLAMIC_MONTHS_BN, en: ISLAMIC_MONTHS_EN }} />
                ))}
              </div>
            )}

            {/* Tab: Months */}
            {tab === 'months' && (
              <div>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {ISLAMIC_MONTHS_BN.map((m, i) => (
                    <button key={i} onClick={() => setSelectedMonth(i+1)}
                      className={`rounded-xl p-3 text-center transition-all border ${
                        selectedMonth === i+1 ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'
                      }`}>
                      <span className="block text-xs text-gray-400 mb-0.5">{i+1}</span>
                      <span className="text-xs font-medium">{lang === 'bn' ? m : ISLAMIC_MONTHS_EN[i].split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
                {selectedMonth && (
                  <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
                    <div className="p-3 bg-emerald-900/30 border-b border-white/10">
                      <p className="text-emerald-400 font-bold text-sm">
                        🌙 {lang === 'bn' ? ISLAMIC_MONTHS_BN[selectedMonth-1] : ISLAMIC_MONTHS_EN[selectedMonth-1]}
                      </p>
                    </div>
                    {monthEvents.length === 0 ? (
                      <p className="text-gray-500 text-sm text-center py-6">{lang === 'bn' ? 'কোনো বিশেষ দিন নেই' : 'No special events'}</p>
                    ) : (
                      <div className="divide-y divide-white/5">
                        {monthEvents.map((e, i) => (
                          <EventCard key={i} event={e} lang={lang} colorMap={colorMap}
                            months={{ bn: ISLAMIC_MONTHS_BN, en: ISLAMIC_MONTHS_EN }} compact />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Tab: All Events */}
            {tab === 'all' && (
              <div className="space-y-2">
                {EVENTS.map((e, i) => (
                  <EventCard key={i} event={e} lang={lang} colorMap={colorMap}
                    months={{ bn: ISLAMIC_MONTHS_BN, en: ISLAMIC_MONTHS_EN }} />
                ))}
              </div>
            )}
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
              className={`flex flex-col items-center gap-1 px-2 py-1 rounded-xl transition-all ${item.href === '/calendar' ? 'bg-emerald-600/20' : 'hover:bg-white/10'}`}>
              <span className="text-xl">{item.icon}</span>
              <span className={`text-xs ${item.href === '/calendar' ? 'text-emerald-400' : 'text-gray-400'}`}>{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </main>
  )
}

function EventCard({ event, lang, colorMap, months, compact }) {
  return (
    <div className={`flex items-center gap-3 ${compact ? 'p-3' : 'rounded-xl bg-white/5 border border-white/10 p-4'}`}>
      <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center border flex-shrink-0 ${colorMap[event.color] || colorMap.emerald}`}>
        <span className="text-lg">{event.icon}</span>
        <span className="text-xs font-bold">{event.day}</span>
      </div>
      <div>
        <p className="text-white font-bold text-sm">{lang === 'bn' ? event.bn : event.en}</p>
        <p className="text-gray-500 text-xs">
          {lang === 'bn' ? months.bn[event.month-1] : months.en[event.month-1]} {event.day}
        </p>
      </div>
    </div>
  )
}
