'use client'

import { useState } from 'react'
import Link from 'next/link'
import BottomNav from '../components/BottomNav'
import {
  HomeIcon, ClockIcon, QuranIcon,
  HandsIcon, TasbihIcon, ArrowRightIcon
} from '../components/Icons'

export default function NotFound() {
  const [lang, setLang] = useState('bn')

  const QUICK_LINKS = [
    { href: '/', Icon: HomeIcon, labelBn: 'হোম', labelEn: 'Home', color: '#10b981' },
    { href: '/prayer', Icon: ClockIcon, labelBn: 'নামাজ', labelEn: 'Prayer', color: '#f59e0b' },
    { href: '/quran', Icon: QuranIcon, labelBn: 'কোরআন', labelEn: 'Quran', color: '#10b981' },
    { href: '/dua', Icon: HandsIcon, labelBn: 'দোয়া', labelEn: 'Dua', color: '#8b5cf6' },
    { href: '/tasbih', Icon: TasbihIcon, labelBn: 'তাসবিহ', labelEn: 'Tasbih', color: '#f59e0b' },
  ]

  return (
    <main className="min-h-screen pb-28 flex flex-col" style={{ background: 'var(--bg-primary)' }}>

      {/* Header */}
      <header className="header-blur px-5 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 21h18M3 10h18M5 10V7a7 7 0 0 1 14 0v3M9 10v11M15 10v11M12 3V1"/>
              <circle cx="12" cy="7" r="1" fill="white"/>
            </svg>
          </div>
          <span className="font-bold" style={{ color: 'var(--text-primary)' }}>NurApp</span>
        </div>
        <button onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')} className="btn-icon">
          <span className="text-xs font-bold" style={{ color: 'var(--text-secondary)' }}>
            {lang === 'bn' ? 'EN' : 'বাং'}
          </span>
        </button>
      </header>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 py-10">

        {/* 404 Arabic */}
        <div className="text-center mb-8 animate-fadeInUp">
          <p className="font-arabic leading-loose"
            style={{ fontSize: '72px', color: '#fde68a' }}>
            ٤٠٤
          </p>
          <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            {lang === 'bn' ? 'পেজ পাওয়া যায়নি' : 'Page Not Found'}
          </h1>
          <p className="text-sm leading-relaxed max-w-xs mx-auto" style={{ color: 'var(--text-muted)' }}>
            {lang === 'bn'
              ? 'আপনি যে পেজটি খুঁজছেন সেটি নেই বা সরিয়ে ফেলা হয়েছে।'
              : 'The page you are looking for does not exist or has been moved.'}
          </p>
        </div>

        {/* Quran Verse */}
        <div className="arabic-card w-full max-w-sm mb-8 animate-fadeInUp" style={{ animationDelay: '0.1s', animationFillMode: 'forwards', opacity: 0 }}>
          <p className="font-arabic text-xl text-center leading-loose mb-3" style={{ color: '#fde68a' }}>
            وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا
          </p>
          <p className="text-xs text-center" style={{ color: '#10b981' }}>
            {lang === 'bn'
              ? '"যে আল্লাহকে ভয় করে, আল্লাহ তার জন্য পথ বের করে দেন।" — সূরা তালাক: ২'
              : '"Whoever fears Allah, He will make for him a way out." — Surah at-Talaq: 2'}
          </p>
        </div>

        {/* Home Button */}
        <Link href="/" className="w-full max-w-sm mb-4 animate-fadeInUp"
          style={{ animationDelay: '0.15s', animationFillMode: 'forwards', opacity: 0 }}>
          <div className="btn-primary w-full text-center rounded-2xl py-4 flex items-center justify-center gap-2">
            <HomeIcon size={18} color="white" />
            {lang === 'bn' ? 'হোমে ফিরে যান' : 'Go to Home'}
          </div>
        </Link>

        {/* Quick Links */}
        <div className="w-full max-w-sm animate-fadeInUp"
          style={{ animationDelay: '0.2s', animationFillMode: 'forwards', opacity: 0 }}>
          <p className="section-title text-center mb-3">
            {lang === 'bn' ? 'দ্রুত লিংক' : 'Quick Links'}
          </p>
          <div className="grid grid-cols-2 gap-2">
            {QUICK_LINKS.filter(l => l.href !== '/').map((link, i) => (
              <Link key={i} href={link.href}>
                <div className="card p-3 flex items-center gap-3 transition-all"
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = `${link.color}30`}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `${link.color}15` }}>
                    <link.Icon size={16} color={link.color} />
                  </div>
                  <span className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
                    {lang === 'bn' ? link.labelBn : link.labelEn}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center pb-4 px-5">
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          {lang === 'bn' ? 'তৈরি করেছেন' : 'Developed by'}{' '}
          <span className="font-bold" style={{ color: '#10b981' }}>Muhammad Shourov</span>
        </p>
        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)', opacity: 0.5 }}>
          © 2026 NurApp
        </p>
      </div>

      <BottomNav lang={lang} />
    </main>
  )
}
