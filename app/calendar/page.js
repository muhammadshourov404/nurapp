'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import BottomNav from '../../components/BottomNav'
import { ChevronLeftIcon, MoonIcon, CalendarIcon, StarIcon, ArrowRightIcon, InfoIcon } from '../../components/Icons'

const HIJRI_MONTHS_BN = ['মুহাররম','সফর','রবিউল আউয়াল','রবিউল আখির','জুমাদাল উলা','জুমাদাল আখিরা','রজব','শাবান','রমজান','শাওয়াল','জিলকদ','জিলহজ']
const HIJRI_MONTHS_EN = ['Muharram','Safar',"Rabi' al-Awwal","Rabi' al-Akhir",'Jumada al-Ula','Jumada al-Akhirah','Rajab',"Sha'ban",'Ramadan','Shawwal',"Dhu al-Qi'dah",'Dhu al-Hijjah']

const MONTH_INFO = [
  { virtue: 'হারাম মাস। এ মাসে রোজা রাখা অত্যন্ত ফযিলতপূর্ণ।', virtueEn: 'Sacred month. Fasting in this month is highly virtuous.' },
  { virtue: 'এ মাসে বিশেষ কোনো নির্দিষ্ট আমল নেই তবে নফল ইবাদত বেশি করা উচিত।', virtueEn: 'No specific prescribed acts, but increasing voluntary worship is encouraged.' },
  { virtue: 'এ মাসের ১২ তারিখ নবী করীম ﷺ জন্মগ্রহণ করেন।', virtueEn: 'The Prophet ﷺ was born on the 12th of this month.' },
  { virtue: 'এ মাসে নফল রোজা রাখা উত্তম।', virtueEn: 'Keeping voluntary fasts in this month is recommended.' },
  { virtue: 'এ মাসে বেশি বেশি ইস্তিগফার ও দোয়া করা উচিত।', virtueEn: 'Increasing supplication and seeking forgiveness is encouraged.' },
  { virtue: 'এ মাসে বেশি বেশি ইবাদত করা উচিত।', virtueEn: 'Increasing acts of worship in this month is encouraged.' },
  { virtue: 'হারাম মাস। এ মাসে ইবাদত বেশি করা উচিত।', virtueEn: 'Sacred month. Increasing worship is encouraged.' },
  { virtue: 'রমজানের প্রস্তুতির মাস। নফল রোজা রাখা সুন্নত।', virtueEn: 'Month of preparation for Ramadan. Keeping voluntary fasts is Sunnah.' },
  { virtue: 'সিয়ামের মাস। ফরজ রোজা, তারাবিহ, লাইলাতুল কদর এ মাসে।', virtueEn: 'Month of fasting. Obligatory fasts, Tarawih, and Laylat al-Qadr are in this month.' },
  { virtue: 'ঈদুল ফিতরের মাস। প্রথম ছয় দিন রোজা রাখা অত্যন্ত ফযিলতপূর্ণ।', virtueEn: 'Month of Eid al-Fitr. Fasting six days after Eid is highly virtuous.' },
  { virtue: 'হারাম মাস। এ মাসে হজের প্রস্তুতি নেওয়া হয়।', virtueEn: 'Sacred month. Preparations for Hajj are made in this month.' },
  { virtue: 'হারাম মাস। হজ, ঈদুল আযহা ও কোরবানির মাস।', virtueEn: 'Sacred month. Month of Hajj, Eid al-Adha, and sacrifice.' },
]

