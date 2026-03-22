'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

export default function QiblaPage() {
  const [qiblaAngle, setQiblaAngle] = useState(null)
  const [compassAngle, setCompassAngle] = useState(0)
  const [location, setLocation] = useState(null)
  const [cityName, setCityName] = useState('')
  const [status, setStatus] = useState('loading')
  const [lang, setLang] = useState('bn')
  const [permissionGranted, setPermissionGranted] = useState(false)
  const [distance, setDistance] = useState(null)
  const intervalRef = useRef(null)

  useEffect(() => {
    getLocation()
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [])

  const getLocation = () => {
    setStatus('loading')
    navigator.geolocation?.getCurrentPosition(
      async pos => {
        const { latitude: lat, longitude: lon } = pos.coords
        setLocation({ lat, lon })
        const angle = calculateQibla(lat, lon)
        setQiblaAngle(angle)
        const dist = calculateDistance(lat, lon, 21.4225, 39.8262)
        setDistance(Math.round(dist))
        setStatus('success')
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`)
          const data = await res.json()
          setCityName(data.address?.city || data.address?.town || data.address?.county || '')
        } catch {}
      },
      () => {
        const lat = 23.8103, lon = 90.4125
        setLocation({ lat, lon })
        setQiblaAngle(calculateQibla(lat, lon))
        setDistance(Math.round(calculateDistance(lat, lon, 21.4225, 39.8262)))
        setCityName('ঢাকা')
        setStatus('default')
      }
    )
  }

  const requestCompass = () => {
    if (typeof DeviceOrientationEvent !== 'undefined' &&
      typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission()
        .then(r => {
          if (r === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation)
            setPermissionGranted(true)
          }
        }).catch(() => {})
    } else {
      window.addEventListener('deviceorientation', handleOrientation)
      setPermissionGranted(true)
    }
  }

  const handleOrientation = (e) => {
    if (e.webkitCompassHeading) {
      setCompassAngle(e.webkitCompassHeading)
    } else if (e.alpha !== null) {
      setCompassAngle(360 - e.alpha)
    }
  }

  const calculateQibla = (lat, lon) => {
    const KAABA_LAT = 21.4225
    const KAABA_LON = 39.8262
    const latR = lat * Math.PI / 180
    const lonR = lon * Math.PI / 180
    const kLatR = KAABA_LAT * Math.PI / 180
    const kLonR = KAABA_LON * Math.PI / 180
    const dLon = kLonR - lonR
    const y = Math.sin(dLon) * Math.cos(kLatR)
    const x = Math.cos(latR) * Math.sin(kLatR) - Math.sin(latR) * Math.cos(kLatR) * Math.cos(dLon)
    return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360
  }

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLon/2)**2
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  }

  const needleAngle = qiblaAngle !== null ? qiblaAngle - compassAngle : 0
  const isAligned = Math.abs(((needleAngle % 360) + 360) % 360) < 5 || Math.abs(((needleAngle % 360) + 360) % 360 - 360) < 5

  return (
    <main className="min-h-screen bg-gray-950 pb-24">
      <header className="sticky top-0 z-50 bg-gray-950/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all text-lg">←</Link>
            <h1 className="text-base font-bold text-white">🧭 {lang === 'bn' ? 'কিবলা দিকনির্দেশ' : 'Qibla Direction'}</h1>
          </div>
          <button onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
            className="px-3 py-1.5 rounded-lg bg-white/10 text-xs font-bold border border-white/10">
            {lang === 'bn' ? 'EN' : 'বাং'}
          </button>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-5">

        {/* Location Card */}
        <div className="rounded-2xl bg-gradient-to-br from-emerald-900 to-green-950 border border-emerald-700/30 p-4 mb-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-400 text-xs mb-1">📍 {lang === 'bn' ? 'আপনার অবস্থান' : 'Your Location'}</p>
              <p className="text-white font-bold">{cityName || (lang === 'bn' ? 'লোড হচ্ছে...' : 'Loading...')}</p>
              {location && (
                <p className="text-gray-400 text-xs mt-0.5">{location.lat.toFixed(4)}°N, {location.lon.toFixed(4)}°E</p>
              )}
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-xs">{lang === 'bn' ? 'কাবা থেকে দূরত্ব' : 'Distance to Kaaba'}</p>
              <p className="text-amber-300 font-bold text-lg">{distance ? `${distance.toLocaleString()} km` : '--'}</p>
              {qiblaAngle !== null && (
                <p className="text-emerald-300 text-xs">{lang === 'bn' ? `কিবলা: ${Math.round(qiblaAngle)}°` : `Qibla: ${Math.round(qiblaAngle)}°`}</p>
              )}
            </div>
          </div>
          <button onClick={getLocation}
            className="mt-3 w-full rounded-xl bg-white/10 hover:bg-white/20 py-2 text-white text-sm font-medium transition-all">
            🔄 {lang === 'bn' ? 'লোকেশন আপডেট করুন' : 'Update Location'}
          </button>
        </div>

        {/* Aligned Message */}
        {isAligned && permissionGranted && (
          <div className="rounded-2xl bg-emerald-600 p-4 text-center mb-4 animate-fadeInUp">
            <p className="text-white font-bold text-lg">🕋 {lang === 'bn' ? 'আপনি কিবলামুখী!' : 'You are facing Qibla!'}</p>
            <p className="text-emerald-100 text-sm">{lang === 'bn' ? 'সামনে কাবা শরীফ' : 'Kaaba is ahead of you'}</p>
          </div>
        )}

        {/* Compass */}
        <div className="flex justify-center mb-5">
          <div className="relative w-72 h-72">
            {/* Outer glow */}
            <div className={`absolute inset-0 rounded-full transition-all duration-500 ${isAligned && permissionGranted ? 'shadow-[0_0_40px_rgba(74,222,128,0.4)]' : ''}`}></div>

            {/* Compass Ring */}
            <div className="absolute inset-0 rounded-full bg-gray-900 border-2 border-emerald-600/30">

              {/* Degree marks */}
              {Array.from({ length: 72 }).map((_, i) => (
                <div key={i} className="absolute w-full h-full flex justify-center"
                  style={{ transform: `rotate(${i * 5}deg)` }}>
                  <div className={`mt-1 ${i % 18 === 0 ? 'w-0.5 h-5 bg-emerald-400' : i % 9 === 0 ? 'w-px h-3 bg-emerald-600' : 'w-px h-2 bg-gray-700'}`}></div>
                </div>
              ))}

              {/* Cardinal directions */}
              {[
                { label: 'N', angle: 0, color: 'text-red-400' },
                { label: 'E', angle: 90, color: 'text-gray-300' },
                { label: 'S', angle: 180, color: 'text-gray-300' },
                { label: 'W', angle: 270, color: 'text-gray-300' },
              ].map(d => (
                <div key={d.label} className="absolute inset-0 flex justify-center"
                  style={{ transform: `rotate(${d.angle}deg)` }}>
                  <span className={`mt-6 text-xs font-bold ${d.color}`}
                    style={{ transform: `rotate(-${d.angle}deg)` }}>{d.label}</span>
                </div>
              ))}

              {/* Qibla Needle */}
              {qiblaAngle !== null && (
                <div className="absolute inset-0 flex items-center justify-center transition-transform duration-300"
                  style={{ transform: `rotate(${needleAngle}deg)` }}>
                  {/* Up arrow (Qibla) */}
                  <div className="absolute flex flex-col items-center" style={{ bottom: '50%' }}>
                    <div className="text-2xl" style={{ marginBottom: '-4px' }}>🕋</div>
                    <div className={`w-1.5 rounded-full ${isAligned && permissionGranted ? 'bg-emerald-400 shadow-[0_0_10px_rgba(74,222,128,0.8)]' : 'bg-amber-400'}`}
                      style={{ height: '90px' }}></div>
                  </div>
                  {/* Down arrow */}
                  <div className="absolute flex flex-col items-center" style={{ top: '50%' }}>
                    <div className="w-1.5 bg-red-500 rounded-full" style={{ height: '60px' }}></div>
                  </div>
                </div>
              )}

              {/* Center */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className={`w-5 h-5 rounded-full border-2 border-gray-700 ${isAligned && permissionGranted ? 'bg-emerald-500' : 'bg-gray-600'}`}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Compass Permission */}
        {!permissionGranted && (
          <button onClick={requestCompass}
            className="w-full rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 py-4 text-white font-bold text-base mb-4 shadow-lg active:scale-95 transition-transform">
            🧭 {lang === 'bn' ? 'লাইভ কম্পাস চালু করুন' : 'Enable Live Compass'}
          </button>
        )}

        {/* Info Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-white/5 border border-white/10 p-4">
            <p className="text-emerald-400 text-xs font-bold mb-2">
              {lang === 'bn' ? '📱 কিভাবে ব্যবহার করবেন' : '📱 How to Use'}
            </p>
            <ul className="text-gray-400 text-xs space-y-1.5">
              <li>• {lang === 'bn' ? 'কম্পাস চালু করুন' : 'Enable compass'}</li>
              <li>• {lang === 'bn' ? 'ফোন সমতলে ধরুন' : 'Hold phone flat'}</li>
              <li>• {lang === 'bn' ? '🕋 দিকে মুখ করুন' : 'Face 🕋 direction'}</li>
            </ul>
          </div>
          <div className="rounded-xl bg-white/5 border border-white/10 p-4">
            <p className="text-amber-400 text-xs font-bold mb-2">🕋 {lang === 'bn' ? 'কাবা শরীফ' : 'Holy Kaaba'}</p>
            <p className="text-gray-400 text-xs">21.4225°N</p>
            <p className="text-gray-400 text-xs">39.8262°E</p>
            <p className="text-gray-400 text-xs mt-1">{lang === 'bn' ? 'মক্কা, সৌদি আরব' : 'Makkah, Saudi Arabia'}</p>
          </div>
        </div>

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
              className={`flex flex-col items-center gap-1 px-2 py-1 rounded-xl transition-all ${item.href === '/qibla' ? 'bg-emerald-600/20' : 'hover:bg-white/10'}`}>
              <span className="text-xl">{item.icon}</span>
              <span className={`text-xs ${item.href === '/qibla' ? 'text-emerald-400' : 'text-gray-400'}`}>{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </main>
  )
}
