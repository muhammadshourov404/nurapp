'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function NotFound() {
  const [lang, setLang] = useState('bn')

  return (
    <main className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4 pb-24">
      <div className="text-center max-w-sm">
        <p className="font-arabic text-8xl text-amber-300 mb-4 leading-loose">٤٠٤</p>
        <h1 className="text-white text-2xl font-bold mb-2">
          {lang === 'bn' ? 'পেজ পাওয়া যায়নি' : 'Page Not Found'}
        </h1>
        <p className="text-gray-500 text-sm mb-8">
          {lang === 'bn' ? 'আপনি যে পেজটি খুঁজছেন সেটি নেই।' : 'The page you are looking for does not exist.'}
        </p>

        <div className="space-y-3">
          <Link href="/"
            className="block w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 transition-all text-center">
            🏠 {lang === 'bn' ? 'হোমে ফিরে যান' : 'Go to Home'}
          </Link>
          <div className="grid grid-cols-2 gap-2">
            <Link href="/prayer" className="rounded-xl bg-white/10 hover:bg-white/20 text-white py-2.5 text-sm font-medium transition-all text-center">
              🕐 {lang === 'bn' ? 'নামাজ' : 'Prayer'}
            </Link>
            <Link href="/quran" className="rounded-xl bg-white/10 hover:bg-white/20 text-white py-2.5 text-sm font-medium transition-all text-center">
              📖 {lang === 'bn' ? 'কোরআন' : 'Quran'}
            </Link>
          </div>
        </div>

        <button onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
          className="mt-6 px-4 py-2 rounded-lg bg-white/5 text-gray-400 text-xs border border-white/10">
          {lang === 'bn' ? 'Switch to English' : 'বাংলায় দেখুন'}
        </button>
      </div>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-xl border-t border-white/10">
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
