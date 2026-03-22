'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { HomeIcon, ClockIcon, QuranIcon, HandsIcon, TasbihIcon } from './Icons'

const NAV_ITEMS = [
  { href: '/', labelBn: 'হোম', labelEn: 'Home', Icon: HomeIcon },
  { href: '/prayer', labelBn: 'নামাজ', labelEn: 'Prayer', Icon: ClockIcon },
  { href: '/quran', labelBn: 'কোরআন', labelEn: 'Quran', Icon: QuranIcon },
  { href: '/dua', labelBn: 'দোয়া', labelEn: 'Dua', Icon: HandsIcon },
  { href: '/tasbih', labelBn: 'তাসবিহ', labelEn: 'Tasbih', Icon: TasbihIcon },
]

export default function BottomNav({ lang = 'bn' }) {
  const pathname = usePathname()

  const isActive = (href) => {
    if (href === '/') return pathname === '/' || pathname === '/nurapp/' || pathname === '/nurapp'
    return pathname.includes(href)
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0a0a0f]/95 backdrop-blur-2xl border-t border-white/8">
      <div className="max-w-lg mx-auto flex items-center justify-around px-2 py-1.5 pb-safe">
        {NAV_ITEMS.map(({ href, labelBn, labelEn, Icon }) => {
          const active = isActive(href)
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-all duration-200 min-w-[56px] ${
                active
                  ? 'bg-emerald-500/15'
                  : 'hover:bg-white/5'
              }`}
            >
              <div className={`transition-all duration-200 ${active ? 'scale-110' : 'scale-100'}`}>
                <Icon
                  size={22}
                  color={active ? '#10b981' : '#6b7280'}
                />
              </div>
              <span className={`text-[10px] font-semibold tracking-wide transition-colors duration-200 ${
                active ? 'text-emerald-400' : 'text-gray-500'
              }`}>
                {lang === 'bn' ? labelBn : labelEn}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