const EVENTS = [
  { month: 1, day: 1, nameBn: 'ইসলামিক নববর্ষ', nameEn: 'Islamic New Year', color: '#10b981', important: true },
  { month: 1, day: 10, nameBn: 'আশুরা', nameEn: 'Day of Ashura', color: '#3b82f6', important: true },
  { month: 3, day: 12, nameBn: 'ঈদে মিলাদুন্নবী ﷺ', nameEn: "Mawlid al-Nabi ﷺ", color: '#f59e0b', important: true },
  { month: 7, day: 27, nameBn: 'শবে মেরাজ', nameEn: 'Laylat al-Miraj', color: '#8b5cf6', important: true },
  { month: 8, day: 15, nameBn: 'শবে বরাত', nameEn: "Laylat al-Bara'at", color: '#ec4899', important: true },
  { month: 9, day: 1, nameBn: 'রমজান শুরু', nameEn: 'Ramadan Begins', color: '#10b981', important: true },
  { month: 9, day: 21, nameBn: 'শবে কদর (২১তম রাত)', nameEn: 'Laylat al-Qadr (21st)', color: '#f59e0b', important: false },
  { month: 9, day: 23, nameBn: 'শবে কদর (২৩তম রাত)', nameEn: 'Laylat al-Qadr (23rd)', color: '#f59e0b', important: false },
  { month: 9, day: 25, nameBn: 'শবে কদর (২৫তম রাত)', nameEn: 'Laylat al-Qadr (25th)', color: '#f59e0b', important: false },
  { month: 9, day: 27, nameBn: 'শবে কদর (২৭তম রাত — মূল)', nameEn: 'Laylat al-Qadr (27th — Main)', color: '#fbbf24', important: true },
  { month: 9, day: 29, nameBn: 'শবে কদর (২৯তম রাত)', nameEn: 'Laylat al-Qadr (29th)', color: '#f59e0b', important: false },
  { month: 10, day: 1, nameBn: 'ঈদুল ফিতর', nameEn: 'Eid al-Fitr', color: '#10b981', important: true },
  { month: 10, day: 2, nameBn: 'ঈদের দ্বিতীয় দিন', nameEn: 'Second Day of Eid', color: '#10b981', important: false },
  { month: 10, day: 3, nameBn: 'ঈদের তৃতীয় দিন', nameEn: 'Third Day of Eid', color: '#10b981', important: false },
  { month: 12, day: 1, nameBn: 'জিলহজের প্রথম দিন', nameEn: 'First of Dhul Hijjah', color: '#f59e0b', important: false },
  { month: 12, day: 8, nameBn: 'হজ শুরু', nameEn: 'Hajj Begins', color: '#10b981', important: true },
  { month: 12, day: 9, nameBn: 'আরাফার দিন', nameEn: 'Day of Arafah', color: '#ef4444', important: true },
  { month: 12, day: 10, nameBn: 'ঈদুল আযহা', nameEn: 'Eid al-Adha', color: '#10b981', important: true },
  { month: 12, day: 11, nameBn: 'আইয়ামুত তাশরিক (১ম দিন)', nameEn: 'Days of Tashriq (1st)', color: '#f97316', important: false },
  { month: 12, day: 12, nameBn: 'আইয়ামুত তাশরিক (২য় দিন)', nameEn: 'Days of Tashriq (2nd)', color: '#f97316', important: false },
  { month: 12, day: 13, nameBn: 'আইয়ামুত তাশরিক (৩য় দিন)', nameEn: 'Days of Tashriq (3rd)', color: '#f97316', important: false },
]

const IMPORTANT_DAYS_INFO = [
  { nameBn: 'আশুরা', nameEn: 'Ashura', infoBn: 'মুহাররমের ১০ তারিখ। এই দিন মুসা (আ) ও তাঁর উম্মত ফেরাউনের কবল থেকে মুক্তি পান। রোজা রাখা সুন্নত।', infoEn: "10th of Muharram. Moses (AS) and his people were saved from Pharaoh. Fasting is Sunnah.", color: '#3b82f6' },
  { nameBn: 'শবে মেরাজ', nameEn: 'Laylat al-Miraj', infoBn: 'রজবের ২৭ তারিখের রাত। নবী করীম ﷺ মিরাজে গমন করেন এবং পাঁচ ওয়াক্ত নামাজ ফরজ হয়।', infoEn: "Night of 27th Rajab. The Prophet ﷺ ascended to the heavens and the five daily prayers were ordained.", color: '#8b5cf6' },
  { nameBn: 'শবে বরাত', nameEn: "Laylat al-Bara'at", infoBn: 'শাবানের ১৫ তারিখের রাত। এই রাতে আল্লাহ তায়ালা বান্দাদের ভাগ্য নির্ধারণ করেন বলে বিশ্বাস করা হয়।', infoEn: "Night of 15th Sha'ban. Believed to be the night when Allah determines the fate of His servants.", color: '#ec4899' },
  { nameBn: 'শবে কদর', nameEn: 'Laylat al-Qadr', infoBn: 'রমজানের শেষ দশকের বিজোড় রাতগুলোতে। এই রাত হাজার মাসের চেয়ে উত্তম। কোরআন নাযিলের রাত।', infoEn: 'In the odd nights of the last ten days of Ramadan. Better than a thousand months. The night Quran was revealed.', color: '#fbbf24' },
  { nameBn: 'আরাফার দিন', nameEn: 'Day of Arafah', infoBn: 'জিলহজের ৯ তারিখ। এই দিন রোজা রাখলে দুই বছরের গুনাহ মাফ হয়। হাজিরা আরাফায় অবস্থান করেন।', infoEn: '9th of Dhul Hijjah. Fasting on this day expiates sins of two years. Pilgrims stand at Arafah.', color: '#ef4444' },
]

export default function CalendarPage() {
  const [hijri, setHijri] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lang, setLang] = useState('bn')
  const [selectedMonth, setSelectedMonth] = useState(null)
  const [tab, setTab] = useState('today')
  const [ramadanInfo, setRamadanInfo] = useState(null)

  useEffect(() => {
    const savedLang = localStorage.getItem('nurapp_lang') || 'bn'
    setLang(savedLang)
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
      calcRamadanInfo(parseInt(h.month.number), parseInt(h.day))
    } catch {}
    setLoading(false)
  }

  const calcRamadanInfo = (month, day) => {
    if (month === 9) {
      setRamadanInfo({ type: 'ongoing', daysGone: day, daysLeft: 30 - day })
    } else {
      let daysToRamadan = 0
      for (let m = month; m < 9; m++) daysToRamadan += 30
      daysToRamadan -= day
      if (daysToRamadan < 0) daysToRamadan += 354
      setRamadanInfo({ type: 'countdown', days: daysToRamadan })
    }
  }

  const toggleLang = () => {
    const nl = lang === 'bn' ? 'en' : 'bn'
    setLang(nl)
    localStorage.setItem('nurapp_lang', nl)
  }

  const monthEvents = EVENTS.filter(e => e.month === selectedMonth)
  const todayEvents = hijri ? EVENTS.filter(e => e.month === parseInt(hijri.month.number) && e.day === parseInt(hijri.day)) : []
  const upcomingEvents = hijri ? EVENTS.filter(e => {
    const cm = parseInt(hijri.month.number)
    const cd = parseInt(hijri.day)
    return (e.month > cm) || (e.month === cm && e.day > cd)
  }).slice(0, 6) : []

  const TABS = [
    { id: 'today', bn: 'আজ', en: 'Today' },
    { id: 'upcoming', bn: 'আসন্ন', en: 'Upcoming' },
    { id: 'months', bn: 'মাস', en: 'Months' },
    { id: 'events', bn: 'সব ইভেন্ট', en: 'All Events' },
    { id: 'info', bn: 'তথ্য', en: 'Info' },
  ]

  return (
    <main className="min-h-screen pb-28" style={{ background: 'var(--bg-primary)' }}>

      <header className="sticky top-0 z-50 header-blur">
        <div className="px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="btn-icon">
              <ChevronLeftIcon size={18} color="var(--text-secondary)" />
            </Link>
            <div>
              <h1 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                {lang === 'bn' ? 'ইসলামিক ক্যালেন্ডার' : 'Islamic Calendar'}
              </h1>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {lang === 'bn' ? 'হিজরি সন ও ইভেন্ট' : 'Hijri Calendar & Events'}
              </p>
            </div>
          </div>
          <button onClick={toggleLang} className="btn-icon">
            <span className="text-xs font-bold" style={{ color: 'var(--text-secondary)' }}>
              {lang === 'bn' ? 'EN' : 'বাং'}
            </span>
          </button>
        </div>
      </header>

      <div className="px-5 pt-5">

        {loading ? (
          <div className="space-y-3">
            <div className="shimmer h-40 rounded-3xl"></div>
            <div className="shimmer h-20 rounded-2xl"></div>
          </div>
        ) : (
          <>
            {/* Today Card */}
            {hijri && (
              <div className="rounded-3xl p-6 text-center mb-4"
                style={{ background: 'linear-gradient(135deg, #064e3b, #065f46)', border: '1px solid rgba(16,185,129,0.2)', boxShadow: '0 8px 32px rgba(16,185,129,0.15)' }}>
                <div className="flex items-center justify-center gap-2 mb-3">
                  <MoonIcon size={14} color="#fde68a" />
                  <p className="text-xs font-semibold" style={{ color: '#6ee7b7' }}>
                    {lang === 'bn' ? 'আজকের হিজরি তারিখ' : "Today's Hijri Date"}
                  </p>
                </div>
                <p className="font-arabic mb-1" style={{ fontSize: '32px', color: '#fde68a', lineHeight: '1.8' }}>
                  {hijri.day} {hijri.month.ar} {hijri.year}
                </p>
                <p className="text-2xl font-bold mb-1" style={{ color: 'white' }}>
                  {hijri.day} {lang === 'bn' ? HIJRI_MONTHS_BN[parseInt(hijri.month.number)-1] : hijri.month.en} {hijri.year} AH
                </p>
                <p className="text-sm" style={{ color: '#6ee7b7' }}>
                  {new Date().toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US', {
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                  })}
                </p>

                {/* Weekday in Arabic */}
                <div className="mt-3 inline-block px-4 py-1.5 rounded-full" style={{ background: 'rgba(0,0,0,0.2)' }}>
                  <p className="font-arabic text-lg" style={{ color: '#a7f3d0' }}>{hijri.weekday.ar}</p>
                </div>
              </div>
            )}

            {/* Ramadan Countdown */}
            {ramadanInfo && (
              <div className="rounded-2xl p-4 mb-4 flex items-center gap-4"
                style={{
                  background: ramadanInfo.type === 'ongoing' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.08)',
                  border: `1px solid ${ramadanInfo.type === 'ongoing' ? 'rgba(16,185,129,0.25)' : 'rgba(245,158,11,0.2)'}`
                }}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: ramadanInfo.type === 'ongoing' ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.15)' }}>
                  <MoonIcon size={22} color={ramadanInfo.type === 'ongoing' ? '#10b981' : '#f59e0b'} />
                </div>
                <div className="flex-1">
                  {ramadanInfo.type === 'ongoing' ? (
                    <>
                      <p className="font-bold" style={{ color: '#10b981' }}>
                        {lang === 'bn' ? 'রমজান মাস চলছে!' : 'Ramadan is Ongoing!'}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                        {lang === 'bn'
                          ? `${ramadanInfo.daysGone} দিন হয়েছে • আরো ${ramadanInfo.daysLeft} দিন বাকি`
                          : `${ramadanInfo.daysGone} days in • ${ramadanInfo.daysLeft} days remaining`}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="font-bold" style={{ color: '#f59e0b' }}>
                        {lang === 'bn' ? 'রমজান পর্যন্ত' : 'Until Ramadan'}
                      </p>
                      <p className="text-sm font-bold mt-0.5" style={{ color: 'white' }}>
                        {lang === 'bn' ? `আনুমানিক ${ramadanInfo.days} দিন বাকি` : `Approximately ${ramadanInfo.days} days remaining`}
                      </p>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Tabs */}
            <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-1 mb-5">
              {TABS.map(t => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className="flex-shrink-0 px-3 py-2 rounded-xl text-xs font-bold transition-all border"
                  style={{
                    background: tab === t.id ? 'rgba(16,185,129,0.15)' : 'transparent',
                    color: tab === t.id ? '#10b981' : 'var(--text-muted)',
                    borderColor: tab === t.id ? 'rgba(16,185,129,0.3)' : 'var(--border)'
                  }}>
                  {lang === 'bn' ? t.bn : t.en}
                </button>
              ))}
            </div>

            {/* Tab: Today */}
            {tab === 'today' && (
              <div>
                {todayEvents.length === 0 ? (
                  <div className="text-center py-12 rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                    <CalendarIcon size={40} color="var(--text-muted)" />
                    <p className="mt-3 font-semibold" style={{ color: 'var(--text-secondary)' }}>
                      {lang === 'bn' ? 'আজ কোনো বিশেষ দিন নেই' : 'No special events today'}
                    </p>
                    <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                      {lang === 'bn' ? 'তবুও প্রতিটি দিনই ইবাদতের সুযোগ' : 'Every day is an opportunity for worship'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {todayEvents.map((e, i) => (
                      <EventCard key={i} event={e} lang={lang} months={{ bn: HIJRI_MONTHS_BN, en: HIJRI_MONTHS_EN }} showDate />
                    ))}
                  </div>
                )}

                {/* Month Virtue */}
                {hijri && (
                  <div className="mt-4 card p-4">
                    <div className="flex items-start gap-3">
                      <InfoIcon size={16} color="#f59e0b" />
                      <div>
                        <p className="text-xs font-bold mb-1" style={{ color: '#f59e0b' }}>
                          {lang === 'bn' ? HIJRI_MONTHS_BN[parseInt(hijri.month.number)-1] + ' মাসের ফযিলত' : HIJRI_MONTHS_EN[parseInt(hijri.month.number)-1] + ' — Virtues'}
                        </p>
                        <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                          {lang === 'bn'
                            ? MONTH_INFO[parseInt(hijri.month.number)-1]?.virtue
                            : MONTH_INFO[parseInt(hijri.month.number)-1]?.virtueEn}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab: Upcoming */}
            {tab === 'upcoming' && (
              <div className="space-y-3">
                {upcomingEvents.length === 0 ? (
                  <div className="text-center py-12 rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                    <p className="font-semibold" style={{ color: 'var(--text-secondary)' }}>
                      {lang === 'bn' ? 'এই বছর আর কোনো ইভেন্ট নেই' : 'No more events this year'}
                    </p>
                  </div>
                ) : upcomingEvents.map((e, i) => (
                  <EventCard key={i} event={e} lang={lang} months={{ bn: HIJRI_MONTHS_BN, en: HIJRI_MONTHS_EN }} showDate />
                ))}
              </div>
            )}

            {/* Tab: Months */}
            {tab === 'months' && (
              <div>
                <div className="grid grid-cols-3 gap-2 mb-5">
                  {HIJRI_MONTHS_BN.map((m, i) => {
                    const isCurrentMonth = hijri && parseInt(hijri.month.number) === i+1
                    const hasEvents = EVENTS.some(e => e.month === i+1)
                    return (
                      <button key={i} onClick={() => setSelectedMonth(i+1)}
                        className="rounded-2xl p-3 text-center transition-all"
                        style={{
                          background: selectedMonth === i+1 ? 'rgba(16,185,129,0.15)' : 'var(--bg-card)',
                          border: selectedMonth === i+1 ? '1px solid rgba(16,185,129,0.35)' : isCurrentMonth ? '1px solid rgba(245,158,11,0.3)' : '1px solid var(--border)',
                        }}>
                        <p className="text-xs font-bold" style={{ color: 'var(--text-muted)', fontFamily: 'Inter' }}>
                          {i+1}
                        </p>
                        <p className="text-xs font-bold mt-0.5" style={{ color: selectedMonth === i+1 ? '#10b981' : isCurrentMonth ? '#f59e0b' : 'var(--text-secondary)' }}>
                          {lang === 'bn' ? m.split(' ')[0] : HIJRI_MONTHS_EN[i].split(' ')[0]}
                        </p>
                        {hasEvents && (
                          <div className="w-1.5 h-1.5 rounded-full mx-auto mt-1"
                            style={{ background: selectedMonth === i+1 ? '#10b981' : '#f59e0b' }}></div>
                        )}
                        {isCurrentMonth && (
                          <p className="text-xs mt-0.5" style={{ color: '#f59e0b', fontSize: '9px' }}>
                            {lang === 'bn' ? 'এখন' : 'Now'}
                          </p>
                        )}
                      </button>
                    )
                  })}
                </div>

                {selectedMonth && (
                  <div>
                    <div className="rounded-2xl overflow-hidden mb-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                      <div className="p-4" style={{ borderBottom: '1px solid var(--border)', background: 'rgba(16,185,129,0.05)' }}>
                        <p className="font-bold" style={{ color: '#10b981' }}>
                          {lang === 'bn' ? HIJRI_MONTHS_BN[selectedMonth-1] : HIJRI_MONTHS_EN[selectedMonth-1]}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                          {MONTH_INFO[selectedMonth-1]?.[lang === 'bn' ? 'virtue' : 'virtueEn']}
                        </p>
                      </div>
                      {monthEvents.length === 0 ? (
                        <p className="text-center py-6 text-sm" style={{ color: 'var(--text-muted)' }}>
                          {lang === 'bn' ? 'এই মাসে কোনো বিশেষ দিন নেই' : 'No special events this month'}
                        </p>
                      ) : (
                        <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
                          {monthEvents.map((e, i) => (
                            <div key={i} className="p-4 flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                                style={{ background: `${e.color}15`, border: `1px solid ${e.color}25` }}>
                                <span className="text-sm font-bold" style={{ color: e.color, fontFamily: 'Inter' }}>
                                  {e.day}
                                </span>
                              </div>
                              <div>
                                <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                                  {lang === 'bn' ? e.nameBn : e.nameEn}
                                </p>
                                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                                  {lang === 'bn' ? HIJRI_MONTHS_BN[selectedMonth-1] : HIJRI_MONTHS_EN[selectedMonth-1]} {e.day}
                                </p>
                              </div>
                              {e.important && (
                                <StarIcon size={14} color="#f59e0b" filled className="ml-auto" />
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab: All Events */}
            {tab === 'events' && (
              <div className="space-y-2">
                <p className="section-title">{lang === 'bn' ? 'সকল ইসলামিক দিবস' : 'All Islamic Events'}</p>
                {EVENTS.map((e, i) => (
                  <EventCard key={i} event={e} lang={lang} months={{ bn: HIJRI_MONTHS_BN, en: HIJRI_MONTHS_EN }} showDate />
                ))}
              </div>
            )}

            {/* Tab: Info */}
            {tab === 'info' && (
              <div className="space-y-3">
                <p className="section-title">{lang === 'bn' ? 'গুরুত্বপূর্ণ দিনসমূহ' : 'Important Days'}</p>
                {IMPORTANT_DAYS_INFO.map((info, i) => (
                  <div key={i} className="card p-5 animate-fadeInUp"
                    style={{ animationDelay: `${i * 0.05}s`, animationFillMode: 'forwards', opacity: 0 }}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background: `${info.color}15`, border: `1px solid ${info.color}25` }}>
                        <StarIcon size={18} color={info.color} filled />
                      </div>
                      <p className="font-bold" style={{ color: info.color }}>
                        {lang === 'bn' ? info.nameBn : info.nameEn}
                      </p>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      {lang === 'bn' ? info.infoBn : info.infoEn}
                    </p>
                  </div>
                ))}

                {/* Hijri Months Info */}
                <p className="section-title mt-4">{lang === 'bn' ? 'হিজরি মাসের পরিচয়' : 'Hijri Months'}</p>
                {HIJRI_MONTHS_BN.map((m, i) => (
                  <div key={i} className="card p-4 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.15)' }}>
                      <span className="text-xs font-bold" style={{ color: '#10b981', fontFamily: 'Inter' }}>{i+1}</span>
                    </div>
                    <div>
                      <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                        {lang === 'bn' ? m : HIJRI_MONTHS_EN[i]}
                      </p>
                      <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                        {lang === 'bn' ? MONTH_INFO[i]?.virtue : MONTH_INFO[i]?.virtueEn}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Copyright */}
            <div className="mt-6 py-4 text-center" style={{ borderTop: '1px solid var(--border)' }}>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {lang === 'bn' ? 'তৈরি করেছেন' : 'Developed by'}{' '}
                <span className="font-bold" style={{ color: '#10b981' }}>Muhammad Shourov</span>
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)', opacity: 0.5 }}>
                © 2026 NurApp • {lang === 'bn' ? 'সর্বস্বত্ব সংরক্ষিত' : 'All rights reserved'}
              </p>
            </div>
          </>
        )}
      </div>

      <BottomNav lang={lang} />
    </main>
  )
}

function EventCard({ event, lang, months, showDate }) {
  return (
    <div className="rounded-2xl p-4 flex items-center gap-3 transition-all"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
      <div className="w-12 h-12 rounded-2xl flex flex-col items-center justify-center flex-shrink-0"
        style={{ background: `${event.color}15`, border: `1px solid ${event.color}25` }}>
        <span className="text-lg font-bold" style={{ color: event.color, fontFamily: 'Inter', lineHeight: 1 }}>
          {event.day}
        </span>
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
            {lang === 'bn' ? event.nameBn : event.nameEn}
          </p>
          {event.important && <StarIcon size={12} color="#f59e0b" filled />}
        </div>
        {showDate && (
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {lang === 'bn' ? months.bn[event.month-1] : months.en[event.month-1]} {event.day}
          </p>
        )}
      </div>
    </div>
  )
}
